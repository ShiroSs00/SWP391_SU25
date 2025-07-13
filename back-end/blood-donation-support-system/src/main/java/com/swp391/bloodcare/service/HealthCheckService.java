package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.HealthCheckDTO;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
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

    public HealthCheckService(HealthCheckRepository healthCheckRepository, DonationRegistrationRepository donationRegistrationRepository, BloodDonationHistoryService bloodDonationHistoryService) {
        this.healthCheckRepository = healthCheckRepository;
        this.donationRegistrationRepository = donationRegistrationRepository;
        this.bloodDonationHistoryService = bloodDonationHistoryService;
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

    public HealthCheckDTO createHealthCheck(String registrationId, HealthCheckDTO dto) {
        DonationRegistration reg = donationRegistrationRepository.findByRegistrationId(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn đăng ký hiến máu"));

        if (healthCheckRepository.findByDonationRegistration_RegistrationId(registrationId).isPresent()) {
            throw new IllegalStateException("Đã tồn tại kiểm tra sức khoẻ cho đơn này");
        }


        LocalDate today = LocalDate.now();
        if (today.isBefore(reg.getDonationDate())) {
            throw new IllegalStateException("Chỉ được tạo HealthCheck vào đúng ngày hiến máu");
        }


        HealthCheck healthCheck = HealthCheckDTO.toEntity(dto);
        healthCheck.setDonationRegistration(reg);
        healthCheck.setHealthCheckId(generateHealthCheckId());

        HealthCheck saved = healthCheckRepository.save(healthCheck);

        //cập nhật lịch sử
        bloodDonationHistoryService.updateFromHealthCheck(saved);
        reg.setStatus(DonationRegistration.Status.PASSED);
        donationRegistrationRepository.save(reg);
        return toDTO(saved);
    }
    
    public HealthCheckDTO updateHealthCheckById(String healthCheckId, HealthCheckDTO dto) {
        HealthCheck existing = healthCheckRepository.findByHealthCheckId(healthCheckId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi HealthCheck với ID: " + healthCheckId));

        if (dto.getWeight() != null) existing.setWeight(dto.getWeight());
        if (dto.getTemperature() != null) existing.setTemperature(dto.getTemperature());
        if (dto.getBloodPressure() != null) existing.setBloodPressure(dto.getBloodPressure());
        if (dto.getPulse() != null) existing.setPulse(dto.getPulse());
        if (dto.getHemoglobin() != null) existing.setHemoglobin(dto.getHemoglobin());
        if (dto.getVolumeToTake() != null) existing.setVolumeToTake(dto.getVolumeToTake());
        if (dto.getIsFitToDonate() != null) existing.setIsFitToDonate(dto.getIsFitToDonate());
        if (dto.getNote() != null && !dto.getNote().isBlank()) existing.setNote(dto.getNote());

        bloodDonationHistoryService.updateFromHealthCheck(existing);

        return HealthCheckDTO.toDTO(healthCheckRepository.save(existing));
    }



    @Transactional
    public HealthCheckDTO deleteHealthCheck(String healthCheckId) {
        HealthCheck existing = healthCheckRepository.findByHealthCheckId(healthCheckId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi HealthCheck để xóa"));

        // Cắt liên kết với DonationRegistration nếu có
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
