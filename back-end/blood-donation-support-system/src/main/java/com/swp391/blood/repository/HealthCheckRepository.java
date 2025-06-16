package com.swp391.blood.repository;

import com.swp391.superapp.bloodsupport.entity.HealthCheck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthCheckRepository extends JpaRepository<HealthCheck, Long> {
}
