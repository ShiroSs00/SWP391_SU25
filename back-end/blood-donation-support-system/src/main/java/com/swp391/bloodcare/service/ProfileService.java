package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AddressDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.profile.ProfileResponseDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Address;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ProfileRepository profileRepository;

    public ApiResponse<ProfileResponseDTO> getProfileByAccountId(String accountId){
        try{
            Optional<Account> accountOpt = accountRepository.findById(accountId);

            if(!accountOpt.isPresent()){
                return new ApiResponse<>(false,"Không tồn tại tài khoản",null);
            }

            Account account = accountOpt.get();
            Profile profile = account.getProfile();

            if(profile == null){
                return new ApiResponse<>(false,"Không tìm thấy thông tin profile", null);
            }

            ProfileResponseDTO prd = mapToProfileResponseDTO(account, profile);
        }




    }

    private ProfileResponseDTO mapToProfileResponseDTO(Account account, Profile profile) {
        ProfileResponseDTO prd = new ProfileResponseDTO();

        //Account info
        prd.setAccountId(account.getAccountId());
        prd.setUsername(account.getUserName());
        prd.setEmail(account.getEmail());
        prd.setCreationDate(account.getCreationDate());
        prd.setActive(account.isActive());

        //Proflie info
        prd.setProfileId(profile.getProfileId());
        prd.setName(profile.getName());
        prd.setPhone(profile.getPhone());
        prd.setDob(profile.getDob());
        prd.setGender(profile.isGender());
        prd.setNumberOfBloodDonation(profile.getNumberOfBloodDonation());
        prd.setRestDate(profile.getRestDate());


        //địa chỉ
        if(profile.getAddress() != null){
            Address add = profile.getAddress();
            AddressDTO addDto = new AddressDTO(
                    add.getCity(),add.getDistrict(),add.getWard(),add.getStreet()
            );
            prd.setAddress(addDto);
        }

        //Loại máu

        // cần xem lại nếu có chỉnh sửa
        if(profile.getBloodCode() != null){
            prd.setBloodType(profile.getBloodCode());
        }
    }
}
