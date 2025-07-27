package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.PageResponse;
import com.swp391.bloodcare.dto.account.AccountRegistrationDTO;
import com.swp391.bloodcare.dto.account.AccountSearchDTO;
import com.swp391.bloodcare.dto.profile.ProfileResponseDTO;
import com.swp391.bloodcare.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

// lấy của profile của current user
    @GetMapping("/profile")
    public ApiResponse<ProfileResponseDTO> getUserProfile() {
       return profileService.getProfileFromToken();
    }

// lấy profile của user cho admin or staff xem
    @GetMapping("/admin/profiles/{accountId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> getProfileByAccountId(@PathVariable String accountId) {

        ApiResponse<ProfileResponseDTO> response = profileService.getProfileByAccountId(accountId);

        return response.isSuccess() ?
                ResponseEntity.ok(response):
                ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<ApiResponse<String>> updateProfile(@Valid @RequestBody AccountRegistrationDTO dto){
        ApiResponse<String> response = profileService.updateProfile(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search/donors/optimized")
    public ResponseEntity<ApiResponse<List<ProfileResponseDTO>>> findOptimizedProfiles(
            @RequestParam(required = false) String bloodCode,
            @RequestParam(required = false) Double radiusKm
    ) {
        try {
            List<ProfileResponseDTO> result = profileService.findProfilesByBloodAndDistance(bloodCode, radiusKm);
            return ResponseEntity.ok(new ApiResponse<>(true, "Tìm kiếm thành công", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Lỗi: " + e.getMessage(), null));
        }
    }


}


