package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.service.DonationRegistrationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("/api")
public class DonationRegistrationController {
    @Autowired
    private DonationRegistrationService donationRegistrationService;

    @GetMapping("/donation")
    public ResponseEntity<List<DonationRegistration>> getAllDonationRegistration() {
        List<DonationRegistration> registrations = donationRegistrationService.getAllDonationRegistrations();
        return ResponseEntity.ok(registrations);
    }

    @PostMapping("/donation")
    public ResponseEntity<DonationRegistration> createDonationRegistration(
            @RequestBody DonationRegistration donationRegistration,
            @AuthenticationPrincipal Account account) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        DonationRegistration savedRegistration = donationRegistrationService.createDonationByUsername(username, donationRegistration);
        return new ResponseEntity<>(savedRegistration, HttpStatus.CREATED);
    }

    @PutMapping("/donation/{id}")
    public ResponseEntity<DonationRegistration> updateDonationRegistration(
            @PathVariable int id,
            @RequestBody DonationRegistration donationRegistration
    ) {
        DonationRegistration result = donationRegistrationService.updateDonationRegistration(id, donationRegistration);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/donation/{id}")
    public ResponseEntity<?> deleteDonationRegistration(@PathVariable int id) {
        try {
            donationRegistrationService.deleteDonationRegistration(id);
            return ResponseEntity.ok("Successfully deleted donation registration with ID: " + id);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Donation registration not found with id: " + id);
        }
    }







}
