package com.swp391.bloodcare.repository;


import com.swp391.blood.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUserName(String userName);
    Optional<Account> findByEmail(String email);

    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
}
