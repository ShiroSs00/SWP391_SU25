/* File: Account.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Profile entity used for user authentication and profile manage
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */
package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "profile")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private int profileId;

    @JoinColumn(name = "account_id")
    @OneToOne
    private Account accountId;

    @Column(name ="name")
    private String name;

    @Column(name ="phone")
    private String phone;

    @Column(name ="date_of_birth")
    private Date dob; //xem lại

    @Column(name ="gender")
    private boolean gender;

    @Column(name ="address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "ward")
    private String ward;

    @Column(name ="number_of_blood_donation")
    private int numberOfBloodDonation;

    @JoinColumn(name ="blood_code")
    @ManyToOne
    private Blood bloodCode;

    @ManyToOne
    @JoinColumn(name = "achievement_name")
    private Achievement achievement;

    @Column(name ="rest_date")
    private LocalDate restDate;

    public Profile() {
    }

    public Profile(int profileId, Account accountId, String name, String phone, Date dob, boolean gender, String address, String city, String district, String ward, int numberOfBloodDonation, Blood bloodCode, Achievement achievement, LocalDate restDate) {
        this.profileId = profileId;
        this.accountId = accountId;
        this.name = name;
        this.phone = phone;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.city = city;
        this.district = district;
        this.ward = ward;
        this.numberOfBloodDonation = numberOfBloodDonation;
        this.bloodCode = bloodCode;
        this.achievement = achievement;
        this.restDate = restDate;
    }

    public int getProfileId() {
        return profileId;
    }

    public void setProfileId(int profileId) {
        this.profileId = profileId;
    }

    public Account getAccountId() {
        return accountId;
    }

    public void setAccountId(Account accountId) {
        this.accountId = accountId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public boolean isGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public int getNumberOfBloodDonation() {
        return numberOfBloodDonation;
    }

    public void setNumberOfBloodDonation(int numberOfBloodDonation) {
        this.numberOfBloodDonation = numberOfBloodDonation;
    }

    public Blood getBloodCode() {
        return bloodCode;
    }

    public void setBloodCode(Blood bloodCode) {
        this.bloodCode = bloodCode;
    }

    public Achievement getAchievement() {
        return achievement;
    }

    public void setAchievement(Achievement achievement) {
        this.achievement = achievement;
    }

    public LocalDate getRestDate() {
        return restDate;
    }

    public void setRestDate(LocalDate restDate) {
        this.restDate = restDate;
    }

    @Override
    public String toString() {
        return "Profile{" +
                "profileId=" + profileId +
                ", accountId=" + accountId +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", dob=" + dob +
                ", gender=" + gender +
                ", address='" + address + '\'' +
                ", numberOfBloodDonation=" + numberOfBloodDonation +
                ", bloodCode=" + bloodCode +
                ", achievement=" + achievement +
                ", restDate=" + restDate +
                '}';
    }
}
