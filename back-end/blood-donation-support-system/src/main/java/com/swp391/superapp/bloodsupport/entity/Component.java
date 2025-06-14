package com.swp391.superapp.bloodsupport.entity;

public class Component {
    private String component;
    private String description;

    public Component() {
    }

    public Component(String component, String description) {
        this.component = component;
        this.description = description;
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
