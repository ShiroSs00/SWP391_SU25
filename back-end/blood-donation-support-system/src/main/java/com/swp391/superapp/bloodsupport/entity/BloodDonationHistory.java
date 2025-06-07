package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "blood_donation_history")
public class BloodDonationHistory {
    @Id
    @Column(name ="history_id")
    private int historyId;

    @Column(name ="account_id")
    private Profile accountId;

    @Column(name ="event_id")
    private Event eventId;

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

    public BloodDonationHistory() {
    }

    public BloodDonationHistory(int historyId, Profile accountId, Event eventId, int bloodVolumn, String locationSnapshot, String healthResult, String status, LocalDate createdAt) {
        this.historyId = historyId;
        this.accountId = accountId;
        this.eventId = eventId;
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

    public Profile getAccountId() {
        return accountId;
    }

    public void setAccountId(Profile accountId) {
        this.accountId = accountId;
    }

    public Event getEventId() {
        return eventId;
    }

    public void setEventId(Event eventId) {
        this.eventId = eventId;
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
                ", accountId=" + accountId.getName() +
                ", eventId=" + eventId +
                ", bloodVolume=" + bloodVolumn +
                ", locationSnapshot='" + locationSnapshot + '\'' +
                ", healthResult='" + healthResult + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
