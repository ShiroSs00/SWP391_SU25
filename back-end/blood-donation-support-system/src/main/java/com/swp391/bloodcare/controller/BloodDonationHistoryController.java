package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.BloodDonationHistoryDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.service.BloodDonationHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/blood-donation-history")
@CrossOrigin(origins = "*")
public class BloodDonationHistoryController {

    @Autowired
    private BloodDonationHistoryService bloodDonationHistoryService;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<BloodDonationHistoryDTO>>> getBloodDonationHistory() {
        try{
            List<BloodDonationHistoryDTO> histories = bloodDonationHistoryService.getAllHistory();
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy lịch sử hiến máu thành công", histories));
        }catch(Exception e){
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Lỗi khi lấy lịch sử: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<List<BloodDonationHistoryDTO>>> getBloodDonationHistoryByAccountId(@PathVariable String accountId) {
        try{
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

            System.out.println(account);

            List<BloodDonationHistoryDTO> list = bloodDonationHistoryService.getAllHistoryByAccount(account);
            return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách lịch sử làm đơn hiến máu theo tài khoản", list));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/account/{accountId}/search")
    public ResponseEntity<List<BloodDonationHistoryDTO>> searchHistoryByAccount(
            @PathVariable String accountId,
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "event", required = false) String event,
            @RequestParam(value = "status", required = false) String status) {

        try {
            List<BloodDonationHistoryDTO> histories = bloodDonationHistoryService.searchHistoryByAccountId(
                    accountId, startDate, endDate, event, status);
            return ResponseEntity.ok(histories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
