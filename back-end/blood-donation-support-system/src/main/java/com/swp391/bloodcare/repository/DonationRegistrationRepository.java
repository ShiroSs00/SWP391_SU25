package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.DonationRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface DonationRegistrationRepository extends JpaRepository<DonationRegistration, Long> {
    boolean existsByRegistrationId(String registrationId);

    Optional<DonationRegistration> findByRegistrationId(String registrationId);


    List<DonationRegistration> findByEventEventId(String eventEventId);


    List<DonationRegistration> findByAccountAccountId(String accountAccountId);

    List<DonationRegistration> findByAccountAccountIdAndEventEventId(String accountAccountId, String eventEventId);


    List<DonationRegistration> findByDonationDate(LocalDate donationDate);
}
