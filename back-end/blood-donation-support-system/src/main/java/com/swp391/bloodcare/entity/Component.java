package com.swp391.bloodcare.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name ="component")
public class Component {
    @Id
    private String component;
    private String description;

    public Component(String component, String description) {
        this.component = component;
        this.description = description;
    }

    public Component() {
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Component{" +
                "component='" + component + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
