package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Blood;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BloodRepository extends JpaRepository<Blood, String> {
    Optional<Blood> findByBloodCode(String bloodCode);
}
