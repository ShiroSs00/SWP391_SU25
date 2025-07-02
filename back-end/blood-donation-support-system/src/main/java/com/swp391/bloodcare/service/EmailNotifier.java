package com.swp391.bloodcare.service;

import com.swp391.bloodcare.repository.Notifier;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmailNotifier implements Notifier {
    private final JavaMailSender mailSender;

    public EmailNotifier(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private boolean isValidEmail(String email) {
        String regex = "^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$";
        return email != null && email.matches(regex);
    }

    @Override
    public void send(String to, String subject, String body) {
        if (!isValidEmail(to)) {
            throw new IllegalArgumentException("❌ Email không hợp lệ: " + to);
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your_email@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("❌ Không gửi được email tới " + to + ": " + e.getMessage(), e);
        }
    }


    @Override
    public void sendToMany(List<String> toList, String subject, String body) {
        for (String to : toList) {
            try {
                send(to, subject, body);
            } catch (Exception e) {
                System.err.println("⚠️ Không gửi được tới " + to + ": " + e.getMessage());
            }
        }
    }


    @Override
    public String getChannel() {
        return "email";
    }
}
