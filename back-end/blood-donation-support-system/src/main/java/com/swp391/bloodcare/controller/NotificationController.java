package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
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

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<String>> sendToOne(@Valid @RequestBody NotificationDTO dto) {
        notificationService.sendNotification(dto);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Gửi thông báo thành công.",
                "Đã gửi đến tài khoản: " + dto.getAccountId()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-multiple")
    public ResponseEntity<ApiResponse<String>> sendToMany(@Valid @RequestBody List<NotificationDTO> dtoList) {
        if (dtoList.isEmpty()) {
            ApiResponse<String> errorResponse = new ApiResponse<>(
                    false,
                    "Danh sách thông báo không được trống.",
                    null
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }

        int count = notificationService.sendNotifications(dtoList);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Gửi thông báo thành công.",
                "Đã gửi đến " + count + " người dùng."
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getNotificationsByAccount(@PathVariable String accountId) {
        List<NotificationDTO> notifications = notificationService.getNotificationsByAccount(accountId);
        ApiResponse<List<NotificationDTO>> response = new ApiResponse<>(
                true,
                "Lấy thông báo thành công.",
                notifications
        );
        return ResponseEntity.ok(response);
    }
}
