package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.log.BloodNotificationRequest;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.service.AuthService;
import com.swp391.bloodcare.service.BloodNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/noti")
public class BloodNotificationController {

    @Autowired
    private BloodNotificationService bloodNotificationService;

    @Autowired
    private AuthService authService;

    @PostMapping("/send")
    public ResponseEntity<String> sendBloodRequest(
            @RequestBody BloodNotificationRequest request) {
        List<Account> accounts = authService.getAllAccounts();
        bloodNotificationService.sendEmailToAccounts(accounts, request.getSubject(), request.getContent());
        return ResponseEntity.ok("Emails sent successfully");
    }
}

