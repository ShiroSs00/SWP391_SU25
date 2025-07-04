package com.swp391.bloodcare.repository;
import com.swp391.bloodcare.entity.BloodBag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface BloodBagRepository extends JpaRepository<BloodBag, Integer> {
    boolean existsByBagId(String bagId);

    Optional<BloodBag> findByBagId(String bagId);

    void deleteBloodBagBybagId(String bagId);

    Optional<BloodBag> findByAfterDonationBlood_IdAfterDonation(String afterDonationBloodIdAfterDonation);

    void deleteAllByBagIdIn(Collection<String> bagIds);
}
