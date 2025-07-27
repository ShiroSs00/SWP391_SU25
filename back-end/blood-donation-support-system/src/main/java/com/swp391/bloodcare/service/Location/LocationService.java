package com.swp391.bloodcare.service.Location;

import com.swp391.bloodcare.dto.Location.ProvinceDTO;
import com.swp391.bloodcare.dto.Location.WardDTO;
import com.swp391.bloodcare.entity.Location.Province;
import com.swp391.bloodcare.repository.Location.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    private ProvinceRepository provinceRepository;

    public List<ProvinceDTO> getAllProvincesWithWards() {
        List<Province> provinces = provinceRepository.findAllWithWards();

        return provinces.stream().map(province -> {
            List<WardDTO> wardDTOs = province.getWards().stream()
                    .map(ward -> new WardDTO(ward.getCode(), ward.getName()))
                    .collect(Collectors.toList());

            String regionName = province.getRegion() != null ? province.getRegion().getName() : null;

            return new ProvinceDTO(
                    province.getCode(),
                    province.getName(),
                    regionName,
                    wardDTOs
            );
        }).collect(Collectors.toList());
    }


}

