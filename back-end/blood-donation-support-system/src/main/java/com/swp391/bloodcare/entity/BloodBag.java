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
    @NotBlank
    private String bagId;

    @Enumerated(EnumType.STRING)
    @Column(name = "volume", nullable = false)
    @NotNull
    private Volume volume;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "collected_date", nullable = false)
    @NotNull
    private Date collectedDate;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "expiration_date", nullable = false)
    @NotNull
    private Date expirationDate;

    @Column(nullable = false)
    @NotBlank
    private String status;

    @OneToOne(mappedBy = "bloodBag", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    @NotNull
    private AfterDonationBlood afterDonationBlood;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wait_list_id")
    private WaitingList waitingList;

    // ===================== ENUM =====================
    public enum Volume {
        ML_250(250),
        ML_350(350),
        ML_450(450);

        private final int ml;

        Volume(int ml) {
            this.ml = ml;
        }

        public int getMl() {
            return ml;
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
