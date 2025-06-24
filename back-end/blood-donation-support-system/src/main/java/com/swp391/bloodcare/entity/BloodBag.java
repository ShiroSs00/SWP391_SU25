package com.swp391.bloodcare.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodBag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bagId;

    @Column(nullable = false)
    private int iADB;

    private int volume;

    @Column(columnDefinition = "BINARY(16)")
    private UUID donorId;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date collectedDate;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date expirationDate;

    private boolean isUsed;

    @OneToOne(mappedBy = "bloodBag", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AfterDonationBlood afterDonationBlood;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "match_request_id")
//    private BloodMatchRequest bloodMatchRequest;
}
