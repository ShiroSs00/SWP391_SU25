package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.service.DonationRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/donation")
public class DonationRegistrationController {

    private final DonationRegistrationService donationRegistrationService;

    public DonationRegistrationController(DonationRegistrationService donationRegistrationService) {
        this.donationRegistrationService = donationRegistrationService;
    }

    @GetMapping("/getall")
    public ResponseEntity<List<DonationRegistrationDTO>> getAllDonationRegistration() {
        return ResponseEntity.ok(donationRegistrationService.getAllDonationRegistrations());
    }

    @GetMapping("/get-by-event/{eventId}")
    public ResponseEntity<List<DonationRegistrationDTO>> getByEventId(@PathVariable String eventId) {
        return ResponseEntity.ok(donationRegistrationService.getByEventId(eventId));
    }


    @PostMapping({"/create", "/create/{eventId}"})
    public ResponseEntity<?> createDonationRegistration(
            @PathVariable(name = "eventId", required = false) String eventId,
            @Valid @RequestBody DonationRegistrationDTO dto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String accountId = auth.getName();

            DonationRegistrationDTO saved = donationRegistrationService.createDonation(dto, accountId, eventId);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "status", "success",
                    "message", eventId == null ? "Tạo đăng ký hiến trực tiếp thành công!" : "Tạo đăng ký sự kiện thành công!",
                    "data", saved
            ));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "failed",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", "error",
                    "message", "Đã xảy ra lỗi khi tạo đơn đăng ký",
                    "error", e.getMessage()
            ));
        }
    }


    @PutMapping("/update-donation-date/{id}")
    public ResponseEntity<?> updateDonationDate(
            @PathVariable String id,
            @RequestBody Map<String, String> body // chứa "donationDate"
    ) {
        try {
            String dateStr = body.get("donationDate");
            if (dateStr == null || dateStr.isBlank()) {
                throw new IllegalArgumentException("Ngày hiến máu không được để trống");
            }

            LocalDate donationDate = LocalDate.parse(dateStr);
            DonationRegistrationDTO updated = donationRegistrationService.updateDonationDate(id, donationDate);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Cập nhật ngày hiến máu thành công",
                    "data", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "message", e.getMessage()
            ));
        }
    }

    @PatchMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body // chứa "status"
    ) {
        try {
            String status = body.get("status");
            if (status == null || status.isBlank()) {
                throw new IllegalArgumentException("Trạng thái không được để trống");
            }

            DonationRegistrationDTO updated = donationRegistrationService.updateStatusOnly(id, status);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Cập nhật trạng thái thành công",
                    "data", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "failed",
                    "message", e.getMessage()
            ));
        }
    }






    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDonationRegistration(@PathVariable String id) {
        donationRegistrationService.deleteDonationRegistration(id);
        return ResponseEntity.ok("✅ Xóa đơn đăng ký thành công với ID: " + id);
    }

    @GetMapping("get-by-id/{id}")
    public ResponseEntity<DonationRegistration> getDonationRegistrationById(@PathVariable String id) {
        DonationRegistration donation = donationRegistrationService.getDonationRegistrationById(id);
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/get-by-account/{accountId}")
    public ResponseEntity<List<DonationRegistrationDTO>> getByAccount(@PathVariable String accountId) {
        return ResponseEntity.ok(donationRegistrationService.getByAccountId(accountId));
    }

    @GetMapping("/get-by-account-and-event")
    public ResponseEntity<List<DonationRegistrationDTO>> getByAccountAndEvent(
            @RequestParam String accountId,
            @RequestParam String eventId) {
        return ResponseEntity.ok(donationRegistrationService.getByAccountIdAndEventId(accountId, eventId));
    }


    @GetMapping("/direct-donations")
    public ResponseEntity<List<DonationRegistrationDTO>> getDirectDonations() {
        return ResponseEntity.ok(donationRegistrationService.getDirectDonationRegistrations());
    }



    @DeleteMapping("/delete-multiple")
    public ResponseEntity<?> deleteMultipleRegistrations(@RequestBody List<String> ids) {
        var result = donationRegistrationService.deleteMultipleDonationRegistrationsSafe(ids);
        return ResponseEntity.ok().body(
                // Có thể format chuẩn với key: status, message, data
                Map.of(
                        "status", "partial-success",
                        "message", "Đã xử lý xóa danh sách đăng ký",
                        "data", result
                )
        );
    }

}
