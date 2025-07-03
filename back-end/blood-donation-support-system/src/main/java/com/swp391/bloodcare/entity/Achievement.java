package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
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
    private String achievementName;

    @Column(name = "description")
    private String description;

    @Column(name ="min_value")
    private Long minValue;

    @Column(name ="max_value")
    private Long maxValue;

    @OneToMany(mappedBy = "achievement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Profile> profiles;
}
