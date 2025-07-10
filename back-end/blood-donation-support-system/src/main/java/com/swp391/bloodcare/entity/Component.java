package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.Date;

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

    @Temporal(TemporalType.DATE)
    @Column(name = "expiration_date")
    @Future(message = "Hạn sử dụng phải là một ngày trong tương lai")
    private Date expirationDate;

    @Size(max = 500, message = "Mô tả không được quá 500 ký tự")
    @Column(name = "description")
    private String description;

}
