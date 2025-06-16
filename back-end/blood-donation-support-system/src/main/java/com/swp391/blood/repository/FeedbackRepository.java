package com.swp391.blood.repository;

import com.swp391.superapp.bloodsupport.entity.DonorFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<DonorFeedback, Long> {
}
