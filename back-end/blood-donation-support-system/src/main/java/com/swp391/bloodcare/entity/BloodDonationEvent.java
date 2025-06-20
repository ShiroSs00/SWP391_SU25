package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;



@Entity
public class BloodDonationEvent {
    @Id
    @Column(name = "event_id")
    private String  eventId;
    @Column(name = "name_of_event")
    private String nameOfEvent;
    @Column(name = "creation_date")
    private Date creationDate;
    @Column(name = "start_date")
    private Date startDate;
    @Column(name = "end_date")
    private Date endDate;
    @Column(name = "expected_blood_volume")
    private long expectedBloodVolume;
    @Column(name ="actual_volume")
    private long actualVolume;
    @Column (name = "location")
    private String location;
    @Column(name = "status")
    private String status;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "event")
    private List<BloodDonationHistory> bloodDonationHistoryList = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "account_id_create")
    private Account account;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "event")
    private List<DonationRegistration> donationRegistrations = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "event")
    private List<BloodDonationHistory> bloodDonationHistories = new ArrayList<>();

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public BloodDonationEvent() {
    }

    public List<BloodDonationHistory> getBloodDonationHistoryList() {
        return bloodDonationHistoryList;
    }

    public void setBloodDonationHistoryList(List<BloodDonationHistory> bloodDonationHistoryList) {
        this.bloodDonationHistoryList = bloodDonationHistoryList;
    }

    public List<DonationRegistration> getDonationRegistrations() {
        return donationRegistrations;
    }

    public void setDonationRegistrations(List<DonationRegistration> donationRegistrations) {
        this.donationRegistrations = donationRegistrations;
    }

    public List<BloodDonationHistory> getBloodDonationHistories() {
        return bloodDonationHistories;
    }

    public void setBloodDonationHistories(List<BloodDonationHistory> bloodDonationHistories) {
        this.bloodDonationHistories = bloodDonationHistories;
    }


    public BloodDonationEvent(String nameOfEvent, Date creationDate, Date startDate, Date endDate, long expectedBloodVolume, long actualVolume, String location, String status) {
        this.nameOfEvent = nameOfEvent;
        this.creationDate = creationDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.expectedBloodVolume = expectedBloodVolume;
        this.actualVolume = actualVolume;
        this.location = location;
        this.status = status;
    }



    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getNameOfEvent() {
        return nameOfEvent;
    }

    public void setNameOfEvent(String nameOfEvent) {
        this.nameOfEvent = nameOfEvent;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public long getExpectedBloodVolume() {
        return expectedBloodVolume;
    }

    public void setExpectedBloodVolume(long expectedBloodVolume) {
        this.expectedBloodVolume = expectedBloodVolume;
    }

    public long getActualVolume() {
        return actualVolume;
    }

    public void setActualVolume(long actualVolume) {
        this.actualVolume = actualVolume;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @Override
    public String toString() {
        return "BloodDonationEvent{" +
                "eventId=" + eventId +
                ", nameOfEvent='" + nameOfEvent + '\'' +
                ", creationDate=" + creationDate +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", expectedBloodVolume=" + expectedBloodVolume +
                ", actualVolume=" + actualVolume +
                ", location='" + location + '\'' +
                ", status='" + status + '\'' +
                ", account=" + account +
                '}';
    }
}
