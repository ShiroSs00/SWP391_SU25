package com.swp391.bloodcare.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.log.LoginRequest;
import com.swp391.bloodcare.dto.log.LoginResponse;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.google.api.client.json.jackson2.JacksonFactory;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

/*
Các chức năng xử lý trong AuthService:
- Login/Logout
- Tìm kiếm tất cả Account
 */
@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Kiểm tra thông tin đầu vào
            if (loginRequest == null || loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                return new LoginResponse(null, "Username or password is missing", null, null);
            }

            // Tìm Account theo username hoặc email
            Optional<Account> accountOtp = accountRepository.findByUserName(loginRequest.getUsername());
            if (accountOtp.isEmpty()) {
                accountOtp = accountRepository.findByEmail(loginRequest.getUsername());
            }

            if (accountOtp.isEmpty()) {
                return new LoginResponse(null, "User not found", null, null);
            }

            Account account = accountOtp.get();

            // Kiểm tra tài khoản có bị vô hiệu hóa không
            if (!account.getIsActive()) {
                return new LoginResponse(null, "Account is not active", null, null);
            }

            // kiểm tra password
            if(!passwordEncoder.matches(loginRequest.getPassword(), account.getPassword())){
                return new LoginResponse(null,"Wrong password", null, null);

            }
//            if(!loginRequest.getPassword().equals(account.getPassword())){
//                return new LoginResponse(null,"Password is incorrect", null, null);
//            }


            //tạo jwt token
            String token = jwtUtil.generateToken(account);


            return new LoginResponse(token, "Login successful", account.getUserName(), account.getRole().getRole());

        } catch (Exception e) {
            return new LoginResponse(null, "Login failed: " + e.getMessage(), null, null);
        }
    }

    public String logout(String token) {
        // Nếu muốn xử lý blacklist token, triển khai tại đây
        return "Logout successful";
    }

    public boolean validateToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            return jwtUtil.validateToken(token, username);
        } catch (Exception e) {
            return false;
        }
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    private static final String GOOGLE_ID_CLIENT ="407408718192.apps.googleusercontent.com";

    @Value("${google.client.id}")
    private String googleClientId;


    public ApiResponse<String> loginWithGoogle(String idTokenString){
        try{
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if(idToken != null){
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Optional<Account> accountOtp = accountRepository.findByEmailIgnoreCase(email);
                if(accountOtp.isPresent()){
                    Account account = accountOtp.get();

                    if(!account.getIsActive()){
                        return new ApiResponse<>(false, "Tài khoản đã bị vô hiệu hóa", null);
                    }

                    String token = jwtUtil.generateToken(account);
                    return new ApiResponse<>(true, "Đăng nhập thành công", token);

                } else {
                    // Nếu tài khoản chưa tồn tại, trả về email để frontend hiển thị form nhập thông tin
                    return new ApiResponse<>(true, "Cần hoàn thiện thông tin", email);
                }
            } else {
                return new ApiResponse<>(false, "ID Token không hợp lệ", null);
            }
        }catch(Exception e){
            return new ApiResponse<>(false, "Lỗi xác thực: " + e.getMessage(), null);
        }
    }

}
