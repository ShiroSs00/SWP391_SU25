package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.account.AccountRegistrationDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.account.AccountResponseDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Address;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.entity.Role;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.ProfileRepository;
import com.swp391.bloodcare.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    private  AccountRepository accountRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    //tạo account
    @Transactional
    public ApiResponse<String> registerAccount(AccountRegistrationDTO accountRegistration) {
        try{

            if(accountRepository.existsByUserNameIgnoreCase(accountRegistration.getUsername())){
                return new ApiResponse<>(false,"Tài khoản đã tồn tại",null);
            }

            if(accountRepository.existsByEmailIgnoreCase(accountRegistration.getEmail())){
                return new ApiResponse<>(false,"Email đã tồn tại",null);
            }



            Account account = new Account();
            account.setAccountId(UUID.randomUUID().toString());
            account.setUserName(accountRegistration.getUsername());
            account.setEmail(accountRegistration.getEmail());
            account.setPassword(passwordEncoder.encode(accountRegistration.getPassword()));
            account.setActive(true);
            account.setCreationDate(LocalDate.now());


            //set role
            Role role = roleRepository.findByRole("MEMBER")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy role mặc định"));
            account.setRole(role);



            Account savedAccount = accountRepository.save(account);

            //tạo profile
            Profile profile = new Profile();
            String profileId = generateProfileId();
            profile.setProfileId(profileId);
            profile.setAccount(savedAccount);

            profile.setName(accountRegistration.getName());
            profile.setPhone(accountRegistration.getPhone());
            profile.setDob(accountRegistration.getDob());
            profile.setGender(accountRegistration.isGender());

            //lấy địa chỉ
            Address address = new Address();
            address.setCity(accountRegistration.getAddress().getCity());
            address.setDistrict(accountRegistration.getAddress().getDistrict());
            address.setWard(accountRegistration.getAddress().getWard());
            address.setStreet(accountRegistration.getAddress().getStreet());

            profile.setAddress(address);
            profile.setNumberOfBloodDonation(0);

            //chưa hoàn thiện -- này là ngày nghỉ ngơi
            profile.setRestDate(LocalDate.now());

            profileRepository.save(profile);

            return new ApiResponse<>(true,"Đăng ký tài khoản thành công!", savedAccount.getAccountId());
        } catch (Exception e) {
        // Bắt buộc rollback
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ApiResponse<>(false, "Có lỗi xảy ra: " + e.getMessage(), null);
        }
    }

    //lấy tất cả không phân trang
    public ApiResponse<List<AccountResponseDTO>> getAllAccounts() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentAccount = auth.getName();
            Account currentUser = accountRepository.findAccountByAccountId(currentAccount);

            List<Account> accounts = accountRepository.findAll();

            List<AccountResponseDTO> accountDTOs = accounts.stream()
                    .map(account -> convertToDTO(account, currentUser.getRole().getRole())).collect(Collectors.toList());

            return new ApiResponse<>(true, "Lấy danh sách tài khoản thành công", accountDTOs);
        }catch (Exception e){
            return new ApiResponse<>(false,"Có lỗi khi lấy danh sách", null);
        }
    }

    //lấy tất cả có phân trang
    public ApiResponse<Page<AccountResponseDTO>> getAllAccountsWithPaging(Pageable pageable, String currentUserRole) {
        try {
            Page<Account> accountPage = accountRepository.findAll(pageable);

            Page<AccountResponseDTO> accountDTOPage = accountPage.map(account ->
                    convertToDTO(account, currentUserRole));

            return new ApiResponse<>(true, "Lấy danh sách tài khoản thành công", accountDTOPage);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Có lỗi xảy ra: " + e.getMessage(), null);
        }
    }

    //tìm kiếm theo nhiều chỉ tiêu và có phân trang
    public ApiResponse<Page<AccountResponseDTO>> searchAccountsMultiCriteriaWithPaging(
            String username, String email, String roleName, Boolean isActive, String currentUserRole, Pageable pageable)  {
        try {
            Page<Account> page = accountRepository.findAccountsByMultipleCriteriaWithPaging(
                    username, email, roleName, isActive, pageable);

            Page<AccountResponseDTO> dtoPage = page.map(account -> convertToDTO(account, currentUserRole));

            return new ApiResponse<>(true, "Tìm kiếm phân trang thành công", dtoPage);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Lỗi: " + e.getMessage(), null);
        }
    }

    //tắt trạng thái hoạt động
    @Transactional
    public ApiResponse<String> deactivateAccount(String accountId){
        try{

            Account account = accountRepository.findAccountByAccountId(accountId);

            if(!account.getActive()){
                return new ApiResponse<>(false, "Tài khoản đã bị vô hiệu hóa trước đó", null);
            }

            account.setActive(false);
            accountRepository.save(account);

            return new ApiResponse<>(true, "Vô hiệu hóa tài khoản thành công", accountId);

        }catch(Exception e){
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ApiResponse<>(false, "Có lỗi xảy ra: " + e.getMessage(), null);

        }
    }

    //mở trạng thái hoạt động
    public ApiResponse<String> activateAccount(String accountId){
        try{
            Account account = accountRepository.findAccountByAccountId(accountId);
            if(account.getActive()){
                return new ApiResponse<>(false, "Tài khoản đang hoạt động", null);
            }
            account.setActive(true);
            accountRepository.save(account);
            return new ApiResponse<>(true, "Kích hoạt tài khoản thành công", accountId);

        }catch(Exception e){
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ApiResponse<>(false,"Có lỗi xảy ra: " + e.getMessage(), null);
        }
    }
        //đếm số lượng theo trạng thái
    public ApiResponse<Long> countAccountsByStatus(Boolean isActive) {
        try {
            Long count = accountRepository.countByIsActive(isActive);
            return new ApiResponse<>(true, "Đếm tài khoản thành công", count);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Có lỗi xảy ra: " + e.getMessage(), null);
        }
    }

    public Account findAccountByUserName(String id) {
        Account acc = accountRepository.findAccountByUserName(id);
        if (acc == null) {
            throw new EntityNotFoundException("Không tìm thấy tài khoản với username: " + id);
        }
        return acc;
    }

    @Transactional
    public void setRoleForAccount(String username, String roleName) {
        Account account = findAccountByUserName(username);

        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy vai trò với tên: " + roleName));

        account.setRole(role);
        accountRepository.save(account);
    }

    private String generateProfileId() {
        String datePart = LocalDate.now().toString().replace("-", ""); // yyyyMMdd
        int randomNum = (int)(Math.random() * 900) + 100; // Tạo số từ 100 - 999
        return "PF-" + datePart + "-" + randomNum;
    }

    private AccountResponseDTO convertToDTO(Account account, String currentUserRole){
        AccountResponseDTO dto = new AccountResponseDTO();
        dto.setAccountId(account.getAccountId());
        dto.setUserName(account.getUserName());
        dto.setEmail(account.getEmail());

        if ("ADMIN".equals(currentUserRole)) {
            dto.setPassword(account.getPassword());
        } else {
            dto.setPassword("******"); // hoặc để null
        }

        dto.setRole(account.getRole().getRole());
        if (account.getProfile() != null) {
            dto.setProfileId(account.getProfile().getProfileId());
        } else {
            dto.setProfileId(null); // hoặc "Chưa cập nhật"
        }
        dto.setCreationDate(account.getCreationDate());
        return dto;
    }

}
