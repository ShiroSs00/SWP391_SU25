package com.swp391.bloodcare.service;


import com.swp391.bloodcare.dto.log.LoginRequest;
import com.swp391.bloodcare.dto.log.LoginResponse;
import com.swp391.bloodcare.entity.Account;

import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public LoginResponse login(LoginRequest loginRequest) {

        try{
            //tìm account theo username hoặc email
            if(loginRequest == null || loginRequest.getUsername() == null || loginRequest.getPassword() == null){
                return new LoginResponse(null, "Username or password is missing", null, null);

            }

           Account> accountOtp = accountRepository.findByUserName(loginRequest.getUsername());


            if(accountOtp.isEmpty()){
                accountOtp = accountRepository.findByEmail(loginRequest.getUsername());
            }

            if(accountOtp.isEmpty()){
                return new LoginResponse(null,"User not found", null, null);
            }

           Account account = accountOtp.get();

            //kiểm tra account có active không?
            if(!account.isActive()){
                return new LoginResponse(null,"Account is not active", null, null);
            }

            // kiểm tra password
//            if(!passwordEncoder.matches(loginRequest.getPassword(), account.getPassword())){
//                return new LoginResponse(null,"Wrong password", null, null);
//            }
            if(!loginRequest.getPassword().equals(account.getPassword())){
                return new LoginResponse(null,"Password is incorrect", null, null);
            }

            //tạo jwt token
            String token = jwtUtil.generateToken(account.getUserName());

            return new LoginResponse(token,"Login successful", account.getUserName(),account.getRole().getRole());
        }catch (Exception e) {
            return new LoginResponse(null, "Login failed: " + e.getMessage(), null, null);
        }
    }

    public String logout(String token) {
        return "logout successful";
    }

    public boolean validateToken(String token) {
        try{
            String username = jwtUtil.extractUsername(token);
            return jwtUtil.validateToken(token, username);
        }catch(Exception e){
            return false;
        }
    }


}
