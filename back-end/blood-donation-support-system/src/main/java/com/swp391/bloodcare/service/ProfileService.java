package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AddressDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.account.AccountRegistrationDTO;
import com.swp391.bloodcare.dto.profile.ProfileResponseDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import com.swp391.bloodcare.repository.ProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


/*
Các chức năng sử lý trong ProfileService:
- Lấy profile theo AccountId
- Lấy profile theo username - token
- Tìm kiếm user dành cho staff/admin
 */
@Service
public class ProfileService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private BloodRepository bloodRepository;

    // 2 tạo độ có thể thay đổi
    private static final double FACILITY_LATITUDE = 10.762622;
    private static final double FACILITY_LONGITUDE = 106.660172;

    // Lấy account theo AccountId
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

    public ApiResponse<String> updateProfile(@Valid AccountRegistrationDTO dto){
       try{
           Authentication auth = SecurityContextHolder.getContext().getAuthentication();
           String currentAcc = auth.getName();

           Optional<Account> optionalAcc = accountRepository.findByAccountId(currentAcc);
           if (optionalAcc.isEmpty()) {
               return new ApiResponse<>(false, "Không tìm thấy tài khoản", null);
           }
           Account acc = optionalAcc.get();

           Profile pro = profileRepository.findByProfileId(acc.getProfile().getProfileId());
           if(dto.getName() != null) pro.setName(dto.getName());
           if(dto.getPhone() != null) pro.setPhone(dto.getPhone());
           pro.setGender(dto.isGender());
           if(dto.getDob() != null) pro.setDob(dto.getDob());
           if (dto.getAddress() != null) {
               Address address = new Address();
               address.setCity(dto.getAddress().getCity());
               address.setDistrict(dto.getAddress().getDistrict());
               address.setWard(dto.getAddress().getWard());
               address.setStreet(dto.getAddress().getStreet());
               address.setLongitude(dto.getAddress().getLongitude());
               address.setLatitude(dto.getAddress().getLatitude());
               pro.setAddress(address);
           }

           profileRepository.save(pro);
           return new ApiResponse<>(true, "Cập nhật tài khoản thành công", null);

       }catch(Exception e){
           TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
           return new ApiResponse<>(false, "Lỗi khi cập nhật tài khoản: " + e.getMessage(), null);
       }
    }

    //Lấy profile cho username -token
    public ApiResponse<ProfileResponseDTO> getProfileFromToken(){
        try{
           Authentication auth = SecurityContextHolder.getContext().getAuthentication();
           if(auth == null || !auth.isAuthenticated()){
               return new ApiResponse<>(false,"Người dùng chưa đăng nhập", null);
           }
           String id = auth.getName();

           //Tìm tài khoản theo
            Optional<Account> accountOpt = accountRepository.findById(id);
            if (!accountOpt.isPresent()) {
                return new ApiResponse<>(false, "Không tìm thấy tài khoản", null);
            }

            Account account = accountOpt.get();
            Profile profile = account.getProfile();

            if (profile == null) {
                return new ApiResponse<>(false, "Không tìm thấy thông tin cá nhân", null);
            }

            ProfileResponseDTO prd = mapToProfileResponseDTO(account, profile);
            return new ApiResponse<>(true, "Lấy thông tin profile thành công", prd);
        }catch (Exception e){
            return new ApiResponse<>(false,"Có lỗi xảy ra: " + e.getMessage(), null);
        }
    }


    public void decreaseBloodDonationCount(String accountId){
        Profile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy profile cho accountId: " + accountId));
        Long current = profile.getNumberOfBloodDonation();
        if(current == null)
            current = 0L;
        profile.setNumberOfBloodDonation(current - 1);
        achievementService.updateAchievementForProfile(profile);
        profileRepository.save(profile);
    }

    public void increaseBloodDonationCount(String accountId){
        Profile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy profile cho accountId: " + accountId));
        Long current = profile.getNumberOfBloodDonation();
        if(current == null)
            current = 0L;
        profile.setNumberOfBloodDonation(current + 1);
        achievementService.updateAchievementForProfile(profile);
        profileRepository.save(profile);
    }

    public void setBloodCodeForProfile(String accountId, String bloodCode) {
        Profile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy profile cho accountId: " + accountId));

        Blood blood = bloodRepository.findById(bloodCode)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy mã nhóm máu: " + bloodCode));

        profile.setBloodCode(blood);
        profileRepository.save(profile);
    }


    public List<ProfileResponseDTO> findProfilesByBloodAndDistance(String bloodCode, Double radiusKm) {
        double lat = FACILITY_LATITUDE;
        double lon = FACILITY_LONGITUDE;

        List<Profile> profiles = profileRepository.findByBloodAndDistance(
                bloodCode,
                lat,
                lon,
                radiusKm != null ? radiusKm : 9999.0  // Nếu null thì coi như không giới hạn
        );

        return profiles.stream()
                .map(profile -> mapToProfileResponseDTO(profile.getAccount(), profile))
                .collect(Collectors.toList());
    }



    private ProfileResponseDTO mapToProfileResponseDTO(Account account, Profile profile) {
        ProfileResponseDTO prd = new ProfileResponseDTO();

        //Account info
        prd.setAccountId(account.getAccountId());
        prd.setUsername(account.getUserName());
        prd.setEmail(account.getEmail());
        prd.setCreationDate(account.getCreationDate());
        prd.setIsActive(account.getIsActive());

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
                    add.getCity(),add.getDistrict(),add.getWard(),add.getStreet(),add.getLatitude(),add.getLongitude()
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
