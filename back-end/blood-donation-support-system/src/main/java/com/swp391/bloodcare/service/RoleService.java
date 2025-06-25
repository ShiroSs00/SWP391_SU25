package com.swp391.bloodcare.service;
import com.swp391.bloodcare.dto.RoleDTO;
import com.swp391.bloodcare.entity.Role;
import com.swp391.bloodcare.repository.RoleRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(RoleDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public RoleDTO getRoleByName(String roleName) {
        return RoleDTO.fromEntity(roleRepository.findById(roleName)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy role: " + roleName)));
    }

    public RoleDTO createRole(RoleDTO dto) {
        if (roleRepository.existsById(dto.getRole())) {
            throw new EntityExistsException("Role đã tồn tại: " + dto.getRole());
        }
        return RoleDTO.fromEntity(roleRepository.save(RoleDTO.toEntity(dto)));
    }

    public RoleDTO updateRole(String roleName, RoleDTO dto) {
        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy role: " + roleName));
        role.setDescription(dto.getDescription());
        return RoleDTO.fromEntity(roleRepository.save(role));
    }

    public void deleteRole(String roleName) {
        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy role: " + roleName));
        roleRepository.delete(role);
    }
}
