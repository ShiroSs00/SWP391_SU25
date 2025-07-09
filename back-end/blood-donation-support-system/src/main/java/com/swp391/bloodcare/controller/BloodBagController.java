package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.BloodBagDTO;
import com.swp391.bloodcare.service.BloodBagService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/blood-bags")
@RequiredArgsConstructor
public class BloodBagController {

    private final BloodBagService bloodBagService;

    @PostMapping("/create/{afterDonationBloodId}")
    public ResponseEntity<ApiResponse<BloodBagDTO>> createBloodBag(
            @Valid @RequestBody BloodBagDTO dto,
            @PathVariable String afterDonationBloodId) {
        try {
            dto.setAfterDonationId(afterDonationBloodId);
            BloodBagDTO created = bloodBagService.createBloodBag(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new ApiResponse<>(true, "Tạo túi máu thành công", created)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage(), null)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(false, "Lỗi khi tạo túi máu: " + e.getMessage(), null)
            );
        }
    }

    @PutMapping("/update/{bagId}")
    public ResponseEntity<ApiResponse<BloodBagDTO>> updateBloodBag(
            @PathVariable String bagId,
            @Valid @RequestBody BloodBagDTO dto) {
        try {
            dto.setBagId(bagId);
            BloodBagDTO updated = bloodBagService.updateBloodBag(dto);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "✅ Cập nhật túi máu thành công", updated)
            );
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(false, e.getMessage(), null)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage(), null)
            );
        }
    }

    @DeleteMapping("/delete/{bagId}")
    public ResponseEntity<ApiResponse<Void>> deleteBloodBag(@PathVariable String bagId) {
        try {
            bloodBagService.deleteBloodBag(bagId);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "🗑️ Đã xóa túi máu thành công", null)
            );
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(false, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/find-by-afterid/{afterDonationId}")
    public ResponseEntity<ApiResponse<BloodBagDTO>> findByAfterDonationId(@PathVariable String afterDonationId) {
        try {
            BloodBagDTO bag = bloodBagService.findByAfterDonationId(afterDonationId);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "✅ Tìm thấy túi máu theo afterDonationId", bag)
            );
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse<>(false, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/getall")
    public ResponseEntity<ApiResponse<List<BloodBagDTO>>> getAllBloodBags() {
        List<BloodBagDTO> bags = bloodBagService.getAllBloodBags();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "✅ Lấy danh sách túi máu thành công", bags)
        );
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<ApiResponse<Map<String, List<String>>>> deleteMultipleBloodBags(@RequestBody List<String> bagIds) {
        Map<String, List<String>> result = bloodBagService.deleteBloodBags(bagIds);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Xóa túi máu hoàn tất", result)
        );
    }
}
