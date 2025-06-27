package com.swp391.bloodcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class WaitingListResponseDTO {
    private String waitListId;
    private String bloodRequestId;
    private String patientName;
    private String bloodCode;
    private String bloodBagId;
    private Date matchDate;
    private String status;
    private String note;


}
