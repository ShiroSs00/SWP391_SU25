package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "after_donation_blood")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"healthCheck", "blood"})
public class AfterDonationBlood {

    @Id
    @Column(name = "after_donation_id")
    @NotBlank
    private String idAfterDonation;

    @Column(name = "infectious_diseases_checked")
    @NotNull
    private Boolean infectiousDiseasesChecked;

    @Column(name = "is_blood_usable")
    @NotNull
    private Boolean isBloodUsable;

    @Column(name = "status")
    @NotBlank
    private String status;

    @Column(name = "note")
    @Size(max = 500)
    private String note;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_check_id")
    private HealthCheck healthCheck;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_code")
    private Blood blood;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bag_id")
    private BloodBag bloodBag;
}