package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.DonorFeedback;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonorFeedbackDTO {
    private String feedbackID;
    private long process;
    private long bloodTest;
    private long postDonationCare;
    private long comfortable;
    private String description;
    private String registrationId;

    public static DonorFeedbackDTO fromEntity(DonorFeedback fb) {
        return new DonorFeedbackDTO(
                fb.getFeedbackID(),
                fb.getProcess(),
                fb.getBloodTest(),
                fb.getPostDonationCare(),
                fb.getComfortable(),
                fb.getDescription(),
                fb.getDonationRegistration() != null ? fb.getDonationRegistration().getRegistrationId() : null
        );
    }

}

