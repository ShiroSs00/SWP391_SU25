package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AchievementDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Achievement;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.AchievementRepository;
import com.swp391.bloodcare.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final ProfileRepository profileRepository;
    private final AccountRepository accountRepository;
    private final NotificationService notificationService;

    public Achievement findAchievementByDonationCount(long donationCount) {
        return achievementRepository.findAll().stream()
                .filter(a -> donationCount >= a.getMinValue() &&
                        (a.getMaxValue() == null || donationCount <= a.getMaxValue()))
                .findFirst()
                .orElse(null);
    }

    public AchievementDTO getAchievementByAccountId(String accountId) {
        Profile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy profile, vui lòng tạo profile!!! "));

        Achievement achievement = profile.getAchievement();
        return achievement != null ? toDTO(achievement) : null;
    }

    @Scheduled(cron = "0 */5 * * * ?")
    @Transactional
    public void checkAndAssignAchievements() {
        List<Account> accounts = accountRepository.findAll();
        List<Achievement> achievements = achievementRepository.findAll();

        for (Account acc : accounts) {
            Profile profile = acc.getProfile();
            if (profile == null) continue;

            long donationCount = profile.getNumberOfBloodDonation();
            Achievement current = profile.getAchievement();

            boolean alreadyQualified = current != null &&
                    donationCount >= current.getMinValue() &&
                    donationCount <= current.getMaxValue();

            if (alreadyQualified) continue;

            Achievement matched = achievements.stream()
                    .filter(a -> donationCount >= a.getMinValue() && donationCount <= a.getMaxValue())
                    .findFirst()
                    .orElse(null);

            if (matched != null && !matched.equals(current)) {
                profile.setAchievement(matched);
                profileRepository.save(profile);

                notificationService.notifyAchievementUnlocked(
                        acc.getAccountId(),
                        matched.getAchievementName()
                );
            }
        }
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
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành tựu: " + name));
        return toDTO(achievement);
    }

    public AchievementDTO createAchievement(AchievementDTO dto) {
        if (achievementRepository.existsById(dto.getAchievementName())) {
            throw new RuntimeException("Thành tựu đã tồn tại: " + dto.getAchievementName());
        }

        if (dto.getMinValue() != null && dto.getMaxValue() != null && dto.getMinValue() > dto.getMaxValue()) {
            throw new IllegalArgumentException("Giá trị min phải nhỏ hơn hoặc bằng max");
        }

        Achievement achievement = toEntity(dto);
        achievementRepository.save(achievement);
        return toDTO(achievement);
    }

    public AchievementDTO updateAchievement(String name, AchievementDTO dto) {
        Achievement achievement = achievementRepository.findById(name)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành tựu: " + name));

        achievement.setDescription(dto.getDescription());
        achievement.setMinValue(dto.getMinValue());
        achievement.setMaxValue(dto.getMaxValue());

        achievementRepository.save(achievement);
        return toDTO(achievement);
    }

    public void deleteAchievementByName(String name) {
        if (!achievementRepository.existsById(name)) {
            throw new RuntimeException("Không tìm thấy thành tựu: " + name);
        }
        achievementRepository.deleteById(name);
    }

    private AchievementDTO toDTO(Achievement entity) {
        return AchievementDTO.builder()
                .achievementName(entity.getAchievementName())
                .description(entity.getDescription())
                .minValue(entity.getMinValue())
                .maxValue(entity.getMaxValue())
                .build();
    }

    private Achievement toEntity(AchievementDTO dto) {
        return Achievement.builder()
                .achievementName(dto.getAchievementName())
                .description(dto.getDescription())
                .minValue(dto.getMinValue())
                .maxValue(dto.getMaxValue())
                .build();
    }
}