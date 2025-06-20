package com.swp391.bloodcare.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name ="blood_match_request")
@Entity
public class BloodMatchRequest {
    private String matchId;
    private BloodRequest bloodRequest;

}
