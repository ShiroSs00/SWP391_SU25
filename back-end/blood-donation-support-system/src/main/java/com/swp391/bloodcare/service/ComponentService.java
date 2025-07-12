package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.ComponentDTO;
import com.swp391.bloodcare.entity.Component;
import com.swp391.bloodcare.repository.ComponentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ComponentService {

    @Autowired
    private ComponentRepository componentRepository;

    public Component findById(String c){
        return componentRepository.findById(c).orElse(null);
    }

    public List<Component> getAll(){
        return componentRepository.findAll();
    }

    public Component save(Component component){
        return componentRepository.save(component);
    }

    public void deleteComponent(String id) {
        if (componentRepository.existsById(id)) {
            componentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Component not found with id: " + id);
        }
    }

    public ComponentDTO convertToDTO(Component component) {
        if (component == null) {
            return null;
        }
        ComponentDTO dto = new ComponentDTO();
        dto.setComponent(component.getComponentId());
        dto.setDescription(component.getDescription());
        return dto;
    }

    public Component convertToEntity(ComponentDTO componentDTO) {
        if (componentDTO == null) {
            return null;
        }
        Component component = new Component();
        component.setComponentId(componentDTO.getComponent());
        component.setDescription(componentDTO.getDescription());
        return component;
    }

    public ComponentDTO updateComponent(String id, ComponentDTO componentDTO) {
        Optional<Component> existingComponent = componentRepository.findById(id);
        if (existingComponent.isPresent()) {
            Component component = existingComponent.get();
            component.setDescription(componentDTO.getDescription());
            // Note: Không update component name vì nó là ID

            Component updatedComponent = componentRepository.save(component);
            return convertToDTO(updatedComponent);
        }
        throw new RuntimeException("Component not found with id: " + id);
    }

    public ComponentDTO createComponent(ComponentDTO componentDTO) {
        if (componentRepository.existsByComponent(componentDTO.getComponent())) {
            throw new RuntimeException("Component already exists with name: " + componentDTO.getComponent());
        }

        Component component = convertToEntity(componentDTO);
        Component savedComponent = componentRepository.save(component);
        return convertToDTO(savedComponent);
    }
}
