package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.service.DonationRegistrationService;
import jakarta.persistence.EntityNotFoundException;
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
    public ResponseEntity<?> getAllDonationRegistration() {
        try {
            List<DonationRegistrationDTO> registrations = donationRegistrationService.getAllDonationRegistrations();
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❗ Lỗi khi lấy danh sách đơn đăng ký: " + e.getMessage());
        }
    }

    @PostMapping("/create/{id}")
    public ResponseEntity<?> createDonationRegistration(
            @PathVariable String id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            DonationRegistrationDTO savedRegistration = donationRegistrationService.createDonationByUsername(username, id);
            return new ResponseEntity<>(savedRegistration, HttpStatus.CREATED);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Không tìm thấy sự kiện với ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❗ Lỗi khi tạo đơn đăng ký hiến máu: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDonationRegistration(
            @PathVariable String id,
            @RequestBody DonationRegistration donationRegistration
    ) {
        try {
            DonationRegistrationDTO result = donationRegistrationService.updateDonationRegistration(id, donationRegistration);
            return ResponseEntity.ok(result);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Không tìm thấy đơn đăng ký hiến máu với ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❗ Lỗi khi cập nhật đơn đăng ký: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDonationRegistration(@PathVariable String id) {
        try {
            donationRegistrationService.deleteDonationRegistration(id);
            return ResponseEntity.ok("✅ Xóa đơn đăng ký thành công với ID: " + id);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Không tìm thấy đơn đăng ký để xóa với ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❗ Lỗi khi xóa đơn đăng ký: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDonationRegistrationById(@PathVariable String id) {
        DonationRegistration donation = donationRegistrationService.getDonationRegistrationById(id);
        if (donation != null) {
            return ResponseEntity.ok(donation);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy đăng ký với ID: " + id));
        }
    }
}
