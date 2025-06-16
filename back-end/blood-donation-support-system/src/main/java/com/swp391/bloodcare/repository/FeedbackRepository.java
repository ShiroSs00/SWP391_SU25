package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.DonorFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<DonorFeedback, Long> {
}
