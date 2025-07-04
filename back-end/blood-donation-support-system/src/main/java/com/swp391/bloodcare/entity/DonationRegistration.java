package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "donation_registration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"event", "account", "component", "healthCheck", "donorFeedback"})
public class DonationRegistration {

    @Id
    @Column(name = "registration_id")
    @NotBlank
    private String registrationId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_created", nullable = false)
    @NotNull
    private Date dateCreated;

    @Column(name = "status", nullable = false)
    @NotBlank
    private String status;

    @Column(name = "donation_date", nullable = false)
    @NotNull
    @PastOrPresent
    private LocalDate donationDate;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private BloodDonationEvent event;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "component_id")
    private Component component;

    @OneToOne(mappedBy = "donationRegistration", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private HealthCheck healthCheck;

    @OneToOne(mappedBy = "donationRegistration", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private DonorFeedback donorFeedback;

    @OneToOne(mappedBy = "donationRegistration", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "history_id")
    private BloodDonationHistory bloodDonationHistory;
}