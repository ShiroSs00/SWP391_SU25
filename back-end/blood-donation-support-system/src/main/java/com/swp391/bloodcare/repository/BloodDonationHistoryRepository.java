package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationHistory;
import com.swp391.bloodcare.entity.DonationRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface BloodDonationHistoryRepository extends JpaRepository<BloodDonationHistory, String> {

    Optional<BloodDonationHistory> findByDonationRegistration(DonationRegistration donationRegistration);

    List<BloodDonationHistory> findByAccount(Account account);
    List<BloodDonationHistory> findByStatus(String status);

    // Tìm kiếm với nhiều điều kiện
    @Query("SELECT h FROM BloodDonationHistory h " +
            "WHERE h.account.accountId = :accountId " +
            "AND (:startDate IS NULL OR h.donationRegistration.dateCreated >= :startDate) " +
            "AND (:endDate IS NULL OR h.donationRegistration.dateCreated <= :endDate) " +
            "AND (:event IS NULL OR h.donationRegistration.event.nameOfEvent LIKE %:event%) " +
            "AND (:status IS NULL OR h.status = :status) " +
            "ORDER BY h.donationRegistration.dateCreated DESC")
    List<BloodDonationHistory> searchByAccountWithFilters(
            @Param("accountId") String accountId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("event") String event,
            @Param("status") String status
    );

    @Query(value = """
        SELECT SUM(
            CASE bb.volume
                WHEN 'ML_250' THEN 250
                WHEN 'ML_350' THEN 350
                WHEN 'ML_450' THEN 450
                ELSE 0
            END
        ) 
        FROM blood_donation_history h
        JOIN after_donation_blood adb ON h.after_donation_id = adb.after_donation_id
        JOIN blood_bag bb ON adb.bag_id = bb.bag_id
        WHERE h.account_id = :accountId AND h.status = 'Đã hoàn thành'
        """, nativeQuery = true)
    Long getTotalVolumeByAccountId(@Param("accountId") String accountId);


    // Đếm số lượng donation theo status cho account
    @Query("SELECT COUNT(h) FROM BloodDonationHistory h " +
            "WHERE h.account.accountId = :accountId AND h.status = :status")
    long countByAccountIdAndStatus(@Param("accountId") String accountId, @Param("status") String status);

    // Lấy donation gần nhất theo account
    @Query("SELECT h FROM BloodDonationHistory h " +
            "WHERE h.account.accountId = :accountId " +
            "ORDER BY h.donationRegistration.dateCreated DESC")
    List<BloodDonationHistory> findRecentByAccountId(@Param("accountId") String accountId);
}
