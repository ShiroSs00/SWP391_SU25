package com.swp391.bloodcare.repository.Location;

import com.swp391.bloodcare.entity.Location.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProvinceRepository extends JpaRepository<Province, String> {
    @Query("SELECT p FROM Province p JOIN FETCH p.wards")
    List<Province> findAllWithWards();
}
