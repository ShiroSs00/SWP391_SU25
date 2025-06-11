package com.swp391.superapp.bloodsupport.entity;

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

    @OneToMany(mappedBy = "achievement")
    private List<Profile> profiles;

    public List<Profile> getProfiles() { return profiles; }
    public void setProfiles(List<Profile> profiles) { this.profiles = profiles; }

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
