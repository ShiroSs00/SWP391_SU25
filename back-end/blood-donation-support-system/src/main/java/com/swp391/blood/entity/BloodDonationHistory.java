package com.swp391.blood.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "blood_donation_history")
public class BloodDonationHistory {
    @Id
    @Column(name ="history_id")
    private int historyId;

    @OneToOne
    @JoinColumn(name ="account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private BloodDonationEvent event;

    @Column(name ="blood_volumn")
    private int bloodVolumn;

    @Column(name ="location_snapshot")
    private String locationSnapshot;

    @Column(name ="health_result")
    private String healthResult;

    @Column(name ="status")
    private String status;

    @Column(name ="created_at")
    private LocalDate createdAt;

    public BloodDonationHistory() {
    }

    public BloodDonationHistory(int historyId,  int bloodVolumn, String locationSnapshot, String healthResult, String status, LocalDate createdAt) {
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

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public BloodDonationEvent getEvent() {
        return event;
    }

    public void setEvent(BloodDonationEvent event) {
        this.event = event;
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
