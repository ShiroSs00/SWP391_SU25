package com.swp391.superapp.bloodsupport.controller;

import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.respository.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
public class EventAPI {
    @Autowired
    EventService accountService;
    @GetMapping("/api/account")
    public ResponseEntity getAccount() {
        List<Account> accounts = accountService.getAllAcount();
        return ResponseEntity.ok();
    }
    @PostMapping("/api/account")
    public void registerAccount() {

    }


}
