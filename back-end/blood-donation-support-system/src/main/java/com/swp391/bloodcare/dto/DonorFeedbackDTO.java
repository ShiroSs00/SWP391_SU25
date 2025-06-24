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

    private Integer process;
    private Integer bloodTest;
    private Integer postDonationCare;
    private Integer comfortable;

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

    public static DonorFeedback toEntity(DonorFeedbackDTO dto) {
        DonorFeedback fb = new DonorFeedback();
        fb.setFeedbackID(dto.getFeedbackID());
        fb.setProcess(dto.getProcess());
        fb.setBloodTest(dto.getBloodTest());
        fb.setPostDonationCare(dto.getPostDonationCare());
        fb.setComfortable(dto.getComfortable());
        fb.setDescription(dto.getDescription());
        return fb;
    }
}
