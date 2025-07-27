package com.swp391.bloodcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodDonationHistoryDTO {
    private String id;
    private String name;
    private String event;
    private String bloodCode;
    private String registerId;
    private String healthCheck;
    private String afterDonationBlood;
    private String status;
}
