package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class DonationRegistration {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int registrationId;
    @Column(name = "conponent",nullable = false)
    private Enum conponent;
    @Column(name = "dateCreated",nullable = false)
    private Date dateCreated;
    @Column(name = "status",nullable = false)
    private String status;
    @ManyToOne
    @JoinColumn(name = "EventID")
    private BloodDonationEvent bloodDonationEvent;
    @OneToOne
    @JoinColumn(name = "ProfileIdCreate");
    private Profile profile;
    @OneToOne
    @JoinColumn(name = "HealthCheckId")
    private HealthCheck healthCheck;
    @OneToOne
    @JoinColumn(name = "DonorFeedbackId")
    private DonorFeedback donorFeedback;





    public DonationRegistration() {
    }

    public DonationRegistration(String status, Date dateCreated, Enum conponent, int registrationId) {
        this.status = status;
        this.dateCreated = dateCreated;
        this.conponent = conponent;
        this.registrationId = registrationId;
    }

    public BloodDonationEvent getBloodDonationEvent() {
        return bloodDonationEvent;
    }

    public void setBloodDonationEvent(BloodDonationEvent bloodDonationEvent) {
        this.bloodDonationEvent = bloodDonationEvent;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public HealthCheck getHealthCheck() {
        return healthCheck;
    }

    public void setHealthCheck(HealthCheck healthCheck) {
        this.healthCheck = healthCheck;
    }

    public DonorFeedback getDonorFeedback() {
        return donorFeedback;
    }

    public void setDonorFeedback(DonorFeedback donorFeedback) {
        this.donorFeedback = donorFeedback;
    }

    public int getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(int registrationId) {
        this.registrationId = registrationId;
    }

    public Enum getConponent() {
        return conponent;
    }

    public void setConponent(Enum conponent) {
        this.conponent = conponent;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "DonationRegistration{" +
                "registrationId=" + registrationId +
                ", conponent=" + conponent +
                ", dateCreated=" + dateCreated +
                ", status='" + status + '\'' +
                ", bloodDonationEvent=" + bloodDonationEvent +
                '}';
    }
}
