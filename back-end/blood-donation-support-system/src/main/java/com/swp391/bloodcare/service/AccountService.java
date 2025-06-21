package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.account.AccountRegistrationDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Address;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.entity.Role;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.ProfileRepository;
import com.swp391.bloodcare.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.time.LocalDate;
import java.util.UUID;

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

    @Transactional
    public ApiResponse<String> registerAccount(AccountRegistrationDTO accountRegistration) {
        try{

            if(accountRepository.existsByUserName(accountRegistration.getUsername())){
                return new ApiResponse<>(false,"Tài khoản đã tồn tại",null);
            }

            if(accountRepository.existsByEmail(accountRegistration.getEmail())){
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

    public Account findAccountByUserName (String id){
        return accountRepository.findAccountByUserName(id);
    }
}
