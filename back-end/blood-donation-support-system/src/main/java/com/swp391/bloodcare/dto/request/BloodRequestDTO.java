package com.swp391.bloodcare.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BloodRequestDTO {

    @NotBlank(message = "Tên bệnh nhân không được để trống")
    private String patientName;

    @NotNull(message = "Ngày nhận không được bỏ trống")
    @Future(message = "Ngày này đã qua")
    private LocalDate requestDate;

    @NotBlank(message = "Mã máu không được bỏ trống")
    private String bloodCode;

    @NotNull(message = "ID Bệnh viện không được bỏ trống")
    private String hospitalName;

    @Min(value = 1, message = "Số lượng máu phải lớn hơn 0")
    @Max(value = 500, message = "Số lượng máu không được vượt quá 500ml")
    private int volume;
    private boolean isEmergency = false;
}
