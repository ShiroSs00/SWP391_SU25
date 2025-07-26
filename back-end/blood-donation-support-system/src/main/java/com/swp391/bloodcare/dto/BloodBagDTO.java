package com.swp391.bloodcare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.swp391.bloodcare.entity.BloodBag;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodBagDTO {

    private String bagId;

    @NotNull(message = "Vui lòng chọn thể tích túi máu ")
    private Integer volume;

    @PastOrPresent(message = "Ngày tách phải nhỏ hơn hoặc bằng ngày hiện tại")
    @NotNull(message = "Vui lòng nhập ngày lấy máu")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date collectedDate;

    @NotNull(message = "Vui lòng nhập ngày hết hạn")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date expirationDate;

    private BloodBag.Status status;

    @NotNull(message = "Loại túi máu không được để trống")
    private String componentId;

    @NotNull(message = "Nhóm máu không được để trống")
    private String bloodCode;

    private String afterDonationId;

    @AssertTrue(message = "Hạn sử dụng phải sau hoặc bằng ngày lấy máu")
    public boolean isExpirationAfterCollected() {
        if (collectedDate == null || expirationDate == null) {
            return true;
        }
        return !expirationDate.before(collectedDate);
    }

    public static BloodBagDTO fromEntity(BloodBag bag) {
        return BloodBagDTO.builder()
                .bagId(bag.getBagId())
                .volume(bag.getVolume() != null ? bag.getVolume().getMl() : null)
                .collectedDate(bag.getCollectedDate())
                .expirationDate(bag.getExpirationDate())
                .status(bag.getStatus())
                .bloodCode(bag.getBlood().getBloodCode())
                .componentId(bag.getComponent() != null ? bag.getComponent().getComponentId() : null)
                .afterDonationId(
                        bag.getAfterDonationBlood() != null
                                ? bag.getAfterDonationBlood().getIdAfterDonation()
                                : null
                )
                .build();
    }
}

