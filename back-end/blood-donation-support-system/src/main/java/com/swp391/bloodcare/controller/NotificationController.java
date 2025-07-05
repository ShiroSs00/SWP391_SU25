package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.NotificationDTO;
import com.swp391.bloodcare.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ✅ Gửi thông báo cho 1 người
    @PostMapping("/send")
    public ResponseEntity<?> sendToOne(@Valid @RequestBody NotificationDTO dto) {
        notificationService.sendNotification(dto);
        return ResponseEntity.ok("Đã gửi thông báo đến " + dto.getAccountId());
    }

    // ✅ Gửi thông báo cho nhiều người
    @PostMapping("/send-multiple")
    public ResponseEntity<?> sendToMany(@Valid @RequestBody List<NotificationDTO> dtoList) {
        if (dtoList.isEmpty()) {
            return ResponseEntity.badRequest().body("Danh sách thông báo không được trống");
        }

        int count = notificationService.sendNotifications(dtoList);
        return ResponseEntity.ok("Đã gửi thông báo đến " + count + " người dùng.");
    }

    // ✅ Lấy thông báo của một account
    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getNotificationsByAccount(@PathVariable String accountId) {
        return ResponseEntity.ok(notificationService.getNotificationsByAccount(accountId));
    }
}
