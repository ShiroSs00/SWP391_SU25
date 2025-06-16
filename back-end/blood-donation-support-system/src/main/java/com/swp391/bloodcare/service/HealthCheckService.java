package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
import com.swp391.bloodcare.repository.HealthCheckRepository;
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
    public HealthCheck updateHealthCheck(HealthCheck healthCheck) {
        return healthCheckRepository.save(healthCheck);
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
