package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "blood_request")
public class BloodRequest {

    @Id
    @Column(name = "id_blood_request")
    @NotBlank(message = "ID đơn xin máu không được để trống")
    private String idBloodRequest;


    @ManyToOne()
    @JoinColumn(name ="name")
    @NotNull(message = "Tài khoản không được để trống")
    private Account account;


    @Column(name ="request_date") //ngày mong muốn
    @Future(message = "Ngày yêu cầu phải ở tương lai")
    @NotNull(message = "Ngày yêu cầu không được để trống")
    private LocalDate requestDate;

    @ManyToOne()
    @JoinColumn(name ="blood_code")
    @NotNull(message = "Nhóm máu không được để trống")
    private Blood bloodCode;

    @ManyToOne()
    @JoinColumn(name = "component_id")
    @NotNull(message = "Thành phần máu không được để trống")
    private Component component;

    @Column(name ="is_emergency")
    private boolean isEmergency;

    @Column(name ="status")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Trạng thái không được để trống")
    private statusBloodRequest status;

    @Column(name ="volume")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Thể tích máu không được để trống")
    private BloodBag.Volume volume;

    @Column(name ="request_Creation_date") // ngày tạo đơn
    private LocalDate requestCreationDate;

    @OneToOne
    @JoinColumn(name = "bagId")
    private BloodBag bloodBag;

    @Column(name = "processed_by")
    private String processedBy; // Admin ID who processed the request

    @Column(name = "processed_date")
    private LocalDate processedDate;

    @Column(name = "rejection_reason")
    @Size(max = 255, message = "Lý do từ chối không được vượt quá 255 ký tự")
    private String rejectionReason;

    @Column(name = "contact_phone")
    @Pattern(regexp = "^\\d{9,11}$", message = "Số điện thoại không hợp lệ")
    private String contactPhone;

    @Column(name = "contact_email")
    @Email(message = "Email liên hệ không hợp lệ")
    private String contactEmail;

    @Column(name = "location")
    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String location; // Location of the requester


    public enum statusBloodRequest{
        PENDING, APPROVE, REJECT, CANCELLED
    }

}
