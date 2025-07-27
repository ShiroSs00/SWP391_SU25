package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.AfterDonationBloodDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.request.BloodBagCreateRequest;
import com.swp391.bloodcare.service.AfterDonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/after-donation")
public class AfterDonationBloodController {

    private final AfterDonationService afterDonationService;

    public AfterDonationBloodController(AfterDonationService afterDonationService) {
        this.afterDonationService = afterDonationService;
    }

    @GetMapping("/getall")
    public ResponseEntity<ApiResponse<List<AfterDonationBloodDTO>>> getAll() {
        List<AfterDonationBloodDTO> data = afterDonationService.getAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy tất cả bản ghi sau hiến thành công", data));
    }

    @PostMapping("/create/{healthCheckId}")
    public ResponseEntity<ApiResponse<AfterDonationBloodDTO>> create(
            @PathVariable String healthCheckId,
            @Valid @RequestBody AfterDonationBloodDTO dto) {
        dto.setHealthCheckId(healthCheckId);
        AfterDonationBloodDTO created = afterDonationService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Tạo bản ghi sau hiến thành công", created));
    }

    @PostMapping("/manual-separate")
    public ResponseEntity<?> separateManual(@Valid @RequestBody BloodBagCreateRequest request) {
        return ResponseEntity.ok(afterDonationService.separateManually(request));
    }



    @PutMapping("/update/{idAfterDonation}")
    public ResponseEntity<ApiResponse<AfterDonationBloodDTO>> update(
            @PathVariable String idAfterDonation,
            @Valid @RequestBody AfterDonationBloodDTO dto) {
        AfterDonationBloodDTO updated = afterDonationService.update(idAfterDonation, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật bản ghi sau hiến thành công", updated));
    }

    @GetMapping("/get-by-healthcheck/{healthCheckId}")
    public ResponseEntity<ApiResponse<AfterDonationBloodDTO>> getByHealthCheck(@PathVariable String healthCheckId) {
        AfterDonationBloodDTO result = afterDonationService.getByHealthCheckId(healthCheckId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy bản ghi theo kiểm tra sức khỏe thành công", result));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<AfterDonationBloodDTO>> delete(@PathVariable String id) {
        AfterDonationBloodDTO deleted = afterDonationService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa bản ghi sau hiến", deleted));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteMultiple(@RequestBody List<String> ids) {
        Map<String, Object> result = afterDonationService.deleteMultiple(ids);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xử lý danh sách xóa", result));
    }
}
