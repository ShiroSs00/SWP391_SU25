package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByRole(String role);
}
