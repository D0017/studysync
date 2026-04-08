package com.StudySync.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String rawToken) {
        String resetLink = frontendBaseUrl + "/reset-password?token=" +
                URLEncoder.encode(rawToken, StandardCharsets.UTF_8);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("StudySync Password Reset");
        message.setText(
                "We received a request to reset your StudySync password.\n\n" +
                        "Use the link below to reset your password:\n" +
                        resetLink + "\n\n" +
                        "This link will expire in 20 minutes.\n\n" +
                        "If you did not request this, please ignore this email."
        );

        mailSender.send(message);
    }
}