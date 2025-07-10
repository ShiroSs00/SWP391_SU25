package com.swp391.bloodcare.repository;
import com.swp391.bloodcare.entity.BloodBag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface BloodBagRepository extends JpaRepository<BloodBag, Integer> {
    boolean existsByBagId(String bagId);

    Optional<BloodBag> findByBagId(String bagId);

    void deleteBloodBagBybagId(String bagId);


    void deleteAllByBagIdIn(Collection<String> bagIds);

    List<BloodBag> findByExpirationDateBeforeAndStatus(Date expirationDateBefore, BloodBag.Status status);
}
