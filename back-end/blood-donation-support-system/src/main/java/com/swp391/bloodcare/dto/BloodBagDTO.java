package com.swp391.bloodcare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodBagDTO {

    private String bagId;
    private int volume;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date collectedDate;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date expirationDate;

    private String status;

    // ID dùng để ánh xạ sang AfterDonationBlood (OneToOne)
    private String afterDonationId;

    // ID dùng để ánh xạ sang WaitingList (ManyToOne)
    private String waitingListId;

    public static BloodBagDTO fromEntity(com.swp391.bloodcare.entity.BloodBag bag) {
        return BloodBagDTO.builder()
                .bagId(bag.getBagId())
                .volume(bag.getVolume())
                .collectedDate(bag.getCollectedDate())
                .expirationDate(bag.getExpirationDate())
                .status(bag.getStatus())
                .afterDonationId(
                        bag.getAfterDonationBlood() != null ? bag.getAfterDonationBlood().getIdAfterDonation() : null
                )
                .waitingListId(
                        bag.getWaitingList() != null ? bag.getWaitingList().getWaitListId() : null
                )
                .build();
    }


    public static com.swp391.bloodcare.entity.BloodBag toEntity(BloodBagDTO dto) {
        return com.swp391.bloodcare.entity.BloodBag.builder()
                .bagId(dto.getBagId())
                .volume(dto.getVolume())
                .collectedDate(dto.getCollectedDate())
                .expirationDate(dto.getExpirationDate())
                .status(dto.getStatus())
                .build();
    }
}
