/* File: Account.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Profile entity used for user authentication and profile manage
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */
package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "profile")


public class Profile {
    @Id
    @Column(name = "profile_id")
    @NotBlank(message = "ID hồ sơ không được để trống")
    private String profileId;

    @OneToOne
    @JoinColumn(name = "account_id")
    @NotNull(message = "Tài khoản không được null")
    private Account account;


    @Column(name ="name")
    @Pattern(
            regexp = "^(\\p{Lu}\\p{Ll}+)(\\s\\p{Lu}\\p{Ll}+)*$",
            message = "Mỗi từ phải bắt đầu hoa, chỉ chứa chữ (Unicode), không số/ký tự đặc biệt, không khoảng trắng thừa"
    )

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 50, message = "Tên không được vượt quá 50 ký tự")
    private String name;

    @Column(name ="phone")
    @Pattern(regexp = "^\\d{9,11}$", message = "Số điện thoại phải từ 9 đến 11 chữ số")
    private String phone;

    @Column(name ="date_of_birth")
    @Past(message = "Ngày sinh phải ở quá khứ")
    @NotNull(message = "Ngày sinh không được để trống")
    private Date dob; //xem lại

    @Column(name ="gender")
    private boolean gender;

    @Column(name ="address")
    @Embedded
    @NotNull(message = "Địa chỉ không được để trống")
    private Address address;

    @Column(name ="number_of_blood_donation")
    @Min(value = 0, message = "Số lần hiến máu không được âm")
    private long numberOfBloodDonation;

    @JoinColumn(name ="blood_code")
    @ManyToOne
    @NotNull(message = "Nhóm máu không được để trống")
    private Blood bloodCode;

    @ManyToOne
    @JoinColumn(name = "achievement_name")
    private Achievement achievement;

    @Column(name ="rest_date")
    private LocalDate restDate;

    @Column(name = "cancel_count")
    @Min(value = 0, message = "Số lần hủy không được âm")
    private Integer cancelCount;

    @Column(name = "can_request_blood")
    private Boolean canRequestBlood = true;


    public Profile() {
    }


    public Profile(String profileId, Account accountId, String name, String phone, Date dob, boolean gender, Address address, int numberOfBloodDonation, Blood bloodCode, Achievement achievement, LocalDate restDate, int cancelCount, boolean canRequestBlood) {
        this.profileId = profileId;
        this.name = name;
        this.phone = phone;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        this.numberOfBloodDonation = numberOfBloodDonation;
        this.bloodCode = bloodCode;
        this.achievement = achievement;
        this.restDate = restDate;
        this.cancelCount = cancelCount;
        this.canRequestBlood = canRequestBlood;
    }

    public String getProfileId() {
        return profileId;
    }

    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
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

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public long getNumberOfBloodDonation() {
        return numberOfBloodDonation;
    }

    public void setNumberOfBloodDonation(long numberOfBloodDonation) {
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

    public int getCancelCount() {
        return cancelCount;
    }

    public void setCancelCount(int cancelCount) {
        this.cancelCount = cancelCount;
    }

    public boolean isCanRequestBlood() {
        return canRequestBlood;
    }

    public void setCanRequestBlood(boolean canRequestBlood) {
        this.canRequestBlood = canRequestBlood;
    }

    @Override
    public String toString() {
        return "Profile{" +
                "profileId=" + profileId +
                ", account=" + account +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", dob=" + dob +
                ", gender=" + gender +
                ", address=" + address +
                ", numberOfBloodDonation=" + numberOfBloodDonation +
                ", bloodCode=" + bloodCode +
                ", achievement=" + achievement +
                ", restDate=" + restDate +
                '}';
    }
}
