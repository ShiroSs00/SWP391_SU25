package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class DonationRegistration {
    @Column(name = "registration_id")
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int registrationId;
    @Column(name = "date_created",nullable = false)
    private Date dateCreated;
    @Column(name = "status",nullable = false)
    private String status;
    @ManyToOne
    @JoinColumn(name = "event_id")
    private BloodDonationEvent bloodDonationEvent;
    @OneToOne
    @JoinColumn(name = "healthy_id")
    private HealthCheck healthCheck;

    @OneToOne
    @JoinColumn(name = "donor_feedback_id")
    private DonorFeedback donorFeedback;
    @ManyToOne
    @JoinColumn(name = "component_id")
    private Component component;



    public DonationRegistration() {
    }

    public DonationRegistration(String status, Date dateCreated, int registrationId) {
        this.status = status;
        this.dateCreated = dateCreated;
        this.registrationId = registrationId;
    }

    public BloodDonationEvent getBloodDonationEvent() {
        return bloodDonationEvent;
    }

    public void setBloodDonationEvent(BloodDonationEvent bloodDonationEvent) {
        this.bloodDonationEvent = bloodDonationEvent;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
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

    public Component getComponent() {
        return component;
    }

    public void setComponent(Component component) {
        this.component = component;
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
        return "DonationRegistrationAPI{" +
                "registrationId=" + registrationId +
                ", dateCreated=" + dateCreated +
                ", status='" + status + '\'' +
                ", bloodDonationEvent=" + bloodDonationEvent +
                '}';
    }
}
