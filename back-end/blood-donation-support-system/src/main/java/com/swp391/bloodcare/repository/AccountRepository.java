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

    // Tìm những người có thể hiến máu gần vị trí yêu cầu
    //cần xem lại địa chỉ
    @Query("SELECT a FROM Account a " +
            "WHERE a.profile.bloodCode IN :compatibleBloodTypes " +
            "AND a.profile.address.city LIKE %:location% " +
            "AND a.email IS NOT NULL " +
            "AND a.isActive = true")
    List<Account> findPotentialDonors(
            @Param("compatibleBloodTypes") List<String> compatibleBloodTypes,
            @Param("location") String location
    );
    // Tìm người hiến máu theo nhóm máu
    @Query("SELECT a FROM Account a " +
            "WHERE a.profile.bloodCode = :bloodType " +
            "AND a.isActive = true")
    List<Account> findDonorsByBloodType(@Param("bloodType") String bloodType);

    // Tìm người hiến máu theo vị trí
    @Query("SELECT a FROM Account a " +
            "WHERE a.profile.address.city LIKE %:location% " +
            "AND a.isActive = true")
    List<Account> findDonorsByLocation(@Param("location") String location);


    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Account a WHERE LOWER(a.userName) = LOWER(:username)")
    boolean existsByUserNameIgnoreCase(@Param("username") String username);
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Account a WHERE LOWER(a.email) = LOWER(:email)")
    boolean existsByEmailIgnoreCase(@Param("email") String email);

// tìm kiếm account theo username
    List<Account> findByUserNameContainingIgnoreCase(String username);

    //tìm kiếm theo mail
    List<Account> findByEmailContainingIgnoreCase(String email);

    //tìm kiếm theo role
    List<Account> findByRole_Role(String roleName);

    //tìm kiếm theo trạng thái hoạt động
    List<Account> findByIsActive(Boolean isActive);

    //Đếm số lượng account theo trạng thái
    Long countByIsActive(Boolean isActive);


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



    List<Account> findByProfile_Address_DistrictIgnoreCaseAndProfile_BloodCode_BloodTypeInAndProfile_BloodCode_RhIn(
            String district, List<Blood.BloodType> bloodTypes, List<Blood.RhFactor> rhFactors);


    Account findAccountByAccountId(String accountId);

    Account findAccountByUserName(String userName);

    Optional<Account> findByAccountId(String accountId);

    boolean existsByAccountId(String accountId);

}
