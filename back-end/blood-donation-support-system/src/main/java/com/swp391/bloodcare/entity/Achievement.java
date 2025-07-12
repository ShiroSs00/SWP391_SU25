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
    @Size(max = 255, message = "Mô tả không được vượt quá 255 ký tự")
    private String description;

    @Column(name = "min_value")
    @NotNull(message = "Giá trị tối thiểu không được để trống")
    @Min(value = 0, message = "Giá trị tối thiểu không được nhỏ hơn 0")
    private Long minValue;

    @Column(name = "max_value")
    @NotNull(message = "Giá trị tối đa không được để trống")
    @Min(value = 0, message = "Giá trị tối đa không được nhỏ hơn 0")
    private Long maxValue;

    @OneToMany(mappedBy = "achievement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Profile> profiles;

    @AssertTrue(message = "Giá trị tối thiểu không được lớn hơn giá trị tối đa")
    public boolean isValidValueRange() {
        if (minValue == null || maxValue == null) return true;
        return minValue <= maxValue;
    }
}
