package com.swp391.blood.repository;

import com.swp391.superapp.bloodsupport.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
