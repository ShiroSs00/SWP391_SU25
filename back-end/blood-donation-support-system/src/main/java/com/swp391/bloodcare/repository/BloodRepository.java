package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Blood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;


public interface BloodRepository extends JpaRepository<Blood, String> {
    Optional<Blood> findByBloodCode(String bloodCode);

    List<Blood> findByIsRareBlood(Boolean isRareBlood);

    @Query("SELECT b FROM Blood b WHERE " +
            "(:bloodCode IS NULL OR b.bloodCode = :bloodCode) AND " +
            "(:rh IS NULL OR b.rh = :rh) AND " +
            "(:isRareBlood IS NULL OR b.isRareBlood = :isRareBlood)")
    List<Blood> findByCriteria(@Param("bloodCode") String bloodCode,
                               @Param("rh") Blood.RhFactor rh,
                               @Param("isRareBlood") Boolean isRareBlood);
}
