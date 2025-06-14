package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "achievement")
public class Achievement {
    @Id
    @Column(name ="achievement_name")
    private String achievementName;

    @Column(name ="description")
    private String description;

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
