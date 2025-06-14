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

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "profile")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private int profileId;

    @Column(name ="full_name")
    private String fullName;

    @Column(name ="phone")
    private String phone;

    @Column(name ="date_of_birth")
    private Date dob; //xem lại

    @Column(name ="gender")
    private boolean gender;  // true = male, false = female

    @Column(name ="address")
    private String address;

    @Column(name ="number_of_blood_donation")
    private int numberOfBloodDonation;

    @Column(name ="rest_date")
    private LocalDate restDate;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account accountId;

    @ManyToOne
    @JoinColumn(name = "blood_code")
    private Blood blood;

    @ManyToOne
    @JoinColumn(name = "achievement_name")
    private Achievement achievement;

    public Profile() {
    }

    public Profile(String fullName, String phone, Date dob, Boolean gender,
                   String address, Account accountId) {
        this.fullName = fullName;
        this.phone = phone;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.accountId = accountId;
        this.numberOfBloodDonation = 0;
    }

    public int getProfileId() { return profileId; }
    public void setProfileId(int profileId) { this.profileId = profileId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Date getDateOfBirth() { return dob; }
    public void setDateOfBirth(Date dob) { this.dob = dob; }

    public Boolean getGender() { return gender; }
    public void setGender(Boolean gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Integer getNumberOfBloodDonation() { return numberOfBloodDonation; }
    public void setNumberOfBloodDonation(Integer numberOfBloodDonation) { this.numberOfBloodDonation = numberOfBloodDonation; }

    public LocalDate getRestDate() { return restDate; }
    public void setRestDate(LocalDate restDate) { this.restDate = restDate; }

    public Account getAccount() { return accountId; }
    public void setAccount(Account accountId) { this.accountId = accountId; }

    public Blood getBloodType() { return blood; }
    public void setBloodType(Blood bloodType) { this.blood = blood; }

    public Achievement getAchievement() { return achievement; }
    public void setAchievement(Achievement achievement) { this.achievement = achievement; }

    @Override
    public String toString() {
        return "Profile{" +
                "profileId=" + profileId +
                ", fullName='" + fullName + '\'' +
                ", phone='" + phone + '\'' +
                ", dateOfBirth=" + dob +
                ", gender=" + gender +
                ", address='" + address + '\'' +
                ", numberOfBloodDonation=" + numberOfBloodDonation +
                ", restDate=" + restDate +
                '}';
    }
}
