package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "blood_request")
public class BloodRequest {
    @Id
    @Column(name = "id_blood_request")
    private int idBloodRequest;


    @ManyToOne()
    @JoinColumn(name ="name")
    private Account account;

    @ManyToOne()
    @JoinColumn(name = "hospital_id")
    private Hospital hospitalId;

    @Column(name ="request_date")
    private LocalDate requestDate;

    @ManyToOne()
    @JoinColumn(name ="blood_code")
    private Blood bloodCode;

    @Column(name ="urgency")
    private boolean urgency;

    @Column(name ="status")
    private String status;

    @Column(name ="volumn")
    private int volumn;

    @Column(name ="quantity")
    private int quatity;

    @Column(name ="request_Creation_date")
    private LocalDate requestCreationDate;



    public BloodRequest() {
    }

    public BloodRequest(int idBloodRequest, Account account, Hospital hospitalId, LocalDate requestDate, Blood bloodCode, boolean urgency, String status, int volumn, int quatity) {
        this.idBloodRequest = idBloodRequest;
        this.account = account;
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

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
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
                ", accountId=" + account.getUserName() +
                ", hospitalId=" + hospitalId.getHospitalName() +
                ", requestDate=" + requestDate +
                ", bloodCode=" + bloodCode +
                ", urgency=" + urgency +
                ", status='" + status + '\'' +
                ", volumn=" + volumn +
                ", quatity=" + quatity +
                '}';
    }
}
