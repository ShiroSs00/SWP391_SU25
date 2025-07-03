package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
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
@ToString(exclude = {"bloodDonationHistoryList", "donationRegistrations", "bloodDonationHistories"})
public class BloodDonationEvent {

    @Id
    @Column(name = "event_id")
    private String eventId;

    @Column(name = "name_of_event")
    private String nameOfEvent;

    @Column(name = "creation_date")
    private Date creationDate;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Column(name = "expected_blood_volume")
    private long expectedBloodVolume;

    @Column(name = "actual_volume")
    private long actualVolume;

    @Column(name = "location")
    private String location;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "account_id_create")
    private Account account;



    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "event")
    private List<DonationRegistration> donationRegistrations = new ArrayList<>();


}
