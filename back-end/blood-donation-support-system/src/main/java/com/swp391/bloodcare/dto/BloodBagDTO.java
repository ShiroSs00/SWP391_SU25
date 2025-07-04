package com.swp391.bloodcare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.swp391.bloodcare.entity.BloodBag;
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

    @NotNull(message = "Vui lòng nhập hạn sử dụng")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date expirationDate;

    @NotNull(message = "Trạng thái túi máu không được để trống")
    private String status;

    @NotNull(message = "Túi máu phải được gắn với thông tin sau hiến máu")
    private String afterDonationId;

    private String waitingListId;

    public static BloodBagDTO fromEntity(BloodBag bag) {
        return BloodBagDTO.builder()
                .bagId(bag.getBagId())
                .volume(bag.getVolume())
                .collectedDate(bag.getCollectedDate())
                .expirationDate(bag.getExpirationDate())
                .status(bag.getStatus())
                .afterDonationId(
                        bag.getAfterDonationBlood() != null ? bag.getAfterDonationBlood().getIdAfterDonation() : null
                )
                .waitingListId(
                        bag.getWaitingList() != null ? bag.getWaitingList().getWaitListId() : null
                )
                .build();
    }

    public static BloodBag toEntity(BloodBagDTO dto) {
        return BloodBag.builder()
                .bagId(dto.getBagId())
                .volume(dto.getVolume())
                .collectedDate(dto.getCollectedDate())
                .expirationDate(dto.getExpirationDate())
                .status(dto.getStatus())
                .build();
    }
}
