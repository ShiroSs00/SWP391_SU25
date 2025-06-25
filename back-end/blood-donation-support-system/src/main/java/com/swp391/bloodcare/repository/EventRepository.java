package com.swp391.bloodcare.repository;


import com.swp391.bloodcare.entity.BloodDonationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<BloodDonationEvent, Long> {

    Optional<BloodDonationEvent> findByEventId(String eventId);
    boolean existsByEventId(String eventId);

    List<BloodDonationEvent> findByEndDateBetween(Date endDateAfter, Date endDateBefore);
}
