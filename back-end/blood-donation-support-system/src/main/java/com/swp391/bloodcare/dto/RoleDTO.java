package com.swp391.bloodcare.dto;

import com.swp391.bloodcare.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDTO {

    @NotBlank(message = "Tên quyền không được để trống")
    @Size(max = 50, message = "Tên quyền tối đa 50 ký tự")
    private String role;

    @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
    private String description;

    public static RoleDTO fromEntity(Role role) {
        return RoleDTO.builder()
                .role(role.getRole())
                .description(role.getDescription())
                .build();
    }

    public static Role toEntity(RoleDTO dto) {
        return Role.builder()
                .role(dto.getRole())
                .description(dto.getDescription())
                .build();
    }
}
