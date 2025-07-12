package com.swp391.bloodcare.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComponentDTO {

    @NotBlank(message = "Mã thành phần không được để trống")
    private String componentId;

    @NotBlank(message = "Loại thành phần không được để trống")
    private String type;

    @Future(message = "Hạn sử dụng phải là một ngày trong tương lai")
    private Integer expirationDays;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    private String description;

    private String bloodBagId;
}
