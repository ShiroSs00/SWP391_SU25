package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "blood_donation_event")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"donationRegistrations"})
public class BloodDonationEvent {

    @Id
    @Column(name = "event_id")
    @NotBlank(message = "Event ID không được để trống")
    private String eventId;

    @Column(name = "name_of_event")
    @NotBlank
    @Size(max = 255)
    private String nameOfEvent;

    @Column(name = "creation_date")
    @NotNull
    private Date creationDate;

    @Column(name = "start_date")
    @NotNull
    private Date startDate;

    @Column(name = "end_date")
    @NotNull
    private Date endDate;

    @Column(name = "expected_blood_volume")
    @Min(value = 0, message = "Số lượng máu kỳ vọng phải >= 0")
    private long expectedBloodVolume;

    @Column(name = "actual_volume")
    @Min(value = 0, message = "Số lượng máu thực tế phải >= 0")
    private long actualVolume;

    @Column(name = "location")
    @NotBlank(message = "Địa điểm không được để trống")
    @Size(max = 255, message = "Địa điểm không được quá 255 ký tự")
    private String location;

    @Column(name = "status")
    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id_create")
    @NotNull(message = "Người tạo sự kiện không được để trống")
    private Account account;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationRegistration> donationRegistrations = new ArrayList<>();
}