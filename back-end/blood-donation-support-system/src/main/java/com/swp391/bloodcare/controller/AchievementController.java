package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.AchievementDTO;
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
    public ResponseEntity<List<AchievementDTO>> getAllAchievements() {
        return ResponseEntity.ok(achievementService.getAllAchievements());
    }

    @GetMapping("/getbyname/{name}")
    public ResponseEntity<AchievementDTO> getAchievement(@PathVariable String name) {
        return ResponseEntity.ok(achievementService.getAchievementByName(name));
    }

    @PostMapping("/create")
    public ResponseEntity<AchievementDTO> createAchievement(@Valid @RequestBody AchievementDTO dto) {
        return ResponseEntity.ok(achievementService.createAchievement(dto));
    }

    @PutMapping("/update/{name}")
    public ResponseEntity<AchievementDTO> updateAchievement(@PathVariable String name,
                                                            @Valid @RequestBody AchievementDTO dto) {
        return ResponseEntity.ok(achievementService.updateAchievement(name, dto));
    }

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable String name) {
        achievementService.deleteAchievementByName(name);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getbyaccount")
    public ResponseEntity<AchievementDTO> getMyAchievement() {
        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(achievementService.getAchievementByAccountId(accountId));
    }

    @DeleteMapping("/delete-mutiple")
    public ResponseEntity<?> deleteMultipleAchievements(@RequestBody List<String> names) {
        Map<String, List<String>> result = achievementService.deleteAchievementsByNames(names);
        return ResponseEntity.ok(result);
    }

}
