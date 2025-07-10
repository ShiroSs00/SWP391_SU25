package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "after_donation_blood")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"healthCheck", "blood"})
public class AfterDonationBlood {

    public enum Status {
        PENDING,    // Đang chờ xét nghiệm
        PASSED,     // Máu đạt yêu cầu
        FAILED,     // Không đạt (do chất lượng)
        REJECTED    // Loại bỏ (do có bệnh truyền nhiễm)
    }

    @Id
    @Column(name = "after_donation_id")
    @NotBlank(message = "Mã sau hiến không được để trống")
    private String idAfterDonation;

    @Column(name = "infectious_diseases_checked")
    @NotNull(message = "Trạng thái kiểm tra bệnh truyền nhiễm không được để trống")
    private Boolean infectiousDiseasesChecked;

    @Column(name = "is_blood_usable")
    @NotNull(message = "Trạng thái sử dụng máu không được để trống")
    private Boolean isBloodUsable;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Trạng thái máu không được để trống")
    private Status status;

    @Column(name = "note")
    @Size(max = 500, message = "Ghi chú không được vượt quá 500 ký tự")
    private String note;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_check_id")
    private HealthCheck healthCheck;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_code")
    private Blood blood;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "bag_id")
    private List<BloodBag> bloodBag;
}
