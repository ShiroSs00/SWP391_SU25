package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.account.AccountResponseDTO;
import com.swp391.bloodcare.dto.account.AccountStatisticsDTO;
import com.swp391.bloodcare.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // Lấy tất cả tài khoản với phân trang
    @GetMapping("/paged")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<Page<AccountResponseDTO>>> getAllAccountsWithPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "creationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication auth){
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String currentUserRole = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        ApiResponse<Page<AccountResponseDTO>> response = accountService.getAllAccountsWithPaging(pageable, currentUserRole);

        return ResponseEntity.ok(response);
    }


   //  * Tìm kiếm tài khoản theo nhiều tiêu chí
    @GetMapping("/search/multi")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<Page<AccountResponseDTO>>> searchMultiCriteria(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String roleName,
            @RequestParam(required = false) Boolean isActive,
            @PageableDefault(size = 10, sort = "userName") Pageable pageable,
            Authentication auth) {

        String currentUserRole = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        ApiResponse<Page<AccountResponseDTO>> response = accountService.searchAccountsMultiCriteriaWithPaging(
                username, email, roleName, isActive, currentUserRole, pageable);
        return ResponseEntity.ok(response);
    }

    //Vô hiệu hoá tài khoản
    @PutMapping("/{accountId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deactivateAccount(@PathVariable String accountId){
        ApiResponse<String> response = accountService.deactivateAccount(accountId);
        return ResponseEntity.ok(response);
    }

    //Kích hoạt tài khoản
    @PutMapping("/{accountId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> activateAccount(@PathVariable String accountId) {
        ApiResponse<String> response = accountService.activateAccount(accountId);
        return ResponseEntity.ok(response);
    }

    //Thay đổi role của tài khoản
    @PutMapping("/{username}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> changeAccountRole(
            @PathVariable String username,
            @RequestParam String newRole) {
        try {
            accountService.setRoleForAccount(username, newRole);
            return ResponseEntity.ok(new ApiResponse<>(true, "Thay đổi role thành công", username));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse<>(false, "Có lỗi xảy ra: " + e.getMessage(), null));
        }
    }


    @GetMapping("/statistics/count-by-status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<AccountStatisticsDTO>> getAccountStatistics() {
        try {
            ApiResponse<Long> activeResponse = accountService.countAccountsByStatus(true);
            ApiResponse<Long> inactiveResponse = accountService.countAccountsByStatus(false);

            AccountStatisticsDTO stats = new AccountStatisticsDTO();
            stats.setActiveAccounts(activeResponse.getData());
            stats.setInactiveAccounts(inactiveResponse.getData());
            stats.setTotalAccounts(activeResponse.getData() + inactiveResponse.getData());

            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thống kê thành công", stats));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse<>(false, "Có lỗi xảy ra: " + e.getMessage(), null));
        }
    }
}
