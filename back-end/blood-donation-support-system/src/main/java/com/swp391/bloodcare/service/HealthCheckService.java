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
import java.util.Date;
import java.util.List;
import java.util.Random;


import static com.swp391.bloodcare.dto.HealthCheckDTO.toDTO;

@Service
public class HealthCheckService {

    private final HealthCheckRepository healthCheckRepository;

    private final DonationRegistrationRepository donationRegistrationRepository;

    public HealthCheckService(HealthCheckRepository healthCheckRepository, DonationRegistrationRepository donationRegistrationRepository) {
        this.healthCheckRepository = healthCheckRepository;
        this.donationRegistrationRepository = donationRegistrationRepository;
    }


    public HealthCheckDTO createHealthCheck(String registrationId, HealthCheckDTO dto) {
        DonationRegistration reg = donationRegistrationRepository.findByRegistrationId(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("DonationRegistration not found"));

        // Kiểm tra nếu đã có HealthCheck cho donation này thì không cho tạo nữa
        if (healthCheckRepository.findByDonationRegistration_RegistrationId(registrationId).isPresent()) {
            throw new IllegalStateException("HealthCheck đã tồn tại cho DonationRegistration này");
        }

        HealthCheck healthCheck = HealthCheckDTO.toEntity(dto);
        healthCheck.setDonationRegistration(reg);
        healthCheck.setHealthCheckId(generateHealthCheckId());

        HealthCheck saved = healthCheckRepository.save(healthCheck);
        return toDTO(saved);
    }





    public HealthCheckDTO updateHealthCheckByDonationRegistrationId(String donationRegistrationId, HealthCheckDTO dto) {
        HealthCheck existing = healthCheckRepository.findByDonationRegistration_RegistrationId(donationRegistrationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi HealthCheck"));

        if (dto.getWeight() != null) existing.setWeight(dto.getWeight());
        if (dto.getTemperate() != null) existing.setTemperate(dto.getTemperate());
        if (dto.getBloodPressure() != null) existing.setBloodPressure(dto.getBloodPressure());
        if (dto.getPluse() != null) existing.setPluse(dto.getPluse());
        if (dto.getHemogobin() != null) existing.setHemogobin(dto.getHemogobin());
        if (dto.getVolumeToTake() != null) existing.setVolumeToTake(dto.getVolumeToTake());
        if (dto.getFitToDonate() != null) existing.setFitToDonate(dto.getFitToDonate());
        if (dto.getNote() != null && !dto.getNote().isBlank()) existing.setNote(dto.getNote());
        return toDTO(healthCheckRepository.save(existing));
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
