package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "blood_request")
public class BloodRequest {
    @Id
    @Column()
    private int idBloodRequest;

    @Column(name ="name")
    private Profile accountId;

    @Column(name ="hospital")
    private Hospital hospitalId;

    @Column(name ="request_date")
    private LocalDate requestDate;

    @Column(name ="blood_code")
    private Blood bloodCode;

    @Column(name ="urgency")
    private boolean urgency;

    @Column(name ="status")
    private String status;

    @Column(name ="volumn")
    private int volumn;

    @Column(name ="quantity")
    private int quatity;

    @Column(name ="")
    private LocalDate requestCreationDate;

    public BloodRequest() {
    }

    public BloodRequest(int idBloodRequest, Profile accountId, Hospital hospitalId, LocalDate requestDate, Blood bloodCode, boolean urgency, String status, int volumn, int quatity) {
        this.idBloodRequest = idBloodRequest;
        this.accountId = accountId;
        this.hospitalId = hospitalId;
        this.requestDate = requestDate;
        this.bloodCode = bloodCode;
        this.urgency = urgency;
        this.status = status;
        this.volumn = volumn;
        this.quatity = quatity;
    }

    public int getIdBloodRequest() {
        return idBloodRequest;
    }

    public void setIdBloodRequest(int idBloodRequest) {
        this.idBloodRequest = idBloodRequest;
    }

    public Profile getAccountId() {
        return accountId;
    }

    public void setAccountId(Profile accountId) {
        this.accountId = accountId;
    }

    public Hospital getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Hospital hospitalId) {
        this.hospitalId = hospitalId;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public Blood getBloodCode() {
        return bloodCode;
    }

    public void setBloodCode(Blood bloodCode) {
        this.bloodCode = bloodCode;
    }

    public boolean isUrgency() {
        return urgency;
    }

    public void setUrgency(boolean urgency) {
        this.urgency = urgency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getVolumn() {
        return volumn;
    }

    public void setVolumn(int volumn) {
        this.volumn = volumn;
    }

    public int getQuatity() {
        return quatity;
    }

    public void setQuatity(int quatity) {
        this.quatity = quatity;
    }

    @Override
    public String toString() {
        return "BloodRequest{" +
                "idBloodRequest=" + idBloodRequest +
                ", accountId=" + accountId.getName() +
                ", hospitalId=" + hospitalId.getNameHospital() +
                ", requestDate=" + requestDate +
                ", bloodCode=" + bloodCode +
                ", urgency=" + urgency +
                ", status='" + status + '\'' +
                ", volumn=" + volumn +
                ", quatity=" + quatity +
                '}';
    }
}
