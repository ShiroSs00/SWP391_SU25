package com.swp391.bloodcare.service.Location;

import com.swp391.bloodcare.entity.Location.Province;
import com.swp391.bloodcare.repository.Location.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private ProvinceRepository provinceRepository;

    public List<Province> getAllProvincesWithWard(){
        return provinceRepository.findAllWithWards();
    }
}

