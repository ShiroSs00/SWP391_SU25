package com.swp391.bloodcare.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@Table(name = "blood_bag")
public class BloodBag {
    @Id
    @Column(name = "bag_id")
    private String bagId;
    @
    private AfterDonationBlood afterDonationBlood;
    private int volume;
    private Account donorId;
    private Date collectedDate;
    private Date expirationDate;
    private boolean isUsed;
}
