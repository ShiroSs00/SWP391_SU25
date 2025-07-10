package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "component")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Component {

    @Id
    @Column(name = "component_id")
    @NotBlank(message = "Mã thành phần không được để trống")
    private String componentId;

    @Column(name = "type", nullable = false)
    @NotNull(message = "Loại thành phần không được để trống")
    private String type;

    @Column(name = "expiration_days")
    @NotNull(message = "Số ngày hết hạn không được để trống")
    @Min(value = 1, message = "Số ngày hết hạn phải lớn hơn 0")
    private Integer expirationDays;


    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    @Column(name = "description")
    private String description;

}
