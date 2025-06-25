package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AchievementDTO;
import com.swp391.bloodcare.entity.Achievement;
import com.swp391.bloodcare.repository.AchievementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;

    public List<AchievementDTO> getAllAchievements() {
        return achievementRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AchievementDTO getAchievementByName(String name) {
        Achievement achievement = achievementRepository.findByAchievementNameContainingIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Achievement not found: " + name));
        return toDTO(achievement);
    }

    public AchievementDTO createAchievement(AchievementDTO dto) {
        if (achievementRepository.existsById(dto.getAchievementName())) {
            throw new RuntimeException("Achievement already exists: " + dto.getAchievementName());
        }
        Achievement achievement = toEntity(dto);
        achievementRepository.save(achievement);
        return toDTO(achievement);
    }

    public AchievementDTO updateAchievement(String name, AchievementDTO dto) {
        Achievement achievement = achievementRepository.findById(name)
                .orElseThrow(() -> new RuntimeException("Achievement not found: " + name));
        achievement.setDescription(dto.getDescription());
        achievementRepository.save(achievement);
        return toDTO(achievement);
    }

    public void deleteAchievement(String name) {
        if (!achievementRepository.existsById(name)) {
            throw new RuntimeException("Achievement not found: " + name);
        }
        achievementRepository.deleteById(name);
    }

    private AchievementDTO toDTO(Achievement entity) {
        return AchievementDTO.builder()
                .achievementName(entity.getAchievementName())
                .description(entity.getDescription())
                .build();
    }

    private Achievement toEntity(AchievementDTO dto) {
        return Achievement.builder()
                .achievementName(dto.getAchievementName())
                .description(dto.getDescription())
                .build();
    }
}
