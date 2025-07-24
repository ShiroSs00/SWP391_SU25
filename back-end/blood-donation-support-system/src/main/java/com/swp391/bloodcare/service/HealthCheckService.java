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

        if (LocalDate.now().isBefore(reg.getDonationDate())) {
            throw new IllegalStateException("Chỉ được tạo HealthCheck vào đúng ngày hiến máu");
        }

        HealthCheck healthCheck = HealthCheckDTO.toEntity(dto);
        healthCheck.setHealthCheckId(generateHealthCheckId());
        healthCheck.setDonationRegistration(reg);
        reg.setHealthCheck(healthCheck);

        if (Boolean.TRUE.equals(dto.getIsFitToDonate())) {
            reg.setStatus(DonationRegistration.Status.CHECKING);
            if (dto.getVolumeToTake() == null || !Arrays.asList(250, 350, 450).contains(dto.getVolumeToTake())) {
                throw new IllegalArgumentException("Thể tích không hợp lệ hoặc chưa chọn");
            }
            reg.setVolumeToTake(DonationRegistration.Volume.fromInt(dto.getVolumeToTake()));
        } else {
            reg.setStatus(DonationRegistration.Status.CANCELLED);
            reg.setVolumeToTake(DonationRegistration.Volume.fromInt(0));
        }

        donationRegistrationRepository.save(reg);
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
        if (reg.getStatus() == DonationRegistration.Status.COMPLETED) {
            throw new IllegalStateException("Không thể cập nhật vì đơn đã hoàn thành");
        }

        existing.setWeight(dto.getWeight());
        existing.setTemperature(dto.getTemperature());
        existing.setBloodPressure(dto.getBloodPressure());
        existing.setPulse(dto.getPulse());
        existing.setHemoglobin(dto.getHemoglobin());
        existing.setNote(dto.getNote());
        existing.setIsFitToDonate(dto.getIsFitToDonate());

        HealthCheck saved = healthCheckRepository.save(existing);
        return toDTO(saved);
    }

    @Transactional
    public void updateStatus(String healthCheckId) {
        HealthCheck healthCheck = healthCheckRepository.findByHealthCheckId(healthCheckId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy HealthCheck với ID: " + healthCheckId));

        DonationRegistration reg = healthCheck.getDonationRegistration();
        Profile profile = reg.getAccount().getProfile();
        String accountId = profile.getAccount().getAccountId();

        DonationRegistration.Status oldStatus = reg.getStatus();

        switch (oldStatus) {
            case CANCELLED:
            case CHECKING:
                reg.setStatus(DonationRegistration.Status.COMPLETED);
                profileService.increaseBloodDonationCount(accountId);
                profile.setRestDate(LocalDate.now().plusDays(84));
                break;

            case COMPLETED:
                reg.setStatus(DonationRegistration.Status.CANCELLED);
                profileService.decreaseBloodDonationCount(accountId);
                profile.setRestDate(null);
                break;

            default:
                throw new IllegalStateException("Chỉ xử lý nếu đơn đang ở CANCELLED, COMPLETED hoặc CHECKING");
        }

        donationRegistrationRepository.save(reg);
        bloodDonationHistoryService.updateFromHealthCheck(healthCheck);
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
