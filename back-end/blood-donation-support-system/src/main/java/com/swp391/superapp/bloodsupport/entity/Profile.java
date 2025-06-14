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

    public Profile(int profileId, Account accountId, String name, String phone, Date dob, boolean gender, String address, int numberOfBloodDonation, Blood bloodCode, Achievement achievement, LocalDate restDate) {
        this.profileId = profileId;
        this.accountId = accountId;
        this.name = name;
        this.phone = phone;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.numberOfBloodDonation = numberOfBloodDonation;
        this.bloodCode = bloodCode;
        this.achievement = achievement;
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
