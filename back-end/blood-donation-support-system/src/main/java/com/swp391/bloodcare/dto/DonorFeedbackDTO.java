package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.DonorFeedback;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonorFeedbackDTO {

    private String feedbackID;

    @NotNull(message = "Đánh giá quy trình không được để trống")
    @Min(value = 1, message = "Quy trình phải từ 1 đến 5")
    @Max(value = 5, message = "Quy trình phải từ 1 đến 5")
    private Integer process;

    @NotNull(message = "Đánh giá xét nghiệm không được để trống")
    @Min(value = 1, message = "Xét nghiệm phải từ 1 đến 5")
    @Max(value = 5, message = "Xét nghiệm phải từ 1 đến 5")
    private Integer bloodTest;

    @NotNull(message = "Đánh giá chăm sóc sau hiến máu không được để trống")
    @Min(value = 1, message = "Chăm sóc phải từ 1 đến 5")
    @Max(value = 5, message = "Chăm sóc phải từ 1 đến 5")
    private Integer postDonationCare;

    @NotNull(message = "Đánh giá sự thoải mái không được để trống")
    @Min(value = 1, message = "Thoải mái phải từ 1 đến 5")
    @Max(value = 5, message = "Thoải mái phải từ 1 đến 5")
    private Integer comfortable;

    @Size(max = 500, message = "Mô tả không vượt quá 500 ký tự")
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
