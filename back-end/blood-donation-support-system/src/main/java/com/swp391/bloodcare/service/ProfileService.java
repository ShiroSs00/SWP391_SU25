package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AddressDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.PageResponse;
import com.swp391.bloodcare.dto.account.AccountSearchDTO;
import com.swp391.bloodcare.dto.profile.ProfileResponseDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


/*
Các chức năng sử lý trong ProfileService:
- Lấy profile theo AccountId
- Lấy profile theo username
- Tìm kiếm user dành cho staff/admin
 */
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
            return new ApiResponse<>(true,"Lấy thông tin profile thành công",prd);
        }catch(Exception e){
            return new ApiResponse<>(false, "Có lỗi xảy ra: " + e.getMessage(), null);
        }




    }



    //Lấy profile cho username
    public ApiResponse<ProfileResponseDTO> getProfileByUsername(String username){
        try{
            Optional<Account> accountOpt = accountRepository.findByUserName(username);
            if(!accountOpt.isPresent()) {
                return new ApiResponse<>(false, "Không tìm thấy tài khoản", null);
            }
                Account account = accountOpt.get();
                Profile profile = account.getProfile();
                if(profile == null){
                    return new ApiResponse<>(false,"Không tìm thấy thông tin cá nhân",null);
                }
                ProfileResponseDTO prd = mapToProfileResponseDTO(account, profile);
                return new ApiResponse<>(true,"Lấy thông tin profile thành công",prd);


        }catch (Exception e){
            return new ApiResponse<>(false,"Có lỗi xảy ra: " + e.getMessage(), null);
        }
    }

    //tìm kiếm accounts cho staff
    public ApiResponse<PageResponse<AccountSearchDTO>> searchAccounts(String keyword, boolean isActive, String roleName, Pageable pageable){
        try{

            Page<Account> accountPage = accountRepository.searchAccounts(keyword,isActive,roleName,pageable);

            List<AccountSearchDTO> accountDTOs = accountPage.getContent()
                    .stream()
                    .map(this::mapToAccountSearchDTO)
                    .collect(Collectors.toList());
            PageResponse<AccountSearchDTO> pageResponse = new PageResponse<>(
                    accountDTOs,
                    accountPage.getNumber(),
                    accountPage.getSize(),
                    accountPage.getTotalElements(),
                    accountPage.getTotalPages(),
                    accountPage.isFirst(),
                    accountPage.isLast()
            );

            return new ApiResponse<>(true, "Tìm kiếm thành công", pageResponse);

        }catch(Exception e){
            return new ApiResponse<>(false,"Có lỗi xảy ra: " + e.getMessage(), null);
        }
    }

    private AccountSearchDTO mapToAccountSearchDTO(Account account){
        AccountSearchDTO dto = new AccountSearchDTO();
        dto.setAccountId(account.getAccountId());
        dto.setUsername(account.getUserName());
        dto.setEmail(account.getEmail());
        dto.setActive(account.isActive());
        dto.setCreationDate(account.getCreationDate());

        //role
        if(account.getProfile() != null){
            dto.setRoleName(account.getRole().getRole());
        }

        //hospital
        if(account.getHospital() != null){
            dto.setHospitalName(account.getHospital().getHospitalName());
        }

        //profile
        if(account.getProfile() != null){
            Profile profle = account.getProfile();
            dto.setName(profle.getName());
            dto.setPhone(profle.getPhone());
            dto.setNumberOfBloodDonation(profle.getNumberOfBloodDonation());
        }
        return dto;

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
            Blood blood = profile.getBloodCode();
            String bloodTypeStr = blood.getBloodType().toString()+(blood.getRh() == Blood.RhFactor.POSITIVE ? "+" : "-");
            prd.setBloodType(bloodTypeStr);
        }

        //Achievment
        if(profile.getAchievement() != null){
            Achievement achievement = profile.getAchievement();
            String achievementStr = achievement.getAchievementName();
            prd.setAchievementName(achievementStr);
        }

        return prd;
    }
}
