package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "achievement")
public class Achievement {
    @Id
    @Column(name ="achievement_name")
    private String achievementName;

    @Column(name ="description")
    private String description;

    @OneToMany
    private List<Profile> profiles;

    public Achievement() {
    }

    public Achievement(String description, String achievementName) {
        this.description = description;
        this.achievementName = achievementName;
    }

    public String getAchievementName() {
        return achievementName;
    }

    public void setAchievementName(String achievementName) {
        this.achievementName = achievementName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Achievement{" +
                "achievementName='" + achievementName + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
