package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.AchievementDTO;
import com.swp391.bloodcare.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<AchievementDTO> createAchievement(@RequestBody AchievementDTO dto) {
        return ResponseEntity.ok(achievementService.createAchievement(dto));
    }

    @PutMapping("/update/{name}")
    public ResponseEntity<AchievementDTO> updateAchievement(@PathVariable String name,
                                                            @RequestBody AchievementDTO dto) {
        return ResponseEntity.ok(achievementService.updateAchievement(name, dto));
    }

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable String name) {
        achievementService.deleteAchievement(name);
        return ResponseEntity.noContent().build();
    }
}
