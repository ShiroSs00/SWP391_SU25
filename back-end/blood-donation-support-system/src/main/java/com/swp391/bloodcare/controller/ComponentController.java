package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.ComponentDTO;
import com.swp391.bloodcare.entity.Component;
import com.swp391.bloodcare.service.ComponentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/components")
@CrossOrigin(origins = "*")
public class ComponentController {


    @Autowired
    private ComponentService componentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ComponentDTO>> createComponent(
            @Valid @RequestBody ComponentDTO componentDTO) {
        try {
            ComponentDTO createdComponent = componentService.createComponent(componentDTO);
            ApiResponse<ComponentDTO> response = new ApiResponse<>(
                    true, "Component created successfully", createdComponent);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            ApiResponse<ComponentDTO> response = new ApiResponse<>(
                    false, e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<ComponentDTO>>> getAllComponents() {
        List<ComponentDTO> components = componentService.getAll();
        ApiResponse<List<ComponentDTO>> response = new ApiResponse<>(
                true, "Lấy danh sách thành phần máu thành công", components);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Component>> getComponentById(@PathVariable String id) {
        try {
            Component component = componentService.findById(id);
            ApiResponse<Component> response = new ApiResponse<>(
                    true, "Component found successfully", component);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            ApiResponse<Component> response = new ApiResponse<>(
                    false, e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ComponentDTO>> updateComponent(
            @PathVariable String id,
            @Valid @RequestBody ComponentDTO componentDTO) {
        try {
            ComponentDTO updatedComponent = componentService.updateComponent(id, componentDTO);
            ApiResponse<ComponentDTO> response = new ApiResponse<>(
                    true, "Component updated successfully", updatedComponent);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            ApiResponse<ComponentDTO> response = new ApiResponse<>(
                    false, e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteComponent(@PathVariable String id) {
        try {
            componentService.deleteComponent(id);
            ApiResponse<String> response = new ApiResponse<>(
                    true, "Component deleted successfully", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            ApiResponse<String> response = new ApiResponse<>(
                    false, e.getMessage(), null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

}
