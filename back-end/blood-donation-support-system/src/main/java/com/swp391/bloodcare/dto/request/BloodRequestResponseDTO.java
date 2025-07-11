package com.swp391.bloodcare.dto.request;

import com.swp391.bloodcare.entity.BloodRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestResponseDTO {
    private String idBloodRequest;
    private String requesterName; // Tên người đăng ký từ profile
    private String requesterPhone;
    private String requesterEmail;
    private String requesterAddress;
    private String bloodType;
    private String component;
    private Integer volume;
    private boolean emergency;
    private BloodRequest.statusBloodRequest status;
    private LocalDate requestDate;
    private LocalDate requestCreationDate;

    private String processedBy;
    private LocalDate processedDate;
    private String rejectionReason;
    private String bloodBagId;
    private String contactPhone;
    private String contactEmail;

}
