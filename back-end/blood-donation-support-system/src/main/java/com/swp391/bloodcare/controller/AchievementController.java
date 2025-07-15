package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.AchievementDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.service.AchievementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;

    @GetMapping("/getall")
    public ResponseEntity<ApiResponse<List<AchievementDTO>>> getAllAchievements() {
        List<AchievementDTO> data = achievementService.getAllAchievements();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thành tựu thành công", data));
    }

    @GetMapping("/getbyname/{name}")
    public ResponseEntity<ApiResponse<AchievementDTO>> getAchievement(@PathVariable String name) {
        AchievementDTO data = achievementService.getAchievementByName(name);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thành tựu thành công", data));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<AchievementDTO>> createAchievement(@Valid @RequestBody AchievementDTO dto) {
        AchievementDTO data = achievementService.createAchievement(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo thành tựu thành công", data));
    }


    @PostMapping("/check-all")
    public ResponseEntity<ApiResponse<String>> manualCheckAchievements() {
        achievementService.checkAndAssignAchievements();
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã kiểm tra & gán thành tựu cho tất cả user", null));
    }


    @PutMapping("/update/{name}")
    public ResponseEntity<ApiResponse<AchievementDTO>> updateAchievement(@PathVariable String name,
                                                                         @Valid @RequestBody AchievementDTO dto) {
        AchievementDTO data = achievementService.updateAchievement(name, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thành tựu thành công", data));
    }

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<ApiResponse<String>> deleteAchievement(@PathVariable String name) {
        achievementService.deleteAchievementByName(name);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa thành tựu thành công", null));
    }

    @GetMapping("/getbyaccount")
    public ResponseEntity<ApiResponse<AchievementDTO>> getMyAchievement() {
        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        AchievementDTO data = achievementService.getAchievementByAccountId(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thành tựu cá nhân thành công", data));
    }

    @DeleteMapping("/delete-mutiple")
    public ResponseEntity<ApiResponse<Map<String, List<String>>>> deleteMultipleAchievements(@RequestBody List<String> names) {
        Map<String, List<String>> result = achievementService.deleteAchievementsByNames(names);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa nhiều thành tựu thành công", result));
    }
}
