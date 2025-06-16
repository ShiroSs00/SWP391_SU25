package com.swp391.blood.repository;

import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.entity.BloodDonationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<BloodDonationEvent, Long> {

    List<BloodDonationEvent> findByCreationDateBetween(Date creationDateAfter, Date creationDateBefore);
}
