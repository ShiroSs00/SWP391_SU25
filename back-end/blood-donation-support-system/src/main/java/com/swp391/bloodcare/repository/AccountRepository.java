package com.swp391.bloodcare.repository;


import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Blood;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByUserName(String userName);
    Optional<Account> findByEmail(String email);



    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);




    //tìm kiếm dành cho STAFF/ADMIN
    @Query("SELECT a FROM Account a LEFT JOIN a.profile p LEFT JOIN a.role r LEFT JOIN a.hospital h " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(a.userName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:isActive IS NULL OR a.isActive = :isActive) " +
            "AND (:roleName IS NULL OR :roleName = '' OR r.role = :roleName)")
    Page<Account> searchAccounts(@Param("keyword") String keyword,
                                 @Param("isActive") Boolean isActive,
                                 @Param("roleName") String roleName,
                                 Pageable pageable);

    List<Account> findByProfile_Address_DistrictIgnoreCaseAndProfile_BloodCode_BloodTypeInAndProfile_BloodCode_RhIn(
            String district, List<Blood.BloodType> bloodTypes, List<Blood.RhFactor> rhFactors);


}
