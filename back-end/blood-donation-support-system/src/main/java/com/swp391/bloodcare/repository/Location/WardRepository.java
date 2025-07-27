package com.swp391.bloodcare.repository.Location;

import com.swp391.bloodcare.entity.Location.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WardRepository extends JpaRepository<Ward, String> {
}
