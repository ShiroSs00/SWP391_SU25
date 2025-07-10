package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.ComponentDTO;
import com.swp391.bloodcare.entity.Component;
import com.swp391.bloodcare.repository.ComponentRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComponentService {


    private final ComponentRepository componentRepository;

    public ComponentService(ComponentRepository componentRepository) {
        this.componentRepository = componentRepository;
    }

    public Component findById(String id) {
        return componentRepository.findById(id).orElse(null);
    }

    public List<ComponentDTO> getAll() {
        return componentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Component save(Component component) {
        return componentRepository.save(component);
    }

    public void deleteComponent(String id) {
        if (componentRepository.existsById(id)) {
            componentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Không tìm thấy thành phần với ID: " + id);
        }
    }

    public ComponentDTO convertToDTO(Component component) {
        if (component == null) return null;

        ComponentDTO dto = new ComponentDTO();
        dto.setComponentId(component.getComponentId());
        dto.setType(component.getType());
        dto.setExpirationDays(component.getExpirationDays());
        dto.setDescription(component.getDescription());


        return dto;
    }

    public Component convertToEntity(ComponentDTO dto) {
        if (dto == null) return null;

        Component component = new Component();
        component.setComponentId(dto.getComponentId());
        component.setType(dto.getType());
        component.setExpirationDays(dto.getExpirationDays());
        component.setDescription(dto.getDescription());

        return component;
    }

    public ComponentDTO createComponent(ComponentDTO dto) {
        if (componentRepository.existsById(dto.getComponentId())) {
            throw new RuntimeException("Đã tồn tại thành phần với ID: " + dto.getComponentId());
        }

        Component component = convertToEntity(dto);
        Component savedComponent = componentRepository.save(component);
        return convertToDTO(savedComponent);
    }

    public ComponentDTO updateComponent(String id, ComponentDTO dto) {
        Optional<Component> optional = componentRepository.findById(id);
        if (optional.isPresent()) {
            Component component = optional.get();
            component.setDescription(dto.getDescription());

            // Optional: Cho phép update các field khác nếu cần
            if (dto.getExpirationDays() != null ) {
                component.setExpirationDays(dto.getExpirationDays());
            }

            if (dto.getType() != null) {
                component.setType(dto.getType());
            }


            Component updated = componentRepository.save(component);
            return convertToDTO(updated);
        }

        throw new RuntimeException("Không tìm thấy thành phần với ID: " + id);
    }
}
