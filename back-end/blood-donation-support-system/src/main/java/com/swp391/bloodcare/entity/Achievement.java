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
    @NotBlank // KHÔNG có message
    private String achievementName;

    @Column(name = "description", length = 255)
    @Size(max = 255)
    private String description;

    @Column(name = "min_value")
    @NotNull
    @Min(0)
    private Long minValue;

    @Column(name = "max_value")
    @NotNull
    @Min(0)
    private Long maxValue;

    @OneToMany(mappedBy = "achievement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Profile> profiles;

    @AssertTrue
    public boolean isValidValueRange() {
        if (minValue == null || maxValue == null) return true;
        return minValue <= maxValue;
    }
}


