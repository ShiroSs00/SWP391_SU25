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

    @NotNull(message = "Nhóm máu không được để trống")
    private String bloodId;


}
