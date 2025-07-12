package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ComponentRepository extends JpaRepository<Component, String> {
    boolean existsByComponentId(String componentId);

}
