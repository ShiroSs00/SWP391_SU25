package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
import jakarta.validation.constraints.*;
import lombok.*;

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

    @NotNull(message = "Lượng máu cần lấy không được để trống")
    @Min(value = 100, message = "Phải lấy ít nhất 100ml")
    private Long volumeToTake;

    @NotNull(message = "Chưa xác định được tình trạng đủ điều kiện hiến máu")
    private Boolean isFitToDonate;

    private String note;

    private String donationRegistrationId;

    // Convert Entity → DTO
    public static HealthCheckDTO toDTO(HealthCheck entity) {
        return HealthCheckDTO.builder()
                .healthCheckId(entity.getHealthCheckId())
                .weight(entity.getWeight())
                .temperature(entity.getTemperature())
                .bloodPressure(entity.getBloodPressure())
                .pulse(entity.getPulse())
                .hemoglobin(entity.getHemoglobin())
                .volumeToTake(entity.getVolumeToTake())
                .isFitToDonate(entity.getIsFitToDonate())
                .note(entity.getNote())
                .donationRegistrationId(entity.getDonationRegistration() != null
                        ? entity.getDonationRegistration().getRegistrationId()
                        : null)
                .build();
    }

    // Convert DTO → Entity
    public static HealthCheck toEntity(HealthCheckDTO dto) {
        HealthCheck entity = new HealthCheck();
        entity.setHealthCheckId(dto.getHealthCheckId());
        entity.setWeight(dto.getWeight());
        entity.setTemperature(dto.getTemperature());
        entity.setBloodPressure(dto.getBloodPressure());
        entity.setPulse(dto.getPulse());
        entity.setHemoglobin(dto.getHemoglobin());
        entity.setVolumeToTake(dto.getVolumeToTake());
        entity.setIsFitToDonate(dto.getIsFitToDonate());
        entity.setNote(dto.getNote());

        if (dto.getDonationRegistrationId() != null) {
            DonationRegistration dr = new DonationRegistration();
            dr.setRegistrationId(dto.getDonationRegistrationId());
            entity.setDonationRegistration(dr);
        }

        return entity;
    }
}
