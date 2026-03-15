package com.chandan.ChandanSpringDev.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.chandan.ChandanSpringDev.model.EmailRequest;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api-key:}")
    private String resendApiKey;

    @Value("${spring.mail.username:onboarding@resend.dev}")
    private String fromEmail;

    // The inbox that receives contact form submissions.
    // Set CONTACT_RECIPIENT_EMAIL env-var on Render to your Gmail address.
    @Value("${contact.recipient.email:}")
    private String contactRecipientEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends an OTP email for password reset.
     * 
     * @param toEmail the admin's email address to send OTP to
     * @param otp     the 6-digit OTP
     */
    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Portfolio Admin - Password Reset OTP";
        String htmlBody = "<p>Hello,</p>" +
                "<p>You requested a password reset for your portfolio admin account.</p>" +
                "<p>Your OTP code is: <strong>" + otp + "</strong></p>" +
                "<p>This OTP is valid for 5 minutes.</p>" +
                "<p>If you did not request this, please ignore this email.</p>" +
                "<p>- Portfolio Admin System</p>";

        sendResendEmail(toEmail, subject, htmlBody, null);
    }

    /**
     * Sends an OTP to the master admin email for approving a new admin
     * registration.
     * 
     * @param masterAdminEmail the master admin's email (receives the OTP)
     * @param newAdminEmail    the email of the new admin requesting access
     * @param otp              the 6-digit OTP
     */
    public void sendAdminRegistrationOtp(String masterAdminEmail, String newAdminEmail, String otp) {
        String subject = "Portfolio Admin - New Admin Registration Request";
        String htmlBody = "<p>Hello,</p>" +
                "<p>A new admin registration has been requested for your portfolio:</p>" +
                "<p><strong>New Admin Email:</strong> " + newAdminEmail + "</p>" +
                "<p>To APPROVE this registration, share the OTP below with the requester:</p>" +
                "<p>OTP: <strong>" + otp + "</strong></p>" +
                "<p>This OTP expires in 5 minutes.</p>" +
                "<p>If you did not initiate this, you can safely ignore this email.</p>" +
                "<p>- Portfolio Admin System</p>";

        sendResendEmail(masterAdminEmail, subject, htmlBody, null);
    }

    /**
     * Sends a contact form message to the portfolio owner.
     */
    public void sendContactEmail(EmailRequest request) {
        String subject = "New Portfolio Contact from: " + request.getName();
        String htmlBody = "<p>You have received a new message from your portfolio website.</p>" +
                "<p><strong>From:</strong> " + request.getName() + "<br/>" +
                "<strong>Email:</strong> " + request.getEmail() + "</p>" +
                "<blockquote>" + request.getMessage().replace("\n", "<br/>") + "</blockquote>" +
                "<hr/>" +
                "<p><em>Reply directly to this email to respond to " + request.getName() + ".</em></p>";

        // Send to the configured contact recipient (owner's inbox).
        // Falls back to fromEmail if CONTACT_RECIPIENT_EMAIL is not set.
        String toEmail = (contactRecipientEmail != null && !contactRecipientEmail.isEmpty())
                ? contactRecipientEmail
                : fromEmail;

        System.out.println("[ContactEmail] Sending contact email from '" + request.getName()
                + "' to inbox: " + toEmail);

        // Pass visitor email as reply-to so portfolio owner can reply directly
        sendResendEmail(toEmail, subject, htmlBody, request.getEmail());
    }

    /**
     * Internal helper to make the HTTP POST request to the Resend API
     */
    private void sendResendEmail(String toEmail, String subject, String htmlBody, String replyToUser) {
        if (resendApiKey == null || resendApiKey.isEmpty()) {
            throw new RuntimeException("RESEND_API_KEY is not configured.");
        }

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> body = new HashMap<>();

        // Resend officially requires a verified domain to change the 'from' address.
        // For testing/free tiers, from must exactly be onboarding@resend.dev.
        // If we haven't configured a custom fromEmail, use their default testing domain
        if (fromEmail != null && fromEmail.endsWith("@gmail.com")) {
            body.put("from", "Acme <onboarding@resend.dev>");
        } else {
            // Allows using a verified domain
            body.put("from", "Portfolio <" + fromEmail + ">");
        }

        body.put("to", toEmail);
        body.put("subject", subject);
        body.put("html", htmlBody);

        if (replyToUser != null && !replyToUser.isEmpty()) {
            body.put("reply_to", replyToUser);
        }

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to send email via Resend API. Status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to Resend API: " + e.getMessage(), e);
        }
    }
}
