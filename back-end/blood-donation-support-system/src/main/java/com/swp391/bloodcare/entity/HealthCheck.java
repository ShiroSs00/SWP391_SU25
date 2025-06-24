package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "health_check")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"donationRegistration", "afterDonationBlood"})
public class HealthCheck {

    @Id
    @Column(name = "health_check_id")
    private String healthCheckId;

    @Column(name = "weight", nullable = false)
    private double weight;

    @Column(name = "temperature", nullable = false)
    private double temperature;

    @Column(name = "blood_pressure", nullable = false)
    private double bloodPressure;

    @Column(name = "pulse", nullable = false)
    private long pulse;

    @Column(name = "hemoglobin", nullable = false)
    private double hemoglobin;

    @Column(name = "volume_to_take", nullable = false)
    private long volumeToTake;

    @Column(name = "is_fit_to_donate", nullable = false)
    private boolean isFitToDonate;

    @Column(name = "note")
    private String note;

    @OneToOne
    @JoinColumn(name = "registration_id")
    private DonationRegistration donationRegistration;

    @OneToOne(mappedBy = "healthCheck", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AfterDonationBlood afterDonationBlood;
}
