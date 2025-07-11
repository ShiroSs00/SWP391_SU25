package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your_email@gmail.com"); // thay thế bằng email thật
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("✅ Email sent to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Gửi email thất bại tới " + to + ": " + e.getMessage());
        }
    }

    public void sendEmailsToAccounts(java.util.List<Account> accounts, String subject, String body) {
        for (Account acc : accounts) {
            if (acc.getEmail() != null && !acc.getEmail().isEmpty()) {
                sendEmail(acc.getEmail(), subject, body);
            } else {
                System.err.println("⚠️ Bỏ qua account không có email: " + acc.getAccountId());
            }
        }
    }

    public void sendEmailsToEmails(java.util.List<String> emails, String subject, String body) {
        for (String email : emails) {
            sendEmail(email, subject, body);
        }
    }


}
