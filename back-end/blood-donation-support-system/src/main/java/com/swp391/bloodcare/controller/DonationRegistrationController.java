package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.service.DonationRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/create/{id}")
    public ResponseEntity<DonationRegistrationDTO> createDonationRegistration(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        DonationRegistrationDTO savedRegistration = donationRegistrationService.createDonationByUsername(username, id);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRegistration);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DonationRegistrationDTO> updateDonationRegistration(
            @PathVariable String id,
            @RequestBody DonationRegistration donationRegistration
    ) {
        DonationRegistrationDTO result = donationRegistrationService.updateDonationRegistration(id, donationRegistration);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDonationRegistration(@PathVariable String id) {
        donationRegistrationService.deleteDonationRegistration(id);
        return ResponseEntity.ok("✅ Xóa đơn đăng ký thành công với ID: " + id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationRegistration> getDonationRegistrationById(@PathVariable String id) {
        DonationRegistration donation = donationRegistrationService.getDonationRegistrationById(id);
        return ResponseEntity.ok(donation);
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
