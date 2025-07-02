package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private String registrationId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_created", nullable = false)
    private Date dateCreated;

    @Column(name = "status", nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private BloodDonationEvent event;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "component_id")
    private Component component;

    @OneToOne(mappedBy = "donationRegistration", cascade = CascadeType.ALL, fetch = FetchType.LAZY,orphanRemoval = true)
    private HealthCheck healthCheck;

    @OneToOne(mappedBy = "donationRegistration", cascade = CascadeType.ALL, fetch = FetchType.LAZY,orphanRemoval = true)
    private DonorFeedback donorFeedback;
}
