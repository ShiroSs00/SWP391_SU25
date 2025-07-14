package com.swp391.bloodcare.entity;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Address {

    @NotBlank(message = "Thành phố không được để trống")
    private String city;

    @NotBlank(message = "Quận/huyện không được để trống")
    private String district;

    @NotBlank(message = "Phường/xã không được để trống")
    private String ward;

    @NotBlank(message = "Đường không được để trống")
    private String street;

    @DecimalMin(value = "-90.0", inclusive = true, message = "Vĩ độ không hợp lệ")
    @DecimalMax(value = "90.0", inclusive = true, message = "Vĩ độ không hợp lệ")
    private Double latitude;

    @DecimalMin(value = "-180.0", inclusive = true, message = "Kinh độ không hợp lệ")
    @DecimalMax(value = "180.0", inclusive = true, message = "Kinh độ không hợp lệ")
    private Double longitude;


    @Override
    public String toString() {
        return street + ", " + ward  + ", "+ district+ ", " + city;

    }
}
