package com.swp391.bloodcare.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Arrays;
import java.util.Date;

@Entity
@Table(name = "blood_bag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"afterDonationBlood"})
public class BloodBag {

    @Id
    @Column(name = "bag_id")
    @NotBlank(message = "ID túi máu không được để trống")
    private String bagId;

    @Enumerated(EnumType.STRING)
    @Column(name = "volume", nullable = false)
    @NotNull(message = "Thể tích không được để trống")
    private Volume volume;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "collected_date", nullable = false)
    @NotNull(message = "Ngày lấy máu không được để trống")
    private Date collectedDate;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "expiration_date", nullable = false)
    @NotNull(message = "Ngày hết hạn không được để trống")
    private Date expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Trạng thái túi máu không được để trống")
    private Status status;

    @NotNull(message = "Loại túi máu không được để trống")
    @OneToOne(mappedBy = "bloodBag", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Component component;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "after_donation_id")
    @NotNull(message = "Túi máu phải gắn với một đơn sau hiến")
    private AfterDonationBlood afterDonationBlood;

    public enum Status {
        VALID,      // CÒN HẠN
        EXPIRED,     // HẾT HẠN
        USED        //Đã sử dụng
    }

    @Getter
    public enum Volume {
        ML_250(250),
        ML_350(350),
        ML_450(450);

        private final int ml;

        Volume(int ml) {
            this.ml = ml;
        }

        public static Volume fromInt(int ml) {
            return Arrays.stream(values())
                    .filter(v -> v.ml == ml)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Thể tích không hợp lệ. Chỉ chấp nhận: 250ml, 350ml, 450ml."));
        }

        public static boolean isValid(int ml) {
            return Arrays.stream(values()).anyMatch(v -> v.ml == ml);
        }
    }
}
