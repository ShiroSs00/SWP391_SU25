package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.PageResponse;
import com.swp391.bloodcare.dto.account.AccountSearchDTO;
import com.swp391.bloodcare.dto.profile.ProfileResponseDTO;
import com.swp391.bloodcare.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    }


