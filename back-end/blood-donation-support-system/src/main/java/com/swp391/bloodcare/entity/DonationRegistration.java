package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class DonationRegistration {
    @Column(name = "registration_id")
    @Id
    private String registrationId;
    @Column(name = "date_created",nullable = false)
    private Date dateCreated;
    @Column(name = "status",nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private BloodDonationEvent event;

    @OneToOne(mappedBy = "donationRegistration",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private HealthCheck healthCheck;

    @OneToOne(mappedBy = "donationRegistration",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private DonorFeedback donorFeedback;

    @ManyToOne
    @JoinColumn(name = "component_id")
    private Component component;
    
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;



    public DonationRegistration() {
    }


    public DonationRegistration(String status, Date dateCreated, String registrationId) {
        this.status = status;
        this.dateCreated = dateCreated;
        this.registrationId = registrationId;
    }

    public BloodDonationEvent getEvent() {
        return event;
    }

    public void setEvent(BloodDonationEvent event) {
        this.event = event;
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

    public String getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(String registrationId) {
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
        return "DonationRegistrationController{" +
                "registrationId=" + registrationId +
                ", dateCreated=" + dateCreated +
                ", status='" + status + '\'' +
                ", bloodDonationEvent=" + event +
                '}';
    }
}
