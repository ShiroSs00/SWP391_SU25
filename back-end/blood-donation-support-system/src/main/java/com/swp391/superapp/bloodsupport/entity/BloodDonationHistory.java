package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "blood_donation_history")
public class BloodDonationHistory {
    @Id
    @Column(name ="history_id")
    private int historyId;

    @OneToOne(fetch = FetchType.EAGER)
    @Column(name ="account_id")
    private Profile account;

<<<<<<< HEAD

=======
    @ManyToOne
    @JoinColumn(name = "EventId")
    private BloodDonationEvent event;
>>>>>>> d140a20b35618f0a368badf7ac899c5c62c22579


    @Column(name ="blood_volumn")
    private int bloodVolumn;

    @Column(name ="")
    private String locationSnapshot;

    @Column(name ="")
    private String healthResult;

    @Column(name ="")
    private String status;

    @Column(name ="")
    private LocalDate createdAt;

    @Column(name ="event_id")
    @ManyToOne
    private BloodDonationEvent eventId;

    public BloodDonationHistory() {
    }

<<<<<<< HEAD
    public BloodDonationHistory(int historyId, Profile accountId, BloodDonationEvent eventId, int bloodVolumn, String locationSnapshot, String healthResult, String status, LocalDate createdAt) {
=======
    public BloodDonationHistory(int historyId,  int bloodVolumn, String locationSnapshot, String healthResult, String status, LocalDate createdAt) {
>>>>>>> d140a20b35618f0a368badf7ac899c5c62c22579
        this.historyId = historyId;
        this.bloodVolumn = bloodVolumn;
        this.locationSnapshot = locationSnapshot;
        this.healthResult = healthResult;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getHistoryId() {
        return historyId;
    }

    public void setHistoryId(int historyId) {
        this.historyId = historyId;
    }

    public Profile getAccount() {
        return account;
    }

    public void setAccount(Profile account) {
        this.account = account;
    }

<<<<<<< HEAD
    public BloodDonationEvent getEventId() {
        return eventId;
    }

    public void setEventId(BloodDonationEvent eventId) {
        this.eventId = eventId;
=======
    public BloodDonationEvent getEvent() {
        return event;
    }

    public void setEvent(BloodDonationEvent event) {
        this.event = event;
>>>>>>> d140a20b35618f0a368badf7ac899c5c62c22579
    }

    public int getBloodVolumn() {
        return bloodVolumn;
    }

    public void setBloodVolumn(int bloodVolumn) {
        this.bloodVolumn = bloodVolumn;
    }

    public String getLocationSnapshot() {
        return locationSnapshot;
    }

    public void setLocationSnapshot(String locationSnapshot) {
        this.locationSnapshot = locationSnapshot;
    }

    public String getHealthResult() {
        return healthResult;
    }

    public void setHealthResult(String healthResult) {
        this.healthResult = healthResult;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "BloodDonationHistory{" +
                "historyId=" + historyId +

                ", bloodVolume=" + bloodVolumn +
                ", locationSnapshot='" + locationSnapshot + '\'' +
                ", healthResult='" + healthResult + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
