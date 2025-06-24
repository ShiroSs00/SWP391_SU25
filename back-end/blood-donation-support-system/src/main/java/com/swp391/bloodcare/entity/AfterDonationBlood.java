package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "after_donation_blood")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"healthCheck", "blood"}) // Tránh vòng lặp khi gọi toString
public class AfterDonationBlood {

    @Id
    @Column(name = "after_donation_id")
    private String idAfterDonation;

    @Column(name = "infectious_diseases_checked")
    private Boolean infectiousDiseasesChecked;

    @Column(name = "is_blood_usable")
    private Boolean isBloodUsable;

    @Column(name = "status")
    private String status;

    @Column(name = "note")
    private String note;

    @OneToOne
    @JoinColumn(name = "health_check_id")
    private HealthCheck healthCheck;

    @ManyToOne
    @JoinColumn(name = "blood_code")
    private Blood blood;
}
