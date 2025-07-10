package com.swp391.bloodcare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.entity.Component;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodBagDTO {

    private String bagId;

    @NotNull(message = "Vui lòng chọn thể tích túi máu (250ml, 350ml hoặc 450ml)")
    private BloodBag.Volume volume;

    @NotNull(message = "Vui lòng nhập ngày lấy máu")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date collectedDate;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date expirationDate;

    @NotNull(message = "Trạng thái túi máu không được để trống")
    private BloodBag.Status status;

    @NotNull(message = "Loại túi máu không được để trống")
    private String componentId;

    public static BloodBagDTO fromEntity(BloodBag bag) {
        return BloodBagDTO.builder()
                .bagId(bag.getBagId())
                .volume(bag.getVolume())
                .collectedDate(bag.getCollectedDate())
                .expirationDate(bag.getExpirationDate())
                .status(bag.getStatus())
                .componentId(bag.getComponent() != null ? bag.getComponent().getComponentId() : null)
                .build();
    }

    public static BloodBag toEntity(BloodBagDTO dto, Component component) {
        return BloodBag.builder()
                .bagId(dto.getBagId())
                .volume(dto.getVolume())
                .collectedDate(dto.getCollectedDate())
                .expirationDate(dto.getExpirationDate())
                .status(dto.getStatus())
                .component(component)
                .build();
    }

}

