package com.swp391.bloodcare.controller;

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

    @PostMapping("/create")
    public ResponseEntity<?> createBloodBag(@Valid @RequestBody BloodBagDTO dto) {
        try {
            BloodBagDTO created = bloodBagService.createBloodBag(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "status", "success",
                    "message", "✅ Tạo túi máu thành công",
                    "data", created
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "error",
                    "message", "Lỗi khi tạo túi máu",
                    "details", e.getMessage()
            ));
        }
    }

    @PutMapping("/update/{bagId}")
    public ResponseEntity<?> updateBloodBag( @PathVariable String bagId,@Valid @RequestBody BloodBagDTO dto) {
        try {
            dto.setBagId(bagId);
            BloodBagDTO updated = bloodBagService.updateBloodBag(dto);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "✅ Cập nhật túi máu thành công",
                    "data", updated
            ));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/delete/{bagId}")
    public ResponseEntity<?> deleteBloodBag(@PathVariable String bagId) {
        try {
            bloodBagService.deleteBloodBag(bagId);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "🗑️ Đã xóa túi máu thành công"
            ));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/find-by-afterid/{afterDonationId}")
    public ResponseEntity<?> findByAfterDonationId(@PathVariable String afterDonationId) {
        try {
            BloodBagDTO bag = bloodBagService.findByAfterDonationId(afterDonationId);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "✅ Tìm thấy túi máu theo afterDonationId",
                    "data", bag
            ));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAllBloodBags() {
        List<BloodBagDTO> bags = bloodBagService.getAllBloodBags();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "✅ Lấy danh sách túi máu thành công",
                "data", bags
        ));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<?> deleteMultipleBloodBags(@RequestBody List<String> bagIds) {
        Map<String, List<String>> result = bloodBagService.deleteBloodBags(bagIds);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Xóa túi máu hoàn tất",
                "details", result
        ));
    }


}
