package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString(exclude = {"bloodDonationHistory", "donationRegistrations", "profile"})
@Table(name = "blood_donation_history")
public class BloodDonationHistory {

    @Id
    @Column(name = "history_id")
    @NotBlank(message = "Mã lịch sử không được để trống")
    private String historyId;

    @OneToOne
    @JoinColumn(name = "id")
    @NotNull(message = "Tài khoản không được để trống")
    private Account account;

    @OneToOne
    @JoinColumn(name = "registration_id")
    @NotNull(message = "Đơn đăng ký hiến máu không được để trống")
    private DonationRegistration donationRegistration;

    @Column(name = "status")
    @NotBlank(message = "Trạng thái lịch sử không được để trống")
    private String status;

}
