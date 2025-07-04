package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "after_donation_blood")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"healthCheck", "blood"})
public class AfterDonationBlood {

    @Id
    @Column(name = "after_donation_id")
    @NotBlank(message = "ID không được để trống")
    private String idAfterDonation;

    @Column(name = "infectious_diseases_checked")
    @NotNull(message = "Trường kiểm tra bệnh truyền nhiễm không được null")
    private Boolean infectiousDiseasesChecked;

    @Column(name = "is_blood_usable")
    @NotNull(message = "Trường máu sử dụng được không được null")
    private Boolean isBloodUsable;

    @Column(name = "status")
    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    @Column(name = "note")
    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String note;

    @OneToOne
    @JoinColumn(name = "health_check_id")
    private HealthCheck healthCheck;

    @ManyToOne
    @JoinColumn(name = "blood_code")
    private Blood blood;

    @OneToOne
    @JoinColumn(name = "bag_id")
    private BloodBag bloodBag;
}

