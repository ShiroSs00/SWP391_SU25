package com.swp391.bloodcare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSender {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleEmail(String to, String subject, String body) {
        int maxRetries = 3;
        int retryCount = 0;
        while (retryCount < maxRetries) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("your_email@gmail.com");
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("✅ Email sent to: " + to);
                return;
            } catch (Exception e) {
                retryCount++;
                System.err.println("❌ Attempt " + retryCount + " failed for " + to + ": " + e.getMessage());
                if (retryCount == maxRetries) {
                    // Log nặng hơn hoặc gửi cảnh báo nếu cần
                    System.err.println("🚨 Gửi email thất bại sau nhiều lần thử cho: " + to);
                }
            }
        }
    }

}

