package com.swp391.bloodcare.dto;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementDTO {
    private String achievementName;
    private String description;

    private Long minValue;

    private Long maxValue;

}
