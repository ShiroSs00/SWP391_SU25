package com.swp391.bloodcare.controller.Location;

import com.swp391.bloodcare.dto.Location.ProvinceDTO;
import com.swp391.bloodcare.entity.Location.Province;
import com.swp391.bloodcare.service.Location.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin("*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/provinces")
    public ResponseEntity<List<ProvinceDTO>> getProvincesWithWards() {
        List<ProvinceDTO> provinceDTOs = locationService.getAllProvincesWithWards();
        return ResponseEntity.ok(provinceDTOs);
    }
}
