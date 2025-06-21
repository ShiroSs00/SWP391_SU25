package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.HealthCheckDTO;
import com.swp391.bloodcare.service.HealthCheckService;
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
    public ResponseEntity<List<HealthCheckDTO>> getAllHealthCheck() {
        return ResponseEntity.ok(healthCheckService.getAllHealthChecks());
    }

    @PutMapping("/update/{donationRegistrationId}")
    public ResponseEntity<HealthCheckDTO> updateHealthCheck(
            @PathVariable String donationRegistrationId,
            @RequestBody HealthCheckDTO updatedHealthCheckDTO) {
        return ResponseEntity.ok(healthCheckService.updateHealthCheckByDonationRegistrationId(donationRegistrationId, updatedHealthCheckDTO));
    }

    @PostMapping("/create/{donationRegistrationId}")
    public ResponseEntity<HealthCheckDTO> createHealthCheck(
            @PathVariable String donationRegistrationId,
            @RequestBody HealthCheckDTO healthCheckDTO) {
        HealthCheckDTO created = healthCheckService.createHealthCheck(donationRegistrationId, healthCheckDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteHealthCheck(@PathVariable String id) {
        HealthCheckDTO deleted = healthCheckService.deleteHealthCheck(id);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Đã xóa thành công bản ghi kiểm tra sức khỏe",
                "data", deleted
        ));
    }

    @GetMapping("/get-by-registration/{registrationId}")
    public ResponseEntity<HealthCheckDTO> getByRegistration(@PathVariable String registrationId) {
        return ResponseEntity.ok(healthCheckService.getHealthCheckByRegistration(registrationId));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<Map<String, Object>> deleteMultipleHealthChecks(@RequestBody List<String> ids) {
        Map<String, Object> result = healthCheckService.deleteMultipleHealthChecksSafe(ids);
        return ResponseEntity.ok(Map.of(
                "status", "partial-success",
                "message", "Đã xử lý xóa danh sách kiểm tra sức khỏe",
                "data", result
        ));
    }

}
