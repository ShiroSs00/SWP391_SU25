/* File: Account.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Profile entity used for user authentication and profile manage
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */
package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "profile")
public class Profile {
    @Id
    @Column(name = "account_id")
    private String accountId;

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

    @Column(name ="role")
    private Role role;

    @Column(name ="number_of_blood_donation")
    private int numberOfBloodDonation;

    @Column(name ="blood_code")
    private Blood bloodCode;

    @Column(name ="rest_date")
    private LocalDate restDate;

    public Profile() {
    }

    public Profile(String accountId, String name, String phone, Date dob, boolean gender, String address, Role role, int numberOfBloodDonation, Blood bloodCode, LocalDate restDate) {
        this.accountId = accountId;
        this.name = name;
        this.phone = phone;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.role = role;
        this.numberOfBloodDonation = numberOfBloodDonation;
        this.bloodCode = bloodCode;
        this.restDate = restDate;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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

    public LocalDate getRestDate() {
        return restDate;
    }

    public void setRestDate(LocalDate restDate) {
        this.restDate = restDate;
    }

    @Override
    public String toString() {
        return "Profile{" +
                "accountId='" + accountId + '\'' +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", dob=" + dob +
                ", gender=" + gender +
                ", address='" + address + '\'' +
                ", role=" + role +
                ", numberOfBloodDonation=" + numberOfBloodDonation +
                ", bloodCode=" + bloodCode +
                ", restDate=" + restDate +
                '}';
    }
}
