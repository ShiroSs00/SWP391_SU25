package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, String> {

    //Tìm đơn thheo account
    List<BloodRequest> findByAccount_AccountId(String accountId);


    //Tìm đơn cấp cứu
    List<BloodRequest> findByIsEmergencyTrue();

    @Query("SELECT COUNT(br) FROM BloodRequest br WHERE br.requestCreationDate = :date")
    long countByRequestCreationDate(@Param("date") LocalDate date);

    List<BloodRequest> findByStatus(BloodRequest.statusBloodRequest status);

    @Query("SELECT COUNT(br) > 0 FROM BloodRequest br WHERE br.account.accountId = :accountId AND br.status = 'PENDING'")
    boolean existsPendingRequestByAccountId(@Param("accountId") String accountId);

    @Query("""
    SELECT br FROM BloodRequest br
    JOIN br.account acc
    JOIN acc.profile p
    ORDER BY p.numberOfBloodDonation DESC
""")
    List<BloodRequest> findAllOrderByDonationDesc();

}
