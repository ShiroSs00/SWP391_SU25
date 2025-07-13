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
public class BloodBag {

    @Id
    @Column(name = "bag_id")
    @NotBlank(message = "ID túi máu không được để trống")
    private String bagId;

    @Enumerated(EnumType.STRING)
    @Column(name = "volume", nullable = false, length = 20)
    @NotNull(message = "Thể tích không được để trống")
    private Volume volume;


    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "collected_date", nullable = false)
    @NotNull(message = "Ngày lấy máu không được để trống")
    @PastOrPresent(message = "Ngày tách phải nhỏ hơn hoặc bằng ngày hiện tại")
    private Date collectedDate;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Phải lấy ít nhất là 1")
    @Column(name = "quantity")
    private int quantity;

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
    @ManyToOne( fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id")
    private Component component;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_code")
    private Blood blood;




    public enum Status {
        VALID,      // CÒN HẠN
        EXPIRED,     // HẾT HẠN
        USED,
        ALLOCATED
    }

    @Getter
    public enum Volume {
        ML_60(60),     // Tiểu cầu từ máu toàn phần
        ML_125(125),   // Hồng cầu từ 250ml máu
        ML_200(200),   // Hồng cầu từ 350ml
        ML_250(250),   // Máu toàn phần chuẩn, hoặc huyết tương
        ML_300(300),   // Huyết tương lớn
        ML_350(350),   // Máu toàn phần lớn
        ML_450(450);   // Máu toàn phần rất lớn

        private final int ml;

        Volume(int ml) {
            this.ml = ml;
        }

        public static Volume fromInt(int ml) {
            return Arrays.stream(values())
                    .filter(v -> v.ml == ml)
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Thể tích không hợp lệ. Chỉ chấp nhận: " + Arrays.toString(Arrays.stream(values()).mapToInt(v -> v.ml).toArray())));
        }


        public static boolean isValid(int ml) {
            return Arrays.stream(values()).anyMatch(v -> v.ml == ml);
        }
    }
}
