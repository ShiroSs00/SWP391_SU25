package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.AfterDonationBloodDTO;
import com.swp391.bloodcare.service.AfterDonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<AfterDonationBloodDTO>> getAll() {
        return ResponseEntity.ok(afterDonationService.getAll());
    }

    @PostMapping("/create/{healthCheckId}")
    public ResponseEntity<AfterDonationBloodDTO> create(@PathVariable String healthCheckId,
                                                        @Valid @RequestBody AfterDonationBloodDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                afterDonationService.create(healthCheckId, dto)
        );
    }

    @PutMapping("/update/{idAfterDonation}")
    public ResponseEntity<AfterDonationBloodDTO> update(@PathVariable String idAfterDonation,
                                                        @Valid @RequestBody AfterDonationBloodDTO dto) {
        return ResponseEntity.ok(
                afterDonationService.updateById(idAfterDonation, dto)
        );
    }



    @GetMapping("/get-by-healthcheck/{healthCheckId}")
    public ResponseEntity<AfterDonationBloodDTO> getByHealthCheck(@PathVariable String healthCheckId) {
        return ResponseEntity.ok(
                afterDonationService.getByHealthCheckId(healthCheckId)
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        AfterDonationBloodDTO deleted = afterDonationService.delete(id);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Đã xóa bản ghi sau hiến",
                "data", deleted
        ));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<Map<String, Object>> deleteMultiple(@RequestBody List<String> ids) {
        Map<String, Object> result = afterDonationService.deleteMultiple(ids);
        return ResponseEntity.ok(Map.of(
                "status", "partial-success",
                "message", "Đã xử lý danh sách xóa",
                "data", result
        ));
    }
}
