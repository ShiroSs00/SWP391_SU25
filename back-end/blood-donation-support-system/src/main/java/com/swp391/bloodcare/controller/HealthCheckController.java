package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.HealthCheckDTO;
import com.swp391.bloodcare.service.HealthCheckService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/healthcheck")
public class HealthCheckController {

    private final HealthCheckService healthCheckService;

    public HealthCheckController(HealthCheckService healthCheckService) {
        this.healthCheckService = healthCheckService;
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAllHealthCheck() {
        try {
            List<HealthCheckDTO> healthChecks = healthCheckService.getAllHealthChecks();
            return ResponseEntity.ok(healthChecks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy danh sách kiểm tra sức khỏe: " + e.getMessage()));
        }
    }

    @PutMapping("/update/{donationRegistrationId}")
    public ResponseEntity<?> updateHealthCheck(
            @PathVariable String donationRegistrationId,
            @RequestBody HealthCheckDTO updatedHealthCheckDTO) {
        try {
            HealthCheckDTO updated = healthCheckService.updateHealthCheckByDonationRegistrationId(donationRegistrationId, updatedHealthCheckDTO);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy đơn đăng ký hiến máu với ID: " + donationRegistrationId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Cập nhật kiểm tra sức khỏe thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/create/{donationRegistrationId}")
    public ResponseEntity<?> createHealthCheck(
            @PathVariable String donationRegistrationId,
            @RequestBody HealthCheckDTO healthCheckDTO) {
        try {
            HealthCheckDTO created = healthCheckService.createHealthCheck(donationRegistrationId, healthCheckDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy đơn đăng ký hiến máu với ID: " + donationRegistrationId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Tạo kiểm tra sức khỏe thất bại: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteHealthCheck(@PathVariable("id") String id) {
        try {
            HealthCheckDTO deleted = healthCheckService.deleteHealthCheck(id);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Đã xóa thành công bản ghi kiểm tra sức khỏe",
                    "data", deleted
            ));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "status", "error",
                            "message", "Không tìm thấy bản ghi với ID: " + id,
                            "details", e.getMessage()
                    ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "status", "error",
                            "message", "ID không hợp lệ",
                            "details", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Lỗi không xác định khi xóa HealthCheck",
                            "details", e.getMessage()
                    ));
        }
    }

    @GetMapping("/get-by-registration/{registrationId}")
    public ResponseEntity<?> getByRegistration(@PathVariable String registrationId) {
        try {
            HealthCheckDTO dto = healthCheckService.getHealthCheckByRegistration(registrationId);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy bản kiểm tra sức khỏe với mã đơn đăng ký: " + registrationId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy dữ liệu kiểm tra sức khỏe: " + e.getMessage()));
        }
    }
}

