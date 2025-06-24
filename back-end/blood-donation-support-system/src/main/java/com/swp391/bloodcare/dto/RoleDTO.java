package com.swp391.bloodcare.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDTO {
    private String role;
    private String description;

    public static RoleDTO fromEntity(com.swp391.bloodcare.entity.Role role) {
        return RoleDTO.builder()
                .role(role.getRole())
                .description(role.getDescription())
                .build();
    }

    public static com.swp391.bloodcare.entity.Role toEntity(RoleDTO dto) {
        return com.swp391.bloodcare.entity.Role.builder()
                .role(dto.getRole())
                .description(dto.getDescription())
                .build();
    }
}
