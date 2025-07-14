package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
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
    private String idBloodRequest;


    @ManyToOne()
    @JoinColumn(name ="name")
    private Account account;


    @Column(name ="request_date") //ngày mong muốn
    private LocalDate requestDate;

    @ManyToOne()
    @JoinColumn(name ="blood_code")
    private Blood bloodCode;

    @ManyToOne()
    @JoinColumn(name = "component_id")
    private Component component;

    @Column(name ="is_emergency")
    private boolean isEmergency;

    @Column(name ="status")
    private statusBloodRequest status;

    @Column(name ="volume")
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
    private String rejectionReason;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "location")
    private String location; // Location of the requester


    public enum statusBloodRequest{
        PENDING, APPROVE, REJECT, CANCELLED
    }

}
