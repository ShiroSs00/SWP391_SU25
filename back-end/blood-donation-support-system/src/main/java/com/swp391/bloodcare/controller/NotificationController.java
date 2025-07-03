package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.service.NotificationService;
import com.swp391.bloodcare.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AccountRepository accountRepository;

    // ✅ Gửi thông báo cho 1 người
    @PostMapping("/send/{accountId}")
    public ResponseEntity<?> sendToOne(
            @PathVariable String accountId,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String img
    ) {
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy account"));

        notificationService.sendNotificationToAccount(acc, title, content, img);
        return ResponseEntity.ok("📨 Đã gửi thông báo đến " + acc.getProfile().getName());
    }

    // ✅ Gửi thông báo cho nhiều người
    @PostMapping("/send-multiple")
    public ResponseEntity<?> sendToMany(
            @RequestBody List<String> accountIds,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) String img
    ) {
        List<Account> accounts = accountRepository.findAllById(accountIds);

        if (accounts.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Không có account nào hợp lệ");
        }

        notificationService.sendNotificationsToAccounts(accounts, title, content, img);
        return ResponseEntity.ok("📨 Đã gửi thông báo đến " + accounts.size() + " người dùng.");
    }

    // ✅ (Tùy chọn) Lấy tất cả thông báo của user
    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getNotificationsByAccount(@PathVariable String accountId) {
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy account"));

        return ResponseEntity.ok(acc.getNotifications()); // nếu mappedBy
    }
}
