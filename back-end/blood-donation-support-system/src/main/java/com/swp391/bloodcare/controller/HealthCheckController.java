package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
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
    public ResponseEntity<ApiResponse<List<HealthCheckDTO>>> getAllHealthCheck() {
        List<HealthCheckDTO> list = healthCheckService.getAllHealthChecks();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy tất cả bản ghi kiểm tra sức khỏe thành công", list));
    }

    @PutMapping("/update/{healthCheckId}")
    public ResponseEntity<ApiResponse<HealthCheckDTO>> updateHealthCheck(
            @PathVariable String healthCheckId,
            @Valid @RequestBody HealthCheckDTO updatedHealthCheckDTO,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Dữ liệu không hợp lệ", null, errors));
        }

        HealthCheckDTO updated = healthCheckService.updateHealthCheckById(healthCheckId, updatedHealthCheckDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật bản ghi thành công", updated));
    }


    @PostMapping("/create/{registrationId}")
    public ResponseEntity<ApiResponse<HealthCheckDTO>> createHealthCheck(
            @PathVariable String registrationId,
            @Valid @RequestBody HealthCheckDTO dto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), err.getDefaultMessage())
            );
            ApiResponse<HealthCheckDTO> response = new ApiResponse<>(false, "Dữ liệu không hợp lệ", null, errors);
            return ResponseEntity.badRequest().body(response);
        }

        try {
            HealthCheckDTO created = healthCheckService.createHealthCheck(registrationId, dto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Tạo bản ghi kiểm tra sức khỏe thành công", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage(), null)
            );
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<HealthCheckDTO>> deleteHealthCheck(@PathVariable String id) {
        HealthCheckDTO deleted = healthCheckService.deleteHealthCheck(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa thành công bản ghi kiểm tra sức khỏe", deleted));
    }

    @GetMapping("/get-by-registration/{registrationId}")
    public ResponseEntity<ApiResponse<HealthCheckDTO>> getByRegistration(@PathVariable String registrationId) {
        HealthCheckDTO dto = healthCheckService.getHealthCheckByRegistration(registrationId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy bản ghi thành công", dto));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteMultipleHealthChecks(@RequestBody List<String> ids) {
        Map<String, Object> result = healthCheckService.deleteMultipleHealthChecksSafe(ids);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xử lý xóa danh sách kiểm tra sức khỏe", result));
    }
}
