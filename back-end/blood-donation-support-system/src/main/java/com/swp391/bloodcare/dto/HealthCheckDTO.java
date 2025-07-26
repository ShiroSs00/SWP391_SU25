package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.HealthCheck;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Arrays;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class HealthCheckDTO {

    private String healthCheckId;

    @NotNull(message = "Cân nặng không được để trống")
    @Positive(message = "Cân nặng phải lớn hơn 0")
    private Double weight;

    @NotNull(message = "Nhiệt độ không được để trống")
    @DecimalMin(value = "35.0", message = "Nhiệt độ không được thấp hơn 35°C")
    @DecimalMax(value = "42.0", message = "Nhiệt độ không được cao hơn 42°C")
    private Double temperature;

    @NotNull(message = "Huyết áp không được để trống")
    @Positive(message = "Huyết áp phải lớn hơn 0")
    private Double bloodPressure;

    @NotNull(message = "Mạch không được để trống")
    @Min(value = 30, message = "Mạch quá thấp, không hợp lệ")
    @Max(value = 200, message = "Mạch quá cao, không hợp lệ")
    private Long pulse;

    @NotNull(message = "Hemoglobin không được để trống")
    @DecimalMin(value = "7.0", message = "Hemoglobin quá thấp, không hợp lệ")
    private Double hemoglobin;

    private Integer volumeToTake;

    @NotNull(message = "Chưa xác định được tình trạng đủ điều kiện hiến máu")
    private Boolean isFitToDonate;

    private String note;

    public static HealthCheck toEntity(HealthCheckDTO dto) {
        return HealthCheck.builder()
                .healthCheckId(dto.getHealthCheckId())
                .weight(dto.getWeight())
                .temperature(dto.getTemperature())
                .bloodPressure(dto.getBloodPressure())
                .pulse(dto.getPulse())
                .hemoglobin(dto.getHemoglobin())
                .isFitToDonate(dto.getIsFitToDonate())
                .note(dto.getNote())
                .build();
    }





    public static HealthCheckDTO toDTO(HealthCheck entity) {
        return HealthCheckDTO.builder()
                .healthCheckId(entity.getHealthCheckId())
                .weight(entity.getWeight())
                .temperature(entity.getTemperature())
                .bloodPressure(entity.getBloodPressure())
                .pulse(entity.getPulse())
                .hemoglobin(entity.getHemoglobin())
                .isFitToDonate(entity.getIsFitToDonate())
                .note(entity.getNote())
                .volumeToTake(entity.getDonationRegistration() != null &&
                        entity.getDonationRegistration().getVolumeToTake() != null
                        ? entity.getDonationRegistration().getVolumeToTake().getMl()
                        : null)
                .build();
    }

}
