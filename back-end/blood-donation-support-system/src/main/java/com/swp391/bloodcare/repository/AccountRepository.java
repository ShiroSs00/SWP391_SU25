package com.swp391.bloodcare.repository;


import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Blood;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByUserName(String userName);
    Optional<Account> findByEmail(String email);

    @Query(value = """
    SELECT * FROM account a
    JOIN profile p ON a.id = p.account_id
    JOIN blood b ON p.blood_code = b.blood_code
    WHERE a.is_active = true
      AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
      AND b.blood_code IN (:compatibleBloodTypes)
      AND (
          6371 * acos(
              cos(radians(:lat)) * cos(radians(p.latitude)) *
              cos(radians(p.longitude) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(p.latitude))
          )
      ) <= :radiusKm
      AND a.id <> :excludedAccountId
      AND (p.rest_date IS NULL OR p.rest_date < CURDATE())
    """, nativeQuery = true)
    List<Account> findNearbyCompatibleDonorsByLatLng(
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radiusKm") Double radiusKm,
            @Param("compatibleBloodTypes") List<String> compatibleBloodTypes,
            @Param("excludedAccountId") String excludedAccountId
    );


    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Account a WHERE LOWER(a.userName) = LOWER(:username)")
    boolean existsByUserNameIgnoreCase(@Param("username") String username);
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Account a WHERE LOWER(a.email) = LOWER(:email)")
    boolean existsByEmailIgnoreCase(@Param("email") String email);


    /**
     * Tìm kiếm account với phân trang theo nhiều tiêu chí
     */
    @Query("SELECT a FROM Account a WHERE " +
            "(:username IS NULL OR LOWER(a.userName) LIKE LOWER(CONCAT('%', :username, '%'))) AND " +
            "(:email IS NULL OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
            "(:roleName IS NULL OR a.role.role = :roleName) AND " +
            "(:isActive IS NULL OR a.isActive = :isActive)")
    Page<Account> findAccountsByMultipleCriteriaWithPaging(
            @Param("username") String username,
            @Param("email") String email,
            @Param("roleName") String roleName,
            @Param("isActive") Boolean isActive,
            Pageable pageable
    );


    //tìm kiếm account theo thời gian tạo
    List<Account> findByCreationDateBetween(LocalDate startDate, LocalDate endDate);


    //đếm tổng số account
    @Query("SELECT COUNT(a) FROM Account a")
    Long countAllAccounts();


    // * Đếm account theo role
    Long countByRole_Role(String roleName);

    // * Tìm account gần đây nhất
    List<Account> findTop10ByOrderByCreationDateDesc();


    //Đếm số lượng account theo trạng thái
    Long countByIsActive(Boolean isActive);

    List<Account> findByProfile_Address_DistrictIgnoreCaseAndProfile_BloodCode_BloodTypeInAndProfile_BloodCode_RhIn(
            String district, List<Blood.BloodType> bloodTypes, List<Blood.RhFactor> rhFactors);


    Account findAccountByAccountId(String accountId);

    Account findAccountByUserName(String userName);

    Optional<Account> findByAccountId(String accountId);

    boolean existsByAccountId(String accountId);

    Optional<Account> findByEmailIgnoreCase(String email);

}
