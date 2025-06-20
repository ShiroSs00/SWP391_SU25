package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.HealthCheck;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;


public class HealthCheckDTO {
    private String healthCheckId;
    private Double weight;
    private Double temperate;
    private Double bloodPressure;
    private Long pluse;
    private Double hemogobin;
    private Long volumeToTake;
    private Boolean isFitToDonate;
    private String note;

    private String donationRegistrationId;

    public HealthCheckDTO() {
    }

    public String getHealthCheckId() {
        return healthCheckId;
    }

    public void setHealthCheckId(String healthCheckId) {
        this.healthCheckId = healthCheckId;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getTemperate() {
        return temperate;
    }

    public void setTemperate(Double temperate) {
        this.temperate = temperate;
    }

    public Double getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(Double bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public Long getPluse() {
        return pluse;
    }

    public void setPluse(Long pluse) {
        this.pluse = pluse;
    }

    public Double getHemogobin() {
        return hemogobin;
    }

    public void setHemogobin(Double hemogobin) {
        this.hemogobin = hemogobin;
    }

    public Long getVolumeToTake() {
        return volumeToTake;
    }

    public void setVolumeToTake(Long volumeToTake) {
        this.volumeToTake = volumeToTake;
    }

    public Boolean getFitToDonate() {
        return isFitToDonate;
    }

    public void setFitToDonate(Boolean fitToDonate) {
        isFitToDonate = fitToDonate;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getDonationRegistrationId() {
        return donationRegistrationId;
    }

    public void setDonationRegistrationId(String donationRegistrationId) {
        this.donationRegistrationId = donationRegistrationId;
    }



    @Override
    public String toString() {
        return "HealthCheckDTO{" +
                "healthCheckId='" + healthCheckId + '\'' +
                ", weight=" + weight +
                ", temperate=" + temperate +
                ", bloodPressure=" + bloodPressure +
                ", pluse=" + pluse +
                ", hemogobin=" + hemogobin +
                ", volumeToTake=" + volumeToTake +
                ", isFitToDonate=" + isFitToDonate +
                ", note='" + note + '\'' +
                ", donationRegistrationId='" + donationRegistrationId + '\'' +
                '}';
    }
    public static HealthCheckDTO toDTO(HealthCheck healthCheck) {
        HealthCheckDTO dto = new HealthCheckDTO();
        dto.setHealthCheckId(healthCheck.getHealthCheckId());
        dto.setWeight(healthCheck.getWeight());
        dto.setTemperate(healthCheck.getTemperate());
        dto.setBloodPressure(healthCheck.getBloodPressure());
        dto.setPluse(healthCheck.getPluse());
        dto.setHemogobin(healthCheck.getHemogobin());
        dto.setVolumeToTake(healthCheck.getVolumeToTake());
        dto.setFitToDonate(healthCheck.isFitToDonate());
        dto.setNote(healthCheck.getNote());

        if (healthCheck.getDonationRegistration() != null) {
            dto.setDonationRegistrationId(healthCheck.getDonationRegistration().getRegistrationId());
        }


        return dto;
    }

    // Convert DTO => Entity
    public static HealthCheck toEntity(HealthCheckDTO dto) {
        HealthCheck entity = new HealthCheck();
        entity.setWeight(dto.getWeight());
        entity.setTemperate(dto.getTemperate());
        entity.setBloodPressure(dto.getBloodPressure());
        entity.setPluse(dto.getPluse());
        entity.setHemogobin(dto.getHemogobin());
        entity.setVolumeToTake(dto.getVolumeToTake());
        entity.setFitToDonate(dto.getFitToDonate());
        entity.setNote(dto.getNote());
        return entity;
    }
}
