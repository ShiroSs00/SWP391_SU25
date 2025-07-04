package com.swp391.bloodcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComponentDTO {
    @NotBlank(message = "Component name cannot be blank")
    @Size(max = 255, message = "Component name must not exceed 255 characters")
    private String component;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
}
