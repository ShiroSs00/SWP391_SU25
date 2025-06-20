package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name = "account")
public class Account{
    @Id
    @Column(name = "id" )
    private String accountId;

    @Column(name = "username", unique = true, nullable = false)
    private String userName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name ="password")
    private String password;

    @Column(name ="is_active")
    private Boolean isActive;

    @Column(name ="creation_date")
    private LocalDate creationDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_name")
    private Role role;

    @ManyToOne
    @JoinColumn(name ="hospital_id")
    private Hospital hospital;

    @OneToMany(mappedBy ="account")
    private List<BloodRequest> bloodRequests;

    @OneToMany(mappedBy ="account")
    private List<Blog> blogs;

    @OneToMany(mappedBy ="account")
    private List<DonationRegistration> donationRegistrations;

    @OneToOne
    private BloodDonationHistory bloodDonationHistory;

    @OneToMany(mappedBy ="account")
    private List<Notification> notifications;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    private Profile profile;

    public Profile getProfile() {
        return profile;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public List<BloodRequest> getBloodRequests() {
        return bloodRequests;
    }

    public void setBloodRequests(List<BloodRequest> bloodRequests) {
        this.bloodRequests = bloodRequests;
    }

    public List<Blog> getBlogs() {
        return blogs;
    }

    public void setBlogs(List<Blog> blogs) {
        this.blogs = blogs;
    }

    public List<DonationRegistration> getDonationRegistrations() {
        return donationRegistrations;
    }

    public void setDonationRegistrations(List<DonationRegistration> donationRegistrations) {
        this.donationRegistrations = donationRegistrations;
    }

    public BloodDonationHistory getBloodDonationHistory() {
        return bloodDonationHistory;
    }

    public void setBloodDonationHistory(BloodDonationHistory bloodDonationHistory) {
        this.bloodDonationHistory = bloodDonationHistory;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

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

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
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
