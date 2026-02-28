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
    private String toEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Portfolio Password Reset OTP");
        message.setText("Your OTP for password reset is: " + otp + "\n\nThis OTP is valid for 5 minutes.");

        mailSender.send(message);
    }

    public void sendContactEmail(EmailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(toEmail);
        message.setTo(toEmail); // Sending to oneself
        message.setSubject("New Portfolio Contact from: " + request.getName());
        message.setText("You have received a new message from your portfolio website.\n\n" +
                "Name: " + request.getName() + "\n" +
                "Email: " + request.getEmail() + "\n\n" +
                "Message:\n" + request.getMessage());

        mailSender.send(message);
    }
}
