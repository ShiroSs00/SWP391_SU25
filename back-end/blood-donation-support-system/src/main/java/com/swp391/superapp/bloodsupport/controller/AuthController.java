package com.swp391.superapp.bloodsupport.controller;

import com.swp391.superapp.bloodsupport.DTO.log.LoginRequest;
import com.swp391.superapp.bloodsupport.DTO.log.LoginResponse;
import com.swp391.superapp.bloodsupport.service.AuthService;
import org.springframework.web.bind.annotation.RequestBody; // ✅ Đúng

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

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



}
