package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AchievementDTO;
import com.swp391.bloodcare.entity.Achievement;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.repository.AchievementRepository;
import com.swp391.bloodcare.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final ProfileRepository profileRepository;

    public Achievement findAchievementByDonationCount(long donationCount) {
        return achievementRepository.findAll().stream()
                .filter(a -> donationCount >= a.getMinValue() &&
                        (a.getMaxValue() == null || donationCount < a.getMaxValue()))
                .findFirst()
                .orElse(null);
    }

    public AchievementDTO getAchievementByAccountId(String accountId) {
        Profile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy profile với accountId: " + accountId));

        Achievement achievement = profile.getAchievement();
        if (achievement == null) return null;

        return toDTO(achievement); // chuyển sang DTO
    }



    public void updateAchievementForProfile(Profile profile) {
        long count = profile.getNumberOfBloodDonation();
        Achievement newAchievement = findAchievementByDonationCount(count);
        profile.setAchievement(newAchievement);
        profileRepository.save(profile);
    }



    public Map<String, List<String>> deleteAchievementsByNames(List<String> names) {
        List<String> deleted = new ArrayList<>();
        List<String> notFound = new ArrayList<>();

        for (String name : names) {
            if (achievementRepository.existsById(name)) {
                achievementRepository.deleteById(name);
                deleted.add(name);
            } else {
                notFound.add(name);
            }
        }

        Map<String, List<String>> result = new HashMap<>();
        result.put("deleted", deleted);
        result.put("notFound", notFound);
        return result;
    }






    public List<AchievementDTO> getAllAchievements() {
        return achievementRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AchievementDTO getAchievementByName(String name) {
        Achievement achievement = achievementRepository.findById(name)
                .orElseThrow(() -> new RuntimeException("Achievement not found: " + name));
        return toDTO(achievement);
    }

    public AchievementDTO createAchievement(AchievementDTO dto) {
        if (achievementRepository.existsById(dto.getAchievementName())) {
            throw new RuntimeException("Achievement already exists: " + dto.getAchievementName());
        }

        if (dto.getMinValue() != null && dto.getMaxValue() != null && dto.getMinValue() > dto.getMaxValue()) {
            throw new IllegalArgumentException("minValue must be <= maxValue");
        }

        Achievement achievement = toEntity(dto);
        achievementRepository.save(achievement);
        return toDTO(achievement);
    }


    public AchievementDTO updateAchievement(String name, AchievementDTO dto) {
        Achievement achievement = achievementRepository.findById(name)
                .orElseThrow(() -> new RuntimeException("Achievement not found: " + name));
        achievement.setDescription(dto.getDescription());
        achievement.setMinValue(dto.getMinValue());
        achievement.setMaxValue(dto.getMaxValue());
        achievementRepository.save(achievement);
        return toDTO(achievement);
    }

    public void deleteAchievementByName(String name) {
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
