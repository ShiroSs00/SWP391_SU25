package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Blood;
import com.swp391.bloodcare.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, String> {

    @Query("SELECT p FROM Profile p WHERE p.account.accountId = :accountId")
    Optional<Profile> findByAccountId(@Param("accountId") String accountId);


    @Query("SELECT p FROM Profile p JOIN FETCH p.account a " +
            "LEFT JOIN FETCH p.bloodCode b " +
            "LEFT JOIN FETCH p.achievement ach " +
            "LEFT JOIN FETCH a.role r " +

            "WHERE a.accountId = :accountId")
    Optional<Profile> findProfileWithDetailsByAccount_AccountId(@Param("accountId") String accountId);


    @Query(value = """
    SELECT *
    FROM profile p
    JOIN account a ON p.account_id = a.id
    WHERE (:bloodCode IS NULL OR p.blood_code = :bloodCode)
      AND (
          6371 * acos(
              cos(radians(:lat)) *
              cos(radians(p.latitude)) *
              cos(radians(p.longitude) - radians(:lon)) +
              sin(radians(:lat)) *
              sin(radians(p.latitude))
          )
      ) <= :radius
""", nativeQuery = true)
    List<Profile> findByBloodAndDistance(
            @Param("bloodCode") String bloodCode,
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius
    );

}
