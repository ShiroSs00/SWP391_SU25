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

    // Tìm túi máu phù hợp
    @Query("SELECT bb FROM BloodBag bb WHERE bb.blood.bloodCode = :bloodCode " +
            "AND bb.component.type = :componentType " +
            "AND bb.volume = :volume " +
            "AND bb.status = :status")
    List<BloodBag> findByBloodCode_BloodCodeAndComponent_TypeAndVolumeAndStatus(
            @Param("bloodCode") String bloodCode,
            @Param("componentType") String componentType,
            @Param("volume") BloodBag.Volume volume,
            @Param("status") BloodBag.Status status
    );

    List<BloodBag> findByStatus(BloodBag.Status status);

    // Tìm túi máu theo nhóm máu
    @Query("SELECT bb FROM BloodBag bb WHERE bb.blood.bloodCode = :bloodCode AND bb.status = :status")
    List<BloodBag> findByBloodCodeAndStatus(
            @Param("bloodCode") String bloodCode,
            @Param("status") BloodBag.Status status
    );

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

    @Query("SELECT COUNT(b) FROM BloodBag b WHERE b.blood.bloodCode = :bloodCode AND b.status = 'VALID'")
    long countValidByBloodCode(@Param("bloodCode") String bloodCode);




}
