package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.BloodDonationEvent;
import lombok.*;

import java.util.Date;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodDonationEventDTO {
    private String eventId;
    private String nameOfEvent;
    private Date creationDate;
    private Date startDate;
    private Date endDate;
    private Long expectedBloodVolume;
    private String location;
    private String status;
    private String accountId;

    public static BloodDonationEventDTO toDTO(BloodDonationEvent event) {
        return BloodDonationEventDTO.builder()
                .eventId(event.getEventId())
                .nameOfEvent(event.getNameOfEvent())
                .creationDate(event.getCreationDate())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .expectedBloodVolume(event.getExpectedBloodVolume())
                .location(event.getLocation())
                .status(event.getStatus())
                .accountId(event.getAccount() != null ? event.getAccount().getAccountId() : null) // 👈
                .build();
    }
}

