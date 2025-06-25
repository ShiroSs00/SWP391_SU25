package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class HealthCheckDTO {

    private String healthCheckId;
    private Double weight;
    private Double temperature;
    private Double bloodPressure;
    private Long pulse;
    private Double hemoglobin;
    private Long volumeToTake;
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
                .isFitToDonate(entity.isFitToDonate())
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
        entity.setFitToDonate(dto.getIsFitToDonate());
        entity.setNote(dto.getNote());

        if (dto.getDonationRegistrationId() != null) {
            DonationRegistration dr = new DonationRegistration();
            dr.setRegistrationId(dto.getDonationRegistrationId());
            entity.setDonationRegistration(dr);
        }

        return entity;
    }
}
