package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hospital")
public class Hospital {
    @Id
    @Column(name ="hospital_id")
    private String hospitalId;

    @Column(name ="hospital_name")
    private String hospitalName;

    @Column(name ="address")
    private String address;

    @Column(name ="phone")
    private String phone;

    @Column(name ="email")
    private String email;



    public Hospital() {
    }

    public Hospital(String hospitalId, String hospitalName, String address, String phone, String email) {
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Hospital{" +
                "hospitalId='" + hospitalId + '\'' +
                ", hospitalName='" + hospitalName + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
