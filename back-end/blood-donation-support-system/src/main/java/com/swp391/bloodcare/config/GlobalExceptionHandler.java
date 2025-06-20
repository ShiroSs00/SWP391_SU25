package com.swp391.bloodcare.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        // In ra console
        ex.printStackTrace(); // BẮT BUỘC để thấy lỗi gốc trong console
        return new ResponseEntity<>("Lỗi hệ thống: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UsernameNotFoundException ex) {
        System.out.println("❌ Username không tồn tại: " + ex.getMessage());
        return new ResponseEntity<>("Không tìm thấy người dùng", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
        System.out.println("🚫 Truy cập bị từ chối: " + ex.getMessage());
        return new ResponseEntity<>("Bạn không có quyền truy cập", HttpStatus.FORBIDDEN);
    }

}
