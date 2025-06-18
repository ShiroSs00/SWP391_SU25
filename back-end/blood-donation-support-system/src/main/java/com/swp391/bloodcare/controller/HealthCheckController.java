package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
import com.swp391.bloodcare.service.DonationRegistrationService;
import com.swp391.bloodcare.service.HealthCheckService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/healthcheck")

public class HealthCheckController {
    @Autowired
    private HealthCheckService healthCheckService;
    @Autowired
    private DonationRegistrationService donationRegistrationService;

    @GetMapping("/getall")
    public ResponseEntity<List<HealthCheck>> getAllHealthCheck() {
        List<HealthCheck> healthChecks = healthCheckService.getAllHealthChecks();
        return ResponseEntity.ok(healthChecks);
    }

    @PutMapping("update/{donationRegistrationId}")
    public ResponseEntity<HealthCheck> updateHealthCheck(
            @PathVariable int donationRegistrationId,
            @RequestBody HealthCheck updatedHealthCheck) {
        try {
            HealthCheck updated = healthCheckService.updateHealthCheckByDonationRegistrationId(donationRegistrationId, updatedHealthCheck);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/create/{id}")
    public ResponseEntity<HealthCheck> createHealthCheck(
            @PathVariable int donationRegistrationId,
            @RequestBody HealthCheck healthCheck) {
        try {
            DonationRegistration donationRegistration = donationRegistrationService.getDonationRegistrationById(donationRegistrationId);
            HealthCheck create = healthCheckService.createHealthCheck(healthCheck, donationRegistration);
            return ResponseEntity.ok(create);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
