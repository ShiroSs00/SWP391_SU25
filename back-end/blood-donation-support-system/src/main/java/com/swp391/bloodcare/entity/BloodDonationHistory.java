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

    @Column(name = "status")
    private String status;

    @OneToOne
    @JoinColumn(name = "history_id")
    private BloodDonationHistory bloodDonationHistory;
}
