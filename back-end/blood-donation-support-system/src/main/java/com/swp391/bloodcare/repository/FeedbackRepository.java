package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.DonorFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<DonorFeedback, Long> {
    Optional<DonorFeedback> findByDonationRegistrationRegistrationId(String donationRegistrationRegistrationId);

    Optional<DonorFeedback> findDonorFeedbackByFeedbackID(String feedbackID);

    List<DonorFeedback> findByDonationRegistration_Event_EventId(String donationRegistrationEventEventId);
}
