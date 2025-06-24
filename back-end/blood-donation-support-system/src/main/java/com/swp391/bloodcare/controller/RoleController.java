package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.RoleDTO;
import com.swp391.bloodcare.service.RoleService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping("/getall")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @GetMapping("/getbyname/{roleName}")
    public ResponseEntity<?> getByRole(@PathVariable String roleName) {
        try {
            return ResponseEntity.ok(roleService.getRoleByName(roleName));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody RoleDTO dto) {
        try {
            return ResponseEntity.ok(roleService.createRole(dto));
        } catch (EntityExistsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{roleName}")
    public ResponseEntity<?> update(@PathVariable String roleName, @RequestBody RoleDTO dto) {
        try {
            return ResponseEntity.ok(roleService.updateRole(roleName, dto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{roleName}")
    public ResponseEntity<?> delete(@PathVariable String roleName) {
        try {
            roleService.deleteRole(roleName);
            return ResponseEntity.ok("Xoá role thành công");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
