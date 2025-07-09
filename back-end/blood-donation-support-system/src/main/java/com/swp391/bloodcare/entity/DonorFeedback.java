package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
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
    private String feedbackId;

    @Column(name = "process", nullable = false)
    private int process;

    @Column(name = "blood_test", nullable = false)
    private int bloodTest;

    @Column(name = "post_donation_care", nullable = false)
    private int postDonationCare;

    @Column(name = "comfortable", nullable = false)
    private int comfortable;

    @Column(name = "description")
    private String description;

    @OneToOne
    @JoinColumn(
            name = "registration_id",
            referencedColumnName = "registration_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "Feedback_registration")
    )
    private DonationRegistration donationRegistration;

}
