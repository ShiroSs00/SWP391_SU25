package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "achievement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement {

    @Id
    @Column(name = "achievement_name")
    @NotBlank(message = "Tên thành tựu không được để trống")
    private String achievementName;

    @Column(name = "description", length = 255)
    @Size(max = 255, message = "Mô tả không được dài quá 255 ký tự")
    private String description;

    @Column(name ="min_value")
    @NotNull(message = "Giá trị tối thiểu không được null")
    @Min(value = 0, message = "Giá trị tối thiểu phải >= 0")
    private Long minValue;

    @Column(name ="max_value")
    @NotNull(message = "Giá trị tối đa không được null")
    @Min(value = 0, message = "Giá trị tối đa phải >= 0")
    private Long maxValue;

    @OneToMany(mappedBy = "achievement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Profile> profiles;

    @AssertTrue(message = "minValue phải nhỏ hơn hoặc bằng maxValue")
    public boolean isValidValueRange() {
        if (minValue == null || maxValue == null) return true; // để tránh lỗi null khi validate từng bước
        return minValue <= maxValue;
    }
}

