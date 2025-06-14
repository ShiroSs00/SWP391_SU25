package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
@Table(name = "account")
public class Account{
    @Id
    @Column(name = "account_id" )
    private String accountId;

    @Column(name = "username")
    private String userName;

    @Column(name = "email")
    private String email;

    @Column(name ="password")
    private String password;

    @Column(name ="is_active")
    private boolean isActive;

    @Column(name ="createion_date")
    private LocalDate creationDate;

    @OneToOne(mappedBy = "profile_id")
    @JoinColumn(name = "profile_id")
    private Profile profileId;


    @ManyToOne
    @JoinColumn(name = "role_name")
    private Role role;

    @ManyToOne
    @Column(name ="hospital_name")
    private Hospital hospital;



    public Account() {
    }

    public Account(String accountId, String userName, String email, String password, boolean isActive, LocalDate creationDate, Role role, Hospital hospital) {
        this.accountId = accountId;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.isActive = isActive;
        this.creationDate = creationDate;
        this.role = role;
        this.hospital = hospital;
    }

    public String getaccountId() {
        return accountId;
    }

    public void setaccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    @Override
    public String toString() {
        return "Account{" +
                "accountId='" + accountId + '\'' +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", isActive=" + isActive +
                ", creationDate=" + creationDate +
                ", role=" + role.getRole() +
                ", hospital=" + hospital.getHospitalName() +
                '}';
    }
}
