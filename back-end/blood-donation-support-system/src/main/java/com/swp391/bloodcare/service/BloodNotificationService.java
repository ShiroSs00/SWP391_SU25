package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Blood;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BloodNotificationService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private BloodRepository bloodRepository;


    public void sendEmailToAccounts(List<Account> accounts, String subject, String body) {
        for (Account account : accounts) {
            String to = account.getEmail();
            emailSender.sendSimpleEmail(to, subject, body);
        }
    }
}
