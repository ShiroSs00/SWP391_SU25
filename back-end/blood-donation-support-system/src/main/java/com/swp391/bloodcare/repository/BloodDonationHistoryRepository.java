package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationHistory;
import com.swp391.bloodcare.entity.DonationRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface BloodDonationHistoryRepository extends JpaRepository<BloodDonationHistory, String> {
    Optional<BloodDonationHistory> findByBloodDonationId(DonationRegistration donationRegistration);
    Optional<BloodDonationHistory> findByDonationRegistration(DonationRegistration donationRegistration);

    List<BloodDonationHistory> findByAccount(Account account);
    List<BloodDonationHistory> findByStatus(String status);

//    // Tìm kiếm với nhiều điều kiện
//    @Query("SELECT h FROM BloodDonationHistory h " +
//            "WHERE h.account.id = :accountId " +
//            "AND (:startDate IS NULL OR h.donationRegistration.registrationDate >= :startDate) " +
//            "AND (:endDate IS NULL OR h.donationRegistration.registrationDate <= :endDate) " +
//            "AND (:event IS NULL OR h.donationRegistration.event.nameOfEvent LIKE %:event%) " +
//            "AND (:status IS NULL OR h.status = :status) " +
//            "ORDER BY h.donationRegistration.registrationDate DESC")
//    List<BloodDonationHistory> searchByAccountWithFilters(
//            @Param("accountId") String accountId,
//            @Param("startDate") LocalDate startDate,
//            @Param("endDate") LocalDate endDate,
//            @Param("event") String event,
//            @Param("status") String status
//    );

    @Query("SELECT COALESCE(SUM(h.healthCheck.volumeToTake), 0) FROM BloodDonationHistory h " +
            "WHERE h.account.accountId = :accountId AND h.healthCheck IS NOT NULL")
    long getTotalVolumeByAccountId(@Param("accountId") String accountId);
}
