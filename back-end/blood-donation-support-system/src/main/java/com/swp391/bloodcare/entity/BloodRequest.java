package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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


    public enum statusBloodRequest{
        PENDING, APPROVE, REJECT
    }

}
