package com.swp391.bloodcare.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "blood_bag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"afterDonationBlood" /*, "bloodMatchRequest"*/})

public class BloodBag {

    @Id
    @Column(name = "bag_id")
    private String bagId;

    @Column(name = "volume")
    private int volume;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "collected_date")
    private Date collectedDate;

    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "expiration_Date")
    private Date expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private statusBloodBag status;

    @OneToOne(mappedBy = "bloodBag", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "after_donation_id")
    private AfterDonationBlood afterDonationBlood;

    // Nếu sau này bạn muốn dùng cho việc matching máu:
    /*
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_request_id")
    private BloodMatchRequest bloodMatchRequest;
    */


    public enum statusBloodBag{
        AVAILABLE, USED, EXPIRED, DISCARDED
    }
}
