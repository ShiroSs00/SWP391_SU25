package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.service.DonationRegistrationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/donation")
public class DonationRegistrationController {
    @Autowired
    private DonationRegistrationService donationRegistrationService;

    @GetMapping("/getall")
    public ResponseEntity<List<DonationRegistrationDTO>> getAllDonationRegistration() {
        List<DonationRegistrationDTO> registrations = donationRegistrationService.getAllDonationRegistrations();
        return ResponseEntity.ok(registrations);
    }

    @PostMapping("/create/{id}")
    public ResponseEntity<DonationRegistrationDTO> createDonationRegistration(
            @PathVariable String id,
            @AuthenticationPrincipal Account account) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        DonationRegistrationDTO savedRegistration = donationRegistrationService.createDonationByUsername(username, id);
        return new ResponseEntity<>(savedRegistration, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DonationRegistrationDTO> updateDonationRegistration(
            @PathVariable String id,
            @RequestBody DonationRegistration donationRegistration
    ) {
        DonationRegistrationDTO result = donationRegistrationService.updateDonationRegistration(id, donationRegistration);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDonationRegistration(@PathVariable String id) {
        try {
            donationRegistrationService.deleteDonationRegistration(id);
            return ResponseEntity.ok("Successfully deleted donation registration with ID: " + id);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Donation registration not found with id: " + id);
        }
    }







}
