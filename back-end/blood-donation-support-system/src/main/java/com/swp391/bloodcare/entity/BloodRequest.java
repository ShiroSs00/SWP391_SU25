package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "blood_request")
public class BloodRequest {
    @Id
    @Column(name = "id_blood_request")
    private String idBloodRequest;


    @ManyToOne()
    @JoinColumn(name ="name")
    private Account account;

    @ManyToOne()
    @JoinColumn(name = "hospital_id")
    private Hospital hospitalId;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name ="request_date") //ngày mong muốn
    private LocalDate requestDate;

    @ManyToOne()
    @JoinColumn(name ="blood_code")
    private Blood bloodCode;

    @Column(name ="is_emergency")
    private boolean isEmergency;

    @Column(name ="status")
    private String status;

    @Column(name ="volume")
    private int volume;

    @Column(name ="request_Creation_date") // ngày tạo đơn
    private LocalDate requestCreationDate;


    public BloodRequest() {
    }

    public BloodRequest(String idBloodRequest, Account account, Hospital hospitalId, String patientName, LocalDate requestDate, Blood bloodCode, boolean isEmergency, String status, int volume, LocalDate requestCreationDate) {
        this.idBloodRequest = idBloodRequest;
        this.account = account;
        this.hospitalId = hospitalId;
        this.patientName = patientName;
        this.requestDate = requestDate;
        this.bloodCode = bloodCode;
        this.isEmergency = isEmergency;
        this.status = status;
        this.volume = volume;
        this.requestCreationDate = requestCreationDate;
    }

    public String getIdBloodRequest() {
        return idBloodRequest;
    }

    public void setIdBloodRequest(String idBloodRequest) {
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

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
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

    public boolean isEmergency() {
        return isEmergency;
    }

    public void setEmergency(boolean emergency) {
        isEmergency = emergency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
    }

    public LocalDate getRequestCreationDate() {
        return requestCreationDate;
    }

    public void setRequestCreationDate(LocalDate requestCreationDate) {
        this.requestCreationDate = requestCreationDate;
    }

    @Override
    public String toString() {
        return "BloodRequest{" +
                "idBloodRequest=" + idBloodRequest +
                ", account=" + account +
                ", hospitalId=" + hospitalId +
                ", patientName='" + patientName + '\'' +
                ", requestDate=" + requestDate +
                ", bloodCode=" + bloodCode +
                ", isEmergency=" + isEmergency +
                ", status='" + status + '\'' +
                ", volumn=" + volume +
                ", requestCreationDate=" + requestCreationDate +
                '}';
    }
}
