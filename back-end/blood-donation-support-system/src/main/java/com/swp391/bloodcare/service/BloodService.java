package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodDTO;
import com.swp391.bloodcare.entity.Blood;
import com.swp391.bloodcare.entity.Component;
import com.swp391.bloodcare.repository.BloodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BloodService {

    @Autowired
    private BloodRepository bloodRepository;


    //tạo mới
    public BloodDTO createBlood(BloodDTO bloodDTO) {
        if(bloodDTO.getBloodType() == null || bloodDTO.getBloodCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Blood code không được để trống");
        }
        if(bloodRepository.findByBloodCode(bloodDTO.getBloodCode()).isPresent()) {
            throw new IllegalArgumentException("Blood code đã tồn tại: " + bloodDTO.getBloodCode());
        }
        Blood blood = new Blood();
        blood.setBloodType(bloodDTO.getBloodType());
        blood.setBloodCode(bloodDTO.getBloodCode());
        blood.setRh(bloodDTO.getRhFactor());
        blood.setIsRareBlood(bloodDTO.getIsRareBlood());
        blood.setQuantity(bloodDTO.getQuantity());
        blood.setBloodMatch(bloodDTO.getBloodMatch());
        Blood savedBlood = bloodRepository.save(blood);
        return new BloodDTO(savedBlood);
    }

    public List<BloodDTO> searchByCriteriaDTO(String bloodCode, Blood.RhFactor rh, Boolean isRareBlood){
        List<Blood> bloodList = bloodRepository.findByCriteria(bloodCode, rh, isRareBlood);
        return bloodList.stream()
                .map(BloodDTO::new)
                .collect(Collectors.toList());
    }

    public BloodDTO findByBloodCodeDTO(String bloodCode) {
        Optional<Blood> blood = bloodRepository.findByBloodCode(bloodCode);
        return blood.map(BloodDTO::new).orElse(null);
    }

    public List<BloodDTO> findRareBloodDTO(Boolean isRare) {
        List<Blood> bloodList = bloodRepository.findByIsRareBlood(isRare);
        return bloodList.stream()
                .map(BloodDTO::new)
                .collect(Collectors.toList());
    }

    public void deleteBlood(String bloodCode) {
        if (!bloodRepository.existsById(bloodCode)) {
            throw new IllegalArgumentException("Blood record không tồn tại: " + bloodCode);
        }
        bloodRepository.deleteById(bloodCode);
    }

    //lấy tất cả
    public List<BloodDTO> findAllDTO() {
        List<Blood> bloodList = bloodRepository.findAll();
        return bloodList.stream()
                .map(BloodDTO::new)
                .collect(Collectors.toList());
    }

    //cập nhật
    public BloodDTO updateBlood(String bloodCode, BloodDTO bloodDTO) {
        Optional<Blood> blood = bloodRepository.findById(bloodCode);
        if(!blood.isPresent()) {
            throw new IllegalArgumentException("Blood record không tồn tại: " + bloodCode);
        }
        Blood eBlood = blood.get();
        eBlood.setBloodType(bloodDTO.getBloodType());
        eBlood.setRh(bloodDTO.getRhFactor());
        eBlood.setIsRareBlood(bloodDTO.getIsRareBlood());
        eBlood.setQuantity(bloodDTO.getQuantity());
        eBlood.setBloodMatch(bloodDTO.getBloodMatch());
        Blood savedBlood = bloodRepository.save(eBlood);
        return new BloodDTO(savedBlood);
    }

    public void increseQuantity(Blood blood){
        if(blood == null) return;
        long currentQuantity = blood.getQuantity();
        blood.setQuantity(currentQuantity + 1);
        bloodRepository.save(blood);
    }

    public void decreseQuantity(Blood blood){
        if (blood == null) return;
        long currentQuantity = blood.getQuantity();
        blood.setQuantity(Math.max(0, currentQuantity - 1));
        bloodRepository.save(blood);
    }



}
