package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.BloodBagDTO;
import com.swp391.bloodcare.service.BloodBagService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-bags")
@RequiredArgsConstructor
public class BloodBagController {

    private final BloodBagService bloodBagService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody BloodBagDTO dto) {
        try {
            BloodBagDTO saved = bloodBagService.createBloodBag(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update/{bagId}")
    public ResponseEntity<?> update(@PathVariable String bagId, @RequestBody BloodBagDTO dto) {
        try {
            BloodBagDTO updated = bloodBagService.updateBloodBag(bagId, dto);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{bagId}")
    public ResponseEntity<?> delete(@PathVariable String bagId) {
        try {
            bloodBagService.deleteBloodBag(bagId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/find-by-afterid/{afterDonationId}")
    public ResponseEntity<?> findByAfterDonationId(@PathVariable String afterDonationId) {
        try {
            BloodBagDTO found = bloodBagService.findByAfterDonationId(afterDonationId);
            return ResponseEntity.ok(found);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getall")
    public ResponseEntity<List<BloodBagDTO>> getAll() {
        return ResponseEntity.ok(bloodBagService.getAllBloodBags());
    }
}
