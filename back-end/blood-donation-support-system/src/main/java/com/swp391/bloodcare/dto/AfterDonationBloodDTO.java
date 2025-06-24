package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.AfterDonationBlood;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AfterDonationBloodDTO {
    private String idAfterDonation;
    private Boolean infectiousDiseasesChecked;
    private Boolean isBloodUsable;
    private String status;
    private String note;
    private String healthCheckId;
    private String bloodId;

    public static AfterDonationBloodDTO toDTO(AfterDonationBlood entity) {
        AfterDonationBloodDTO dto = new AfterDonationBloodDTO();
        dto.setIdAfterDonation(entity.getIdAfterDonation());
        dto.setInfectiousDiseasesChecked(entity.getInfectiousDiseasesChecked());
        dto.setIsBloodUsable(entity.getIsBloodUsable());
        dto.setStatus(entity.getStatus());
        dto.setNote(entity.getNote());
        if (entity.getHealthCheck() != null)
            dto.setHealthCheckId(entity.getHealthCheck().getHealthCheckId());
        if (entity.getBlood() != null)
            dto.setBloodId(entity.getBlood().getBloodCode());
        return dto;
    }

    public static AfterDonationBlood toEntity(AfterDonationBloodDTO dto) {
        AfterDonationBlood entity = new AfterDonationBlood();
        entity.setInfectiousDiseasesChecked(dto.getInfectiousDiseasesChecked());
        entity.setIsBloodUsable(dto.getIsBloodUsable());
        entity.setStatus(dto.getStatus());
        entity.setNote(dto.getNote());
        return entity;
    }

}
