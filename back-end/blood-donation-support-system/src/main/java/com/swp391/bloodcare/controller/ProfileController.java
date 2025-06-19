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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;


    // cần sửa lại thành token
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> getUserProfile(Authentication authentication) {
        String username = authentication.getName();
        ApiResponse<ProfileResponseDTO> response = profileService.getProfileByUsername(username);

        return response.isSuccess()?ResponseEntity.ok(response):ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/admin/profile/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> getProfileByAccountId(@PathVariable String accountId) {

        ApiResponse<ProfileResponseDTO> response = profileService.getProfileByAccountId(accountId);

        return response.isSuccess() ?
                ResponseEntity.ok(response):
                ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/admin/accounts/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<AccountSearchDTO>>> searchAccounts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String roleName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "creationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ){
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        ApiResponse<PageResponse<AccountSearchDTO>> response =
                profileService.searchAccounts(keyword, isActive, roleName, pageable);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }


    //Lấy tất cả Account cho Admin
    public ResponseEntity<ApiResponse<PageResponse<AccountSearchDTO>>> getAllAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "creationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ){
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        ApiResponse<PageResponse<AccountSearchDTO>> response =
                profileService.searchAccounts(null, true, null, pageable);

        return response.isSuccess() ?
                ResponseEntity.ok(response) :
                ResponseEntity.badRequest().body(response);
    }
    }


