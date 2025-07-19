package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Arrays;

@Entity
@Table(name = "health_check")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"donationRegistration", "afterDonationBlood"})
public class HealthCheck {


    @Id
    @Column(name = "health_check_id")
    private String healthCheckId;

    @Column(name = "weight", nullable = false)
    @NotNull(message = "Cân nặng không được để trống")
    @Positive(message = "Cân nặng phải lớn hơn 0")
    private Double weight;

    @Column(name = "temperature", nullable = false)
    @NotNull(message = "Nhiệt độ không được để trống")
    @DecimalMin(value = "35.0", message = "Nhiệt độ không được thấp hơn 35°C")
    @DecimalMax(value = "42.0", message = "Nhiệt độ không được cao hơn 42°C")
    private Double temperature;

    @Column(name = "blood_pressure", nullable = false)
    @NotNull(message = "Huyết áp không được để trống")
    @Positive(message = "Huyết áp phải lớn hơn 0")
    private Double bloodPressure;

    @Column(name = "pulse", nullable = false)
    @NotNull(message = "Mạch không được để trống")
    @Min(value = 30, message = "Mạch quá thấp")
    @Max(value = 200, message = "Mạch quá cao")
    private Long pulse;

    @Column(name = "hemoglobin", nullable = false)
    @NotNull(message = "Hemoglobin không được để trống")
    @DecimalMin(value = "7.0", message = "Hemoglobin quá thấp")
    private Double hemoglobin;

    @Column(name = "volume_to_take")
    @NotNull(message = "Volume không được để trống")
    private Volume volumeToTake;

    @Column(name = "is_fit_to_donate", nullable = false)
    @NotNull(message = "Chưa xác định được tình trạng đủ điều kiện hiến máu")
    private Boolean isFitToDonate;

    @Column(name = "note")
    private String note;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id")
    @NotNull(message = "Phải liên kết với một đơn đăng ký")
    private DonationRegistration donationRegistration;

    @OneToOne(mappedBy = "healthCheck", cascade = CascadeType.ALL, orphanRemoval = true)
    private AfterDonationBlood afterDonationBlood;

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

        public static HealthCheck.Volume fromInt(int ml) {
            return Arrays.stream(values())
                    .filter(v -> v.ml == ml)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Thể tích không hợp lệ. Chỉ chấp nhận: 0, 250, 350, 450"));
        }


    }
}