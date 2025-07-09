package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodBagDTO;
import com.swp391.bloodcare.entity.AfterDonationBlood;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.repository.AfterDonationRepository;
import com.swp391.bloodcare.repository.BloodBagRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodBagService {

    private final BloodBagRepository bloodBagRepository;

    private final AfterDonationRepository afterDonationRepository;

    public BloodBagDTO createBloodBag(BloodBagDTO dto) {
        // Validate volume không null
        if (dto.getVolume() == null) {
            throw new IllegalArgumentException("Thể tích túi máu là bắt buộc (ML_250, ML_350, ML_450)");
        }

        // Tạo mã túi máu duy nhất
        String newId;
        do {
            newId = generateBloodBagId();
        } while (bloodBagRepository.existsByBagId(newId));

        BloodBag entity = BloodBagDTO.toEntity(dto);
        entity.setBagId(newId);
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "Available");



        // Gán AfterDonationBlood nếu có
        if (dto.getAfterDonationId() != null) {
            AfterDonationBlood afterDonation = afterDonationRepository.findAfterDonationBloodByIdAfterDonation(dto.getAfterDonationId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dữ liệu sau hiến"));
            entity.setAfterDonationBlood(afterDonation);
            afterDonation.setBloodBag(entity); // quan trọng nếu dùng mappedBy
        }

        BloodBag saved = bloodBagRepository.save(entity);
        return BloodBagDTO.fromEntity(saved);
    }

    @Transactional
    public Map<String, List<String>> deleteBloodBags(List<String> bagIds) {
        List<String> deletedIds = new ArrayList<>();
        List<String> notFoundIds = new ArrayList<>();

        for (String bagId : bagIds) {
            if (bloodBagRepository.existsByBagId(bagId)) {
                deletedIds.add(bagId);
            } else {
                notFoundIds.add(bagId);
            }
        }

        if (!deletedIds.isEmpty()) {
            bloodBagRepository.deleteAllByBagIdIn(deletedIds);
        }

        return Map.of(
                "deletedIds", deletedIds,
                "notFoundIds", notFoundIds
        );
    }



    public BloodBagDTO updateBloodBag( BloodBagDTO dto) {
        BloodBag existing = bloodBagRepository.findByBagId(dto.getBagId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy túi máu có ID: " + dto.getBagId()));

        // Cập nhật các trường nếu có
        if (dto.getVolume() != null) existing.setVolume(dto.getVolume());
        if (dto.getCollectedDate() != null) existing.setCollectedDate(dto.getCollectedDate());
        if (dto.getExpirationDate() != null) existing.setExpirationDate(dto.getExpirationDate());
        if (dto.getStatus() != null && !dto.getStatus().isBlank()) existing.setStatus(dto.getStatus());



        BloodBag saved = bloodBagRepository.save(existing);
        return BloodBagDTO.fromEntity(saved);
    }

    @Transactional
    public void deleteBloodBag(String bagId) {
        if (!bloodBagRepository.existsByBagId(bagId)) {
            throw new EntityNotFoundException("Không tìm thấy túi máu cần xóa");
        }
        bloodBagRepository.deleteBloodBagBybagId(bagId);
    }

    public BloodBagDTO findByAfterDonationId(String afterDonationId) {
        BloodBag bag = bloodBagRepository.findByAfterDonationBlood_IdAfterDonation(afterDonationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy túi máu từ AfterDonation ID"));
        return BloodBagDTO.fromEntity(bag);
    }

    public List<BloodBagDTO> getAllBloodBags() {
        return bloodBagRepository.findAll()
                .stream()
                .map(BloodBagDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ===================== PRIVATE ======================
    private static String generateBloodBagId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int randomNum = new Random().nextInt(900) + 100; // 100–999
        return "BG-" + timestamp + "-" + randomNum;
    }
}
