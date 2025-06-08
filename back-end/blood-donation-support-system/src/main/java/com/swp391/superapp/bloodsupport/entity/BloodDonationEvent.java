package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class BloodDonationEvent {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private int eventId;
    @Column(name = "nameOfEvent", nullable = false)
    private String nameOfEvent;
    @Column(name = "creationDate",nullable = false)
    private Date creationDate;
    @Column(name = "startDate",nullable = false)
    private Date startDate;
    @Column(name = "endDate",nullable = false)
    private Date endDate;
    @Column(name = "expectedBloodVolume", nullable = false)
    private int expectedBloodVolume;
    @Column(name ="actualVolume")
    private int actualVolume;
    @Column (name = "location",nullable = false)
    private String location;
    @Column(name = "status")
    private String status;

    @OneToMany
    private List<BloodDonationHistory> bloodDonationHistoryList = new ArrayList<>();

    public BloodDonationEvent() {
    }


    public BloodDonationEvent(String nameOfEvent, Date creationDate, Date startDate, Date endDate, int expectedBloodVolume, int actualVolume, String location, String status) {
        this.nameOfEvent = nameOfEvent;
        this.creationDate = creationDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.expectedBloodVolume = expectedBloodVolume;
        this.actualVolume = actualVolume;
        this.location = location;
        this.status = status;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
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

    public int getExpectedBloodVolume() {
        return expectedBloodVolume;
    }

    public void setExpectedBloodVolume(int expectedBloodVolume) {
        this.expectedBloodVolume = expectedBloodVolume;
    }

    public int getActualVolume() {
        return actualVolume;
    }

    public void setActualVolume(int actualVolume) {
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
                "eventId='" + eventId + '\'' +
                ", nameOfEvent='" + nameOfEvent + '\'' +
                ", creationDate=" + creationDate +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", expectedBloodVolume=" + expectedBloodVolume +
                ", actualVolume=" + actualVolume +
                ", location='" + location + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}