package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    @Query("SELECT p FROM Profile p WHERE p.account.accountId = :accountId")
    Optional<Profile> findByAccountId(@Param("accountId") String accountId);


    @Query("SELECT p FROM Profile p JOIN FETCH p.account a " +
            "LEFT JOIN FETCH p.bloodCode b " +
            "LEFT JOIN FETCH p.achievement ach " +
            "LEFT JOIN FETCH a.role r " +
            "LEFT JOIN FETCH a.hospital h " +
            "WHERE a.accountId = :accountId")
    Optional<Profile> findProfileWithDetailsByAccount_AccountId(@Param("accountId") String accountId);
}
