package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, String> {

    //Tìm đơn thheo account
    List<BloodRequest> findByAccountId(String accountId);

    //Tìm đơn theo trạng thái
    List<BloodRequest> findByStatus(String status);

    //Tìm đơn cấp cứu
    List<BloodRequest> findByIsEmergencyTrue();

    @Query("SELECT COUNT(br) FROM BloodRequest br WHERE br.requestCreationDate = :date")
    long countByRequestCreationDate(@Param("date") LocalDate date);
}
