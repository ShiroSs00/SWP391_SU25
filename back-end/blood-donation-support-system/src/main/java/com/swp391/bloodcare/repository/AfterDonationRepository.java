package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.AfterDonationBlood;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AfterDonationRepository extends JpaRepository<AfterDonationBlood, String> {

    Optional<AfterDonationBlood> findByHealthCheck_HealthCheckId(String healthCheckId);

    Optional<AfterDonationBlood> findAfterDonationBloodByIdAfterDonation(String idAfterDonation);
}
