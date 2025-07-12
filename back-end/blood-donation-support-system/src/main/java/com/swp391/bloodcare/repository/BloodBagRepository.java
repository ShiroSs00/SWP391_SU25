package com.swp391.bloodcare.repository;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("SELECT b FROM BloodBag b WHERE " +
            "b.blood.bloodCode = :bloodCode AND " +
            "b.volume = :volume AND " +
            "b.expirationDate = :expirationDate AND " +
            "b.component = :component")
    Optional<BloodBag> findByMatchingAttributes(
            @Param("bloodCode") String bloodCode,
            @Param("volume") BloodBag.Volume volume,
            @Param("expirationDate") Date expirationDate,
            @Param("component") Component component
    );

}
