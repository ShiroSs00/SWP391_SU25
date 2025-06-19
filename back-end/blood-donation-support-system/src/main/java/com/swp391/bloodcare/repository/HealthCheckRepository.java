package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.HealthCheck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HealthCheckRepository extends JpaRepository<HealthCheck, Long> {
    Optional<HealthCheck> findByDonationRegistration_RegistrationId(String registrationId);
}
