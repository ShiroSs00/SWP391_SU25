package com.swp391.bloodcare.dto.request;

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
    private String accountName; // Tên tài khoản
    private String hospitalName;
    private String patientName;
    private LocalDate requestDate;
    private String bloodType;
    private boolean isEmergency;
    private String status;
    private int volume;
    private LocalDate requestCreationDate;

}
