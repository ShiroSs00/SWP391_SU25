package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.service.DonationRegistrationService;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<List<DonationRegistrationDTO>>> getAllDonationRegistration() {
        List<DonationRegistrationDTO> list = donationRegistrationService.getAllDonationRegistrations();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy tất cả đơn đăng ký thành công", list));
    }

    @GetMapping("/get-by-event/{eventId}")
    public ResponseEntity<ApiResponse<List<DonationRegistrationDTO>>> getByEventId(@PathVariable String eventId) {
        List<DonationRegistrationDTO> list = donationRegistrationService.getByEventId(eventId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đăng ký theo sự kiện thành công", list));
    }

    @PostMapping({"/create", "/create/{eventId}"})
    public ResponseEntity<ApiResponse<DonationRegistrationDTO>> createDonationRegistration(
            @PathVariable(name = "eventId", required = false) String eventId,
            @Valid @RequestBody DonationRegistrationDTO dto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String accountId = auth.getName();
            dto.setEventId(eventId);
            DonationRegistrationDTO saved = donationRegistrationService.createDonation(dto, accountId);

            String msg = eventId == null ? "Tạo đăng ký hiến trực tiếp thành công!" : "Tạo đăng ký sự kiện thành công!";
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, msg, saved));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(false, "Đã xảy ra lỗi khi tạo đơn đăng ký", null));
        }
    }

    @PutMapping("/update-donation/{id}")
    public ResponseEntity<ApiResponse<DonationRegistrationDTO>> updateDonation(
            @PathVariable("id") String id,
            @RequestBody @Valid DonationRegistrationDTO dto) {
        try {
            DonationRegistrationDTO updated = donationRegistrationService.updateDonation(
                    id,
                    dto.getDonationDate(),
                    dto.getVolumeToTake()
            );
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thành công", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>(false, "Lỗi hệ thống: " + e.getMessage(), null));
        }
    }



    @PatchMapping("/update-status/{id}")
    public ResponseEntity<ApiResponse<DonationRegistrationDTO>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null || status.isBlank()) {
                throw new IllegalArgumentException("Trạng thái không được để trống");
            }

            DonationRegistration.Status statusEnum = DonationRegistration.Status.valueOf(status.toUpperCase());
            DonationRegistrationDTO updated = donationRegistrationService.updateStatusOnly(id, statusEnum);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái thành công", updated));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDonationRegistration(@PathVariable String id) {
        donationRegistrationService.deleteDonationRegistration(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "✅ Xóa đơn đăng ký thành công với ID: " + id, null));
    }

    @GetMapping("get-by-id/{id}")
    public ResponseEntity<ApiResponse<DonationRegistration>> getDonationRegistrationById(@PathVariable String id) {
        DonationRegistration donation = donationRegistrationService.getDonationRegistrationById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy đơn đăng ký theo ID thành công", donation));
    }

    @GetMapping("/get-by-account/{accountId}")
    public ResponseEntity<ApiResponse<List<DonationRegistrationDTO>>> getByAccount(@PathVariable String accountId) {
        List<DonationRegistrationDTO> list = donationRegistrationService.getByAccountId(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy đơn đăng ký theo tài khoản thành công", list));
    }

    @GetMapping("/get-by-account-and-event")
    public ResponseEntity<ApiResponse<List<DonationRegistrationDTO>>> getByAccountAndEvent(
            @RequestParam String accountId,
            @RequestParam String eventId) {
        List<DonationRegistrationDTO> list = donationRegistrationService.getByAccountIdAndEventId(accountId, eventId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy đơn đăng ký theo tài khoản & sự kiện thành công", list));
    }

    @GetMapping("/direct-donations")
    public ResponseEntity<ApiResponse<List<DonationRegistrationDTO>>> getDirectDonations() {
        List<DonationRegistrationDTO> list = donationRegistrationService.getDirectDonationRegistrations();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đăng ký trực tiếp thành công", list));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteMultipleRegistrations(@RequestBody List<String> ids) {
        Map<String, Object> result = donationRegistrationService.deleteMultipleDonationRegistrationsSafe(ids);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xử lý xóa danh sách đăng ký", result));
    }


}
