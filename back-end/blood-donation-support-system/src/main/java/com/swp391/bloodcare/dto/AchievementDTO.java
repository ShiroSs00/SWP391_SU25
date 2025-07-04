package com.swp391.bloodcare.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementDTO {

    @NotBlank(message = "Tên thành tựu không được để trống")
    private String achievementName;

    @Size(max = 255, message = "Mô tả không được dài quá 255 ký tự")
    private String description;

    @NotNull(message = "Giá trị tối thiểu không được để trống")
    @Min(value = 0, message = "Giá trị tối thiểu phải >= 0")
    private Long minValue;

    @NotNull(message = "Giá trị tối đa không được để trống")
    @Min(value = 0, message = "Giá trị tối đa phải >= 0")
    private Long maxValue;
}
