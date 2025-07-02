package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "blood_donation_history")
public class BloodDonationHistory {

    @Id
    @Column(name ="history_id")
    private String historyId;

    @OneToOne
    @JoinColumn(name = "id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "registration_id")
    private DonationRegistration donationRegistration;

    @ManyToOne
    @JoinColumn(name = "health_check_id")
    private HealthCheck healthCheck;

    @ManyToOne
    @JoinColumn(name = "after_donation_id")
    private AfterDonationBlood afterDonationBlood;

    @Column(name = "status")
    private String status;
}
