package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.BloodBag;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodBagDTO {

    private Long bagId;
    private int iADB;
    private int volume;
    private UUID donorId;
    private Date collectedDate;
    private Date expirationDate;
    private boolean isUsed;

    private Long afterDonationBloodId;
    private Long matchRequestId;

    public static BloodBagDTO fromEntity(BloodBag bag) {
        return BloodBagDTO.builder()
                .bagId(bag.getBagId())
                .iADB(bag.getIADB())
                .volume(bag.getVolume())
                .donorId(bag.getDonorId())
                .collectedDate(bag.getCollectedDate())
                .expirationDate(bag.getExpirationDate())
                .isUsed(bag.isUsed())
                .afterDonationBloodId(bag.getAfterDonationBlood() != null ? bag.getAfterDonationBlood().getIdAfterDonation() : null)
                .matchRequestId(bag.getBloodMatchRequest() != null ? bag.getBloodMatchRequest().getRequestId() : null)
                .build();
    }
}
