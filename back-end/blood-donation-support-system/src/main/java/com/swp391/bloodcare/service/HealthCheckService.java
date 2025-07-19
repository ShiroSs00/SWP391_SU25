package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.HealthCheckDTO;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.repository.DonationRegistrationRepository;
import com.swp391.bloodcare.repository.HealthCheckRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;


import static com.swp391.bloodcare.dto.HealthCheckDTO.toDTO;

@Service
public class HealthCheckService {

    private final HealthCheckRepository healthCheckRepository;

    private final DonationRegistrationRepository donationRegistrationRepository;

    private final BloodDonationHistoryService bloodDonationHistoryService;

    private final ProfileService profileService;

    public HealthCheckService(HealthCheckRepository healthCheckRepository, DonationRegistrationRepository donationRegistrationRepository, BloodDonationHistoryService bloodDonationHistoryService, ProfileService profileService) {
        this.healthCheckRepository = healthCheckRepository;
        this.donationRegistrationRepository = donationRegistrationRepository;
        this.bloodDonationHistoryService = bloodDonationHistoryService;
        this.profileService = profileService;
    }

    @Transactional
    public Map<String, Object> deleteMultipleHealthChecksSafe(List<String> ids) {
        List<String> deleted = new ArrayList<>();
        Map<String, String> errors = new HashMap<>();

        for (String id : ids) {
            try {
                var healthCheck = healthCheckRepository.findByHealthCheckId(id)
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi kiểm tra với ID: " + id));
                healthCheckRepository.delete(healthCheck);
                deleted.add(id);
            } catch (EntityNotFoundException e) {
                errors.put(id, "Không tìm thấy bản ghi");
            } catch (Exception e) {
                errors.put(id, "Lỗi không xác định: " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("deleted", deleted);
        result.put("errors", errors);
        return result;
    }

    @Transactional
    public HealthCheckDTO createHealthCheck(String registrationId, HealthCheckDTO dto) {
        DonationRegistration reg = donationRegistrationRepository.findByRegistrationId(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn đăng ký hiến máu"));

        if (healthCheckRepository.findByDonationRegistration_RegistrationId(registrationId).isPresent()) {
            throw new IllegalStateException("Đã tồn tại kiểm tra sức khoẻ cho đơn này");
        }

        if (!Boolean.TRUE.equals(dto.getIsFitToDonate())) {
            dto.setVolumeToTake(0);
        }

        if (LocalDate.now().isBefore(reg.getDonationDate())) {
            throw new IllegalStateException("Chỉ được tạo HealthCheck vào đúng ngày hiến máu");
        }

        HealthCheck healthCheck = HealthCheckDTO.toEntity(dto);
        healthCheck.setDonationRegistration(reg);
        healthCheck.setHealthCheckId(generateHealthCheckId());

        // QUAN TRỌNG: set lại 2 chiều
        reg.setHealthCheck(healthCheck);

        Profile profile = reg.getAccount().getProfile();
        String accountId = profile.getAccount().getAccountId();

        if (Boolean.TRUE.equals(dto.getIsFitToDonate())) {
            reg.setStatus(DonationRegistration.Status.PASSED);
            profileService.increaseBloodDonationCount(accountId);
            profile.setRestDate(LocalDate.now().plusDays(84));
        } else {
            reg.setStatus(DonationRegistration.Status.CANCELLED);
            profile.setRestDate(null);
        }

        // Lưu cả 2
        donationRegistrationRepository.save(reg); // lưu reg sẽ cascade luôn HealthCheck
        HealthCheck saved = healthCheckRepository.findByHealthCheckId(healthCheck.getHealthCheckId())
                .orElseThrow(() -> new IllegalStateException("Không lưu được HealthCheck"));

        bloodDonationHistoryService.updateFromHealthCheck(saved);

        return toDTO(saved);
    }


    @Transactional
    public HealthCheckDTO updateHealthCheckById(String healthCheckId, HealthCheckDTO dto) {
        HealthCheck existing = healthCheckRepository.findByHealthCheckId(healthCheckId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi HealthCheck với ID: " + healthCheckId));

        DonationRegistration reg = existing.getDonationRegistration();
        Boolean oldFit = existing.getIsFitToDonate();
        Boolean newFit = dto.getIsFitToDonate();

        int volumeInt = (!Boolean.TRUE.equals(newFit) || dto.getVolumeToTake() == null)
                ? 0 : dto.getVolumeToTake();

        if (Boolean.TRUE.equals(newFit) && !Arrays.asList(250, 350, 450).contains(volumeInt)) {
            throw new IllegalArgumentException("Thể tích không hợp lệ");
        }

        // Cập nhật dữ liệu
        existing.setWeight(dto.getWeight());
        existing.setTemperature(dto.getTemperature());
        existing.setBloodPressure(dto.getBloodPressure());
        existing.setPulse(dto.getPulse());
        existing.setHemoglobin(dto.getHemoglobin());
        existing.setNote(dto.getNote());
        existing.setVolumeToTake(HealthCheck.Volume.fromInt(volumeInt));
        existing.setIsFitToDonate(newFit);

        Profile profile = reg.getAccount().getProfile();
        String accountId = profile.getAccount().getAccountId();

        if (Boolean.TRUE.equals(newFit)) {
            reg.setStatus(DonationRegistration.Status.PASSED);
            if (!Boolean.TRUE.equals(oldFit)) {
                profileService.increaseBloodDonationCount(accountId);
                profile.setRestDate(LocalDate.now().plusDays(84));
            }
        } else {
            reg.setStatus(DonationRegistration.Status.CANCELLED);
            if (Boolean.TRUE.equals(oldFit)) {
                profileService.decreaseBloodDonationCount(accountId);
                profile.setRestDate(null);
            }
        }

        bloodDonationHistoryService.updateFromHealthCheck(existing);
        donationRegistrationRepository.save(reg);
        HealthCheck saved = healthCheckRepository.save(existing);
        return toDTO(saved);
    }


    @Transactional
    public HealthCheckDTO deleteHealthCheck(String healthCheckId) {
        HealthCheck existing = healthCheckRepository.findByHealthCheckId(healthCheckId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi HealthCheck để xóa"));

        if (existing.getDonationRegistration() != null) {
            existing.getDonationRegistration().setHealthCheck(null);
            existing.setDonationRegistration(null); // rất quan trọng
        }

        healthCheckRepository.delete(existing);
        return toDTO(existing);
    }



    public List<HealthCheckDTO> getAllHealthChecks() {
        return healthCheckRepository.findAll().stream()
                .map(HealthCheckDTO::toDTO)
                .toList();
    }

    public HealthCheckDTO getHealthCheckByRegistration(String registrationId) {
        HealthCheck healthCheck = healthCheckRepository
                .findByDonationRegistration_RegistrationId(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi HealthCheck với mã đăng ký: " + registrationId));

        return toDTO(healthCheck);
    }

    public static String generateHealthCheckId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int randomNum = new Random().nextInt(900) + 100; // 100-999
        return "HC-" + timestamp + "-" + randomNum;
    }



}
