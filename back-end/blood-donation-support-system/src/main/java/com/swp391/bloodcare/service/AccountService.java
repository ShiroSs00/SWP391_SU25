package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.account.AccountRegistrationDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.account.AccountResponseDTO;
import com.swp391.bloodcare.dto.account.AccountSearchDTO;
import com.swp391.bloodcare.dto.account.ChangePassDTO;
import com.swp391.bloodcare.dto.log.GoogleAccountCompletionDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Address;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.entity.Role;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.ProfileRepository;
import com.swp391.bloodcare.repository.RoleRepository;
import com.swp391.bloodcare.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
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
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final double HOSPITAL_LAT = 10.8585043;
    private static final double HOSPITAL_LNG = 106.7560814;



    //tạo account
    @Transactional
    public ApiResponse<String> registerAccount(@Valid AccountRegistrationDTO accountRegistration) {
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
            account.setIsActive(true);
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
            address.setLongitude(accountRegistration.getAddress().getLongitude());
            address.setLatitude(accountRegistration.getAddress().getLatitude());

            profile.setAddress(address);
            profile.setNumberOfBloodDonation(0);

            //chưa hoàn thiện -- này là ngày nghỉ ngơi
            profile.setRestDate(null);

            profile.setCancelCount(0);
            profile.setCanRequestBlood(true);

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

            if(!account.getIsActive()){
                return new ApiResponse<>(false, "Tài khoản đã bị vô hiệu hóa trước đó", null);
            }

            account.setIsActive(false);
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
            if(account.getIsActive()){
                return new ApiResponse<>(false, "Tài khoản đang hoạt động", null);
            }
            account.setIsActive(true);
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

    @Transactional
    public ApiResponse<String> changePassword(ChangePassDTO dto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentAccountId = auth.getName();

            Account account = accountRepository.findAccountByAccountId(currentAccountId);

            if (account == null) {
                return new ApiResponse<>(false, "Tài khoản không tồn tại", null);
            }

            // Kiểm tra mật khẩu cũ có khớp không
            if (!passwordEncoder.matches(dto.getOldPassword(), account.getPassword())) {
                return new ApiResponse<>(false, "Mật khẩu cũ không chính xác", null);
            }

            // Kiểm tra mật khẩu mới và xác nhận
            if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
                return new ApiResponse<>(false, "Mật khẩu xác nhận không khớp", null);
            }

            // Đổi mật khẩu
            account.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            accountRepository.save(account);

            return new ApiResponse<>(true, "Đổi mật khẩu thành công", null);

        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ApiResponse<>(false, "Lỗi hệ thống: " + e.getMessage(), null);
        }
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
        dto.setActive(account.getIsActive());
        return dto;
    }

    //tạo tài khoản nâng cao cho admin (có thể set role)
    @Transactional
    public ApiResponse<String> createAccountByAdmin(AccountRegistrationDTO accountRegistration) {
        try {
            // Kiểm tra quyền admin
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentAccountId = auth.getName();
            Account currentUser = accountRepository.findAccountByAccountId(currentAccountId);

            if (currentUser == null || !"ADMIN".equals(currentUser.getRole().getRole())) {
                return new ApiResponse<>(false, "Bạn không có quyền thực hiện chức năng này", null);
            }

            // Kiểm tra tài khoản đã tồn tại
            if (accountRepository.existsByUserNameIgnoreCase(accountRegistration.getUsername())) {
                return new ApiResponse<>(false, "Tài khoản đã tồn tại", null);
            }

            if (accountRepository.existsByEmailIgnoreCase(accountRegistration.getEmail())) {
                return new ApiResponse<>(false, "Email đã tồn tại", null);
            }

            // Tạo account mới
            Account account = new Account();
            account.setAccountId(UUID.randomUUID().toString());
            account.setUserName(accountRegistration.getUsername());
            account.setEmail(accountRegistration.getEmail());
            account.setPassword(passwordEncoder.encode(accountRegistration.getPassword()));
            account.setIsActive(true); // Admin tạo thì mặc định active
            account.setCreationDate(LocalDate.now());

            // Set role theo yêu cầu (admin có thể chỉ định role)
            String roleName = accountRegistration.getRoleName() != null ?
                    accountRegistration.getRoleName() : "MEMBER";

            Role role = roleRepository.findByRole(roleName)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy role: " + roleName));
            account.setRole(role);

            Account savedAccount = accountRepository.save(account);

            // Tạo profile
            Profile profile = new Profile();
            String profileId = generateProfileId();
            profile.setProfileId(profileId);
            profile.setAccount(savedAccount);

            profile.setName(accountRegistration.getName());
            profile.setPhone(accountRegistration.getPhone());


            profile.setGender(accountRegistration.isGender());

            // Set địa chỉ
            if (accountRegistration.getAddress() != null) {
                Address address = new Address();
                address.setCity(accountRegistration.getAddress().getCity());
                address.setDistrict(accountRegistration.getAddress().getDistrict());
                address.setWard(accountRegistration.getAddress().getWard());
                address.setStreet(accountRegistration.getAddress().getStreet());
                address.setLongitude(accountRegistration.getAddress().getLongitude());
                address.setLatitude(accountRegistration.getAddress().getLatitude());
                profile.setAddress(address);
            }

            profile.setNumberOfBloodDonation(0);
            profile.setRestDate(LocalDate.now());

            profileRepository.save(profile);

            return new ApiResponse<>(true, "Tạo tài khoản thành công! Role: " + roleName, savedAccount.getAccountId());

        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ApiResponse<>(false, "Có lỗi xảy ra: " + e.getMessage(), null);
        }
    }

    @Transactional
    public ApiResponse<String> completeGoogleAccount(String email, @Valid GoogleAccountCompletionDTO dto){
        try{
            if (accountRepository.existsByEmailIgnoreCase(email)) {
                return new ApiResponse<>(false, "Email đã tồn tại", null);
            }

            Account account = new Account();
            account.setAccountId(UUID.randomUUID().toString());
            account.setUserName(email); // dùng email làm username luôn
            account.setEmail(email);
            account.setPassword(passwordEncoder.encode(dto.getPassword()));
            account.setIsActive(true);
            account.setCreationDate(LocalDate.now());

            Role role = roleRepository.findByRole("MEMBER")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy role mặc định"));
            account.setRole(role);
            Account savedAccount = accountRepository.save(account);

            // Tạo Profile
            Profile profile = new Profile();
            profile.setProfileId(generateProfileId());
            profile.setAccount(savedAccount);
            profile.setName(dto.getName());
            profile.setPhone(dto.getPhone());
            profile.setDob(dto.getDob());
            profile.setGender(dto.isGender());

            Address address = new Address();
            address.setCity(dto.getAddress().getCity());
            address.setDistrict(dto.getAddress().getDistrict());
            address.setWard(dto.getAddress().getWard());
            address.setStreet(dto.getAddress().getStreet());
            address.setLongitude(dto.getAddress().getLongitude());
            address.setLatitude(dto.getAddress().getLatitude());

            profile.setAddress(address);
            profile.setNumberOfBloodDonation(0);
            profile.setRestDate(LocalDate.now());
            profile.setCancelCount(0);
            profile.setCanRequestBlood(true);

            profileRepository.save(profile);
            String token = jwtUtil.generateToken(savedAccount);
            return new ApiResponse<>(true, "Tạo tài khoản thành công", token);

        }catch (Exception e){
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ApiResponse<>(false, "Có lỗi khi tạo tài khoản: " + e.getMessage(), null);
        }
    }


    private AccountSearchDTO mapToAccountSearchDTO(Account account){
        AccountSearchDTO dto = new AccountSearchDTO();
        dto.setAccountId(account.getAccountId());
        dto.setUsername(account.getUserName());
        dto.setEmail(account.getEmail());
        dto.setActive(account.getIsActive());
        dto.setCreationDate(account.getCreationDate());

        //role
        if(account.getRole() != null){
            dto.setRoleName(account.getRole().getRole());
        }


        //profile
        if(account.getProfile() != null){
            Profile profile = account.getProfile();
            dto.setName(profile.getName());
            dto.setPhone(profile.getPhone());
            if(profile.getBloodCode() != null){
                dto.setBloodCode(profile.getBloodCode().getBloodCode());
            }
            dto.setNumberOfBloodDonation(profile.getNumberOfBloodDonation());
        }
        return dto;

    }

    public List<Account> findNearbyDonors(
            double radiusKm,
            List<String> bloodTypes,
            String excludedAccountId
    ) {
        if (bloodTypes == null || bloodTypes.isEmpty()) {
            bloodTypes = null;
            return accountRepository.findNearbyCompatibleDonorsWithoutBlood(
                    HOSPITAL_LAT, HOSPITAL_LNG, radiusKm, excludedAccountId
            );
        }

        return accountRepository.findNearbyCompatibleDonorsByLatLng(
                HOSPITAL_LAT,
                HOSPITAL_LNG,
                radiusKm,
                bloodTypes,
                excludedAccountId
        );
    }

    public List<AccountSearchDTO> mapToAccountSearchDTOList(List<Account> accounts) {
        return accounts.stream()
                .map(this::mapToAccountSearchDTO)
                .collect(Collectors.toList());
    }



}
