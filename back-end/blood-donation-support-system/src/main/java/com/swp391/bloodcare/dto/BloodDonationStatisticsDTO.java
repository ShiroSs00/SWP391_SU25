package com.swp391.bloodcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodDonationStatisticsDTO {
    private int totalDonations;
    private int completedDonations;
    private int failedDonations;
    private int pendingDonations;
    private long totalVolumeToTake;
    private String mostRecentDonationDate;
    private String mostFrequentEvent;
}
