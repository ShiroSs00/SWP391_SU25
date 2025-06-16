package com.swp391.superapp.bloodsupport.controller;

import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.entity.BloodDonationEvent;
import com.swp391.superapp.bloodsupport.entity.DonationRegistration;
import com.swp391.superapp.bloodsupport.entity.Profile;
import com.swp391.superapp.bloodsupport.service.DonationRegistrationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DonationRegistrationAPI {
    @Autowired
    private DonationRegistrationService donationRegistrationService;

    @GetMapping("/api/donation")
    public ResponseEntity<List<DonationRegistration>> getAllDonationRegistration() {
        List<DonationRegistration> registrations = donationRegistrationService.getAllDonationRegistrations();
        return ResponseEntity.ok(registrations);
    }

//    @PostMapping("/api/donation")
//    public ResponseEntity<DonationRegistration> createDonationRegistration(
//            @RequestBody DonationRegistration donationRegistration,
//            @AuthenticationPrincipal Account account) {
//        DonationRegistration savedRegistration = donationRegistrationService.createDonationRegistration(donationRegistration, account);
//        return new ResponseEntity<>(savedRegistration, HttpStatus.CREATED);
//    }

    @PutMapping("/api/donation/{id}")
    public ResponseEntity<DonationRegistration> updateDonationRegistration(
            @PathVariable int id,
            @RequestBody DonationRegistration donationRegistration
    ) {
        DonationRegistration result = donationRegistrationService.updateDonationRegistration(id, donationRegistration);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/api/donation/{id}")
    public ResponseEntity<?> deleteDonationRegistration(@PathVariable int id) {
        try {
            donationRegistrationService.deleteDonationRegistration(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Donation registration not found with id: " + id);
        }
    }







}
