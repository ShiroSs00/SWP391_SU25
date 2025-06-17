package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.AfterDonationBlood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface AfterDonationRepository extends JpaRepository<AfterDonationBlood, Long> {
}
