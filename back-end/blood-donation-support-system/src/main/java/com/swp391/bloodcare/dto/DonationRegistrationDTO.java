package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.DonationRegistration;

import java.util.Date;

public class DonationRegistrationDTO {
    private String registrationId;
    private String eventId;
    private String accountId;
    private Date dateCreated;
    private String status;

    public DonationRegistrationDTO() {
    }

    public DonationRegistrationDTO(String registrationId, String status, Date dateCreated, String accountId, String eventId) {
        this.registrationId = registrationId;
        this.status = status;
        this.dateCreated = dateCreated;
        this.accountId = accountId;
        this.eventId = eventId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(String registrationId) {
        this.registrationId = registrationId;
    }

    @Override
    public String toString() {
        return "DonationRegistrationDTO{" +
                "registrationId='" + registrationId + '\'' +
                ", eventId='" + eventId + '\'' +
                ", accountId='" + accountId + '\'' +
                ", dateCreated=" + dateCreated +
                '}';
    }
    public static DonationRegistrationDTO toDTO(DonationRegistration reg) {
        DonationRegistrationDTO dto = new DonationRegistrationDTO();
        dto.setRegistrationId(reg.getRegistrationId());
        dto.setEventId(reg.getEvent().getEventId());
        dto.setAccountId(reg.getAccount().getAccountId());
        dto.setDateCreated(reg.getDateCreated());
        dto.setStatus(reg.getStatus());
        return dto;
    }
}

