package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.AfterDonationBlood;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AfterDonationBloodDTO {


    private String idAfterDonation;

    @NotNull(message = "Vui lòng kiểm tra bệnh truyền nhiễm")
    private Boolean infectiousDiseasesChecked;

    @NotNull(message = "Vui lòng xác định máu có thể sử dụng không")
    private Boolean isBloodUsable;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String note;

    private AfterDonationBlood.Status status;

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
