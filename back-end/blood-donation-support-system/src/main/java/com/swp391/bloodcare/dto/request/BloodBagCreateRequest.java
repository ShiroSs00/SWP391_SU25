package com.swp391.bloodcare.dto.request;

import java.util.List;

import com.swp391.bloodcare.dto.BloodBagDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class BloodBagCreateRequest {

    private String afterDonationId;

    @NotEmpty(message = "Danh sách túi máu cần tạo không được để trống")
    private List<@Valid BloodBagDTO> bloodBags;
}
