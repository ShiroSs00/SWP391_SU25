package com.swp391.superapp.bloodsupport.repository;

import com.swp391.superapp.bloodsupport.entity.AfterDonationBlood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AfterDonationRepository extends JpaRepository<AfterDonationBlood, Long> {
}
