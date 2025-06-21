package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, String> {

}
