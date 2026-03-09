package com.chandan.ChandanSpringDev.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.chandan.ChandanSpringDev.model.EmailRequest;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends an OTP email for password reset.
     * 
     * @param toEmail the admin's email address to send OTP to
     * @param otp     the 6-digit OTP
     */
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Portfolio Admin - Password Reset OTP");
        message.setText(
                "Hello,\n\n" +
                        "You requested a password reset for your portfolio admin account.\n\n" +
                        "Your OTP code is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "- Portfolio Admin System");
        mailSender.send(message);
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
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(masterAdminEmail);
        message.setSubject("Portfolio Admin - New Admin Registration Request");
        message.setText(
                "Hello,\n\n" +
                        "A new admin registration has been requested for your portfolio:\n\n" +
                        "New Admin Email: " + newAdminEmail + "\n\n" +
                        "To APPROVE this registration, share the OTP below with the requester:\n\n" +
                        "OTP: " + otp + "\n\n" +
                        "This OTP expires in 5 minutes.\n\n" +
                        "If you did not initiate this, you can safely ignore this email.\n\n" +
                        "- Portfolio Admin System");
        mailSender.send(message);
    }

    /**
     * Sends a contact form message to the portfolio owner.
     */
    public void sendContactEmail(EmailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(fromEmail); // Send to portfolio owner
        message.setReplyTo(request.getEmail()); // Reply goes to the sender
        message.setSubject("New Portfolio Contact from: " + request.getName());
        message.setText(
                "You have received a new message from your portfolio website.\n\n" +
                        "From: " + request.getName() + "\n" +
                        "Email: " + request.getEmail() + "\n\n" +
                        "Message:\n" + request.getMessage() + "\n\n" +
                        "---\n" +
                        "You can reply directly to this email to respond to " + request.getName() + ".");
        mailSender.send(message);
    }
}
