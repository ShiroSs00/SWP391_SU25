package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodDTO;
import com.swp391.bloodcare.entity.Blood;
import com.swp391.bloodcare.entity.Component;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.BloodBagRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import com.swp391.bloodcare.repository.ComponentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class BloodService {

    @Autowired
    private BloodRepository bloodRepository;

    @Autowired
    private BloodBagRepository bloodBagRepository;

    @Autowired
    private ComponentRepository componentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private EmailService emailService;


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

    private static final Map<String, List<String>> BLOOD_COMPATIBILITY = new HashMap<>();

    static {
        // Nhóm máu O- có thể hiến cho tất cả
        BLOOD_COMPATIBILITY.put("O-", Arrays.asList("O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"));
        // Nhóm máu O+ có thể hiến cho O+, A+, B+, AB+
        BLOOD_COMPATIBILITY.put("O+", Arrays.asList("O+", "A+", "B+", "AB+"));
        // Nhóm máu A- có thể hiến cho A+, A-, AB+, AB-
        BLOOD_COMPATIBILITY.put("A-", Arrays.asList("A+", "A-", "AB+", "AB-"));
        // Nhóm máu A+ có thể hiến cho A+, AB+
        BLOOD_COMPATIBILITY.put("A+", Arrays.asList("A+", "AB+"));
        // Nhóm máu B- có thể hiến cho B+, B-, AB+, AB-
        BLOOD_COMPATIBILITY.put("B-", Arrays.asList("B+", "B-", "AB+", "AB-"));
        // Nhóm máu B+ có thể hiến cho B+, AB+
        BLOOD_COMPATIBILITY.put("B+", Arrays.asList("B+", "AB+"));
        // Nhóm máu AB- có thể hiến cho AB+, AB-
        BLOOD_COMPATIBILITY.put("AB-", Arrays.asList("AB+", "AB-"));
        // Nhóm máu AB+ chỉ có thể hiến cho AB+
        BLOOD_COMPATIBILITY.put("AB+", Arrays.asList("AB+"));
    }

    /**
     * Kiểm tra xem loại máu nào có thể hiến cho nhau
     * @param donorBloodCode Nhóm máu của người hiến
     * @param recipientBloodCode Nhóm máu của người nhận
     * @return true nếu tương thích
     */
    public boolean isBloodCompatible(String donorBloodCode, String recipientBloodCode) {
        List<String> compatibleRecipients = BLOOD_COMPATIBILITY.get(donorBloodCode);
        return compatibleRecipients != null && compatibleRecipients.contains(recipientBloodCode);
    }

    /**
     * Lấy danh sách nhóm máu có thể hiến cho nhóm máu cụ thể
     * @param recipientBloodCode Nhóm máu người nhận
     * @return Danh sách nhóm máu có thể hiến
     */
    public List<String> getCompatibleDonorBloodTypes(String recipientBloodCode) {
        return BLOOD_COMPATIBILITY.entrySet().stream()
                .filter(entry -> entry.getValue().contains(recipientBloodCode))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }


}
