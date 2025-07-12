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

    private String accountId;

    @NotNull(message = "Ngày nhận không được bỏ trống")
    @Future(message = "Ngày nhận phải là tương lai")
    private LocalDate requestDate;

    @NotBlank(message = "Mã máu không được bỏ trống")
    private String bloodCode;

    @NotBlank(message = "ID thành phần máu không được để trống")
    private String componentId;

    @NotNull(message = "Số lượng máu không được để trống")
    @Min(value = 1, message = "Số lượng máu phải lớn hơn 0ml")
    @Max(value = 500, message = "Số lượng máu không được vượt quá 500ml")
    private Integer volume;

    private boolean emergency;
}
