package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.BloodDonationEvent;

import java.util.Date;

public class BloodDonationEventDTO {
    private String nameOfEvent;
    private Date startDate;
    private Date endDate;
    private Long expectedBloodVolume;
    private Long actualVolume;
    private String location;
    private String status;
    private String eventId;
    private String accountId;
    private Date creationDate;
    public BloodDonationEventDTO() {
    }

    public BloodDonationEventDTO(String nameOfEvent, Date startDate, Date endDate, long expectedBloodVolume, long actualVolume, String location, String status) {
        this.nameOfEvent = nameOfEvent;
        this.startDate = startDate;
        this.endDate = endDate;
        this.expectedBloodVolume = expectedBloodVolume;
        this.actualVolume = actualVolume;
        this.location = location;
        this.status = status;
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

    public Long getActualVolume() {
        return actualVolume;
    }

    public void setActualVolume(Long actualVolume) {
        this.actualVolume = actualVolume;
    }

    public Long getExpectedBloodVolume() {
        return expectedBloodVolume;
    }

    public void setExpectedBloodVolume(Long expectedBloodVolume) {
        this.expectedBloodVolume = expectedBloodVolume;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public String getNameOfEvent() {
        return nameOfEvent;
    }

    public void setNameOfEvent(String nameOfEvent) {
        this.nameOfEvent = nameOfEvent;
    }


    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    @Override
    public String toString() {
        return "BloodDonationEventDTO{" +
                "nameOfEvent='" + nameOfEvent + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", expectedBloodVolume=" + expectedBloodVolume +
                ", actualVolume=" + actualVolume +
                ", location='" + location + '\'' +
                ", status='" + status + '\'' +
                ", eventId='" + eventId + '\'' +
                ", accountId=" + accountId +
                ", creationDate=" + creationDate +
                '}';
    }

    public BloodDonationEventDTO toDTO(BloodDonationEvent event) {
        BloodDonationEventDTO dto = new BloodDonationEventDTO();
        dto.setNameOfEvent(event.getNameOfEvent());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setExpectedBloodVolume(event.getExpectedBloodVolume());
        dto.setActualVolume(event.getActualVolume());
        dto.setLocation(event.getLocation());
        dto.setStatus(event.getStatus());
        dto.setEventId(event.getEventId());
        dto.setAccountId(event.getAccount().getAccountId());
        dto.setCreationDate(event.getCreationDate());
        return dto;
    }
    
}




