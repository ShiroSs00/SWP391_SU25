package com.swp391.bloodcare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;

@Entity
@Table(name = "donation_registration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"event", "account", "healthCheck", "donorFeedback", "bloodDonationHistory"})
public class DonationRegistration {

    public enum Status {
        PENDING,    // Đang đợi
        COMPLETED,     // Đã hiến / Đủ điều kiện
        CANCELLED,   // Đã hủy
        CHECKING    // Da den kiem tra
    }

    @Id
    @Column(name = "registration_id")
    @NotBlank(message = "Mã đăng ký không được để trống")
    private String registrationId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_created", nullable = false)
    @NotNull(message = "Ngày tạo không được để trống")
    private Date dateCreated;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Trạng thái không được để trống")
    private Status status;

    @Column(name = "donation_date", nullable = false)
    @NotNull(message = "Ngày hiến máu không được để trống")
    private LocalDate donationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private BloodDonationEvent event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToOne(mappedBy = "donationRegistration", cascade = CascadeType.ALL, orphanRemoval = true)
    private HealthCheck healthCheck;

    @OneToOne(mappedBy = "donationRegistration", cascade = CascadeType.ALL, orphanRemoval = true)
    private DonorFeedback donorFeedback;

    @OneToOne(mappedBy = "donationRegistration", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private BloodDonationHistory bloodDonationHistory;

    @Column(name = "volume_to_take")
    @NotNull(message = "Volume không được để trống")
    private Volume volumeToTake;

    @Getter
    public enum Volume {
        ML_0(0),
        ML_250(250),
        ML_350(350),
        ML_450(450);

        private final int ml;

        Volume(int ml) {
            this.ml = ml;
        }

        public static DonationRegistration.Volume fromInt(int ml) {
            return Arrays.stream(values())
                    .filter(v -> v.ml == ml)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Thể tích không hợp lệ. Chỉ chấp nhận: 0, 250, 350, 450"));
        }


    }
}