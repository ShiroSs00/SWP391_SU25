package com.swp391.bloodcare.controller;


import com.swp391.bloodcare.dto.account.AccountRegistrationDTO;
import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.log.LoginRequest;
import com.swp391.bloodcare.dto.log.LoginResponse;
import com.swp391.bloodcare.service.AccountService;
import com.swp391.bloodcare.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);

        if(response.getToken() != null){
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        try {

            String token = authHeader.substring(7);
            String message = authService.logout(token);
            return ResponseEntity.ok(message);

        }catch (Exception e){
            return ResponseEntity.badRequest().body("Logout failed");
        }

    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authHeader) {
        try{

            String token = authHeader.substring(7);
            boolean isValid = authService.validateToken(token);
            return ResponseEntity.ok(isValid);

        }catch(Exception e){
            return ResponseEntity.ok(false);
        }
    }


    //tạo tài khoản
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> registerAccount(@Valid @RequestBody AccountRegistrationDTO accountRegistrationDTO, BindingResult bindingResult) {
        //kiểm tra validation error
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));

            ApiResponse<String> response = new ApiResponse<>(false, errorMessage, null);
            return ResponseEntity.badRequest().body(response);
        }

        ApiResponse<String> response = accountService.registerAccount(accountRegistrationDTO);

        if(response.isSuccess()){
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }



}
