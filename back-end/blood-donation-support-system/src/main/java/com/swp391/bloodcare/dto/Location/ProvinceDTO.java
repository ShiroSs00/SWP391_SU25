package com.swp391.bloodcare.dto.Location;

import java.util.List;

public class ProvinceDTO {
    public String code;
    public String name;
    public String region; // thêm tên vùng vào
    public List<WardDTO> wards;

    public ProvinceDTO(String code, String name, String region, List<WardDTO> wards) {
        this.code = code;
        this.name = name;
        this.region = region;
        this.wards = wards;
    }
}

