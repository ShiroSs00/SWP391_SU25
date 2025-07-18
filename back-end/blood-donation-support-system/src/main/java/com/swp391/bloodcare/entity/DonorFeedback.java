package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "feedback_of_donor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "donationRegistration")
public class DonorFeedback {

    @Id
    @Column(name = "feed_back_id")
    @NotBlank(message = "feedbackId không được để trống")
    private String feedbackId;

    @Column(name = "process", nullable = false)
    @Min(value = 1, message = "process phải từ 1 đến 5")
    @Max(value = 5, message = "process phải từ 1 đến 5")
    private int process;

    @Column(name = "blood_test", nullable = false)
    @Min(value = 1, message = "bloodTest phải từ 1 đến 5")
    @Max(value = 5, message = "bloodTest phải từ 1 đến 5")
    private int bloodTest;

    @Column(name = "post_donation_care", nullable = false)
    @Min(value = 1, message = "postDonationCare phải từ 1 đến 5")
    @Max(value = 5, message = "postDonationCare phải từ 1 đến 5")
    private int postDonationCare;

    @Column(name = "comfortable", nullable = false)
    @Min(value = 1, message = "comfortable phải từ 1 đến 5")
    @Max(value = 5, message = "comfortable phải từ 1 đến 5")
    private int comfortable;

    @Column(name = "description")
    @Size(max = 1000, message = "description không được quá 1000 ký tự")
    private String description;

    @OneToOne
    @JoinColumn(
            name = "registration_id",
            referencedColumnName = "registration_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "Feedback_registration")
    )
    @NotNull(message = "donationRegistration không được null")
    private DonationRegistration donationRegistration;
}
