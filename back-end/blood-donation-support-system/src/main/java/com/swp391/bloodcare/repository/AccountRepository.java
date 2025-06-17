package com.swp391.bloodcare.repository;


import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Blood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUserName(String userName);
    Optional<Account> findByEmail(String email);

    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    List<Account> findByProfile_Address_DistrictIgnoreCaseAndProfile_BloodCode_BloodTypeInAndProfile_BloodCode_RhIn(
            String district, List<Blood.BloodType> bloodTypes, List<Blood.RhFactor> rhFactors);


}
