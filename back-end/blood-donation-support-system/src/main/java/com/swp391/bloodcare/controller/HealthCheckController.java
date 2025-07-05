package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.HealthCheckDTO;
import com.swp391.bloodcare.service.HealthCheckService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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

    @PutMapping("/update/{healthCheckId}")
    public ResponseEntity<HealthCheckDTO> updateHealthCheck(
            @PathVariable String healthCheckId,
            @Valid @RequestBody HealthCheckDTO updatedHealthCheckDTO) {
        return ResponseEntity.ok(healthCheckService.updateHealthCheckById(healthCheckId, updatedHealthCheckDTO));
    }

    @PostMapping("/create/{registrationId}")
    public ResponseEntity<?> createHealthCheck(
            @PathVariable String registrationId,
            @Valid @RequestBody HealthCheckDTO dto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), err.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "errors", errors
            ));
        }

        try {
            HealthCheckDTO created = healthCheckService.createHealthCheck(registrationId, dto);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Tạo bản ghi kiểm tra sức khỏe thành công",
                    "data", created
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "message", e.getMessage()
            ));
        }
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
