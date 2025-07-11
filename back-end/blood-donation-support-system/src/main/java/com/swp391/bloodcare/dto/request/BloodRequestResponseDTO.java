package com.swp391.bloodcare.dto.request;

import com.swp391.bloodcare.entity.BloodRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestResponseDTO {
    private String idBloodRequest;
    private String requesterName; // Tên người đăng ký từ profile
    private String bloodType;
    private String component;
    private boolean emergency;
    private BloodRequest.statusBloodRequest status;
    private Integer volume;
    private LocalDate requestDate;
    private LocalDate requestCreationDate;

}
