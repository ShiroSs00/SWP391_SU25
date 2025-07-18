package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.account.AccountResponseDTO;
import com.swp391.bloodcare.dto.account.AccountStatisticsDTO;
import com.swp391.bloodcare.dto.account.ChangePassDTO;
import com.swp391.bloodcare.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse<List<AccountResponseDTO>>> getAllAccounts(Authentication auth) {
        ApiResponse<List<AccountResponseDTO>> response = accountService.getAllAccounts();
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
    // đổi pass
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody @Valid ChangePassDTO dto) {
        ApiResponse<String> response = accountService.changePassword(dto);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(response);
    }

}
