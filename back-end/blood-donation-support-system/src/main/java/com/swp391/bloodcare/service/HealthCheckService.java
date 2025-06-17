package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
import com.swp391.bloodcare.repository.DonationRegistrationRepository;
import com.swp391.bloodcare.repository.HealthCheckRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthCheckService {
    @Autowired
    private HealthCheckRepository healthCheckRepository;


    public HealthCheck createHealthCheck(HealthCheck healthCheck, DonationRegistration donationRegistration) {
        healthCheck.setDonationRegistration(donationRegistration);
        return healthCheckRepository.save(healthCheck);
    }

    public HealthCheck updateHealthCheckByDonationRegistrationId(int donationRegistrationId, HealthCheck updatedData) {
        HealthCheck existing = healthCheckRepository.findByDonationRegistration_RegistrationId(donationRegistrationId)
                .orElseThrow(() -> new EntityNotFoundException("HealthCheck not found for donation registration id: " + donationRegistrationId));

        // Cập nhật các field (tránh thay đổi ID hoặc mối quan hệ)
        existing.setWeight(updatedData.getWeight());
        existing.setTemperate(updatedData.getTemperate());
        existing.setBloodPressure(updatedData.getBloodPressure());
        existing.setPluse(updatedData.getPluse());
        existing.setHemogobin(updatedData.getHemogobin());
        existing.setVolumeToTake(updatedData.getVolumeToTake());
        existing.setFitToDonate(updatedData.isFitToDonate());
        existing.setNote(updatedData.getNote());

        return healthCheckRepository.save(existing);
    }


    public HealthCheck deleteHealthCheck(HealthCheck healthCheck) {
        HealthCheck temp = healthCheck; // hoặc truy vấn lại từ DB nếu cần an toàn
        healthCheckRepository.delete(healthCheck);
        return temp;
    }

    public List<HealthCheck> getAllHealthChecks() {
        return healthCheckRepository.findAll();
    }
    public HealthCheck getHealthCheckByRegistration(DonationRegistration donationRegistration) {
        return healthCheckRepository.getReferenceById((long)donationRegistration.getRegistrationId());
    }

}
