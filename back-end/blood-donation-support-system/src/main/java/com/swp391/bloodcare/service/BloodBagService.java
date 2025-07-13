package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodBagDTO;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.entity.Component;
import com.swp391.bloodcare.repository.BloodBagRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import com.swp391.bloodcare.repository.ComponentRepository;
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


    private final ComponentRepository componentRepository;


    private final BloodRepository  bloodRepository;

    public BloodBagDTO createBloodBag(BloodBagDTO dto) {
        if (dto.getVolume() == null) {
            throw new IllegalArgumentException("Thể tích túi máu là bắt buộc (ML_250, ML_350, ML_450)");
        }

        Component component = componentRepository.findById(dto.getComponentId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Component với ID: " + dto.getComponentId()));

        Optional<BloodBag> existingOpt = bloodBagRepository.findByMatchingAttributes(
                dto.getBloodCode(),
                dto.getVolume(),
                dto.getExpirationDate(),
                component
        );

        if (existingOpt.isPresent()) {
            BloodBag existing = existingOpt.get();
            existing.setQuantity(existing.getQuantity() + dto.getQuantity());
            BloodBag updated = bloodBagRepository.save(existing);
            return BloodBagDTO.fromEntity(updated);
        } else {
            String newId;
            do {
                newId = generateBloodBagId();
            } while (bloodBagRepository.existsByBagId(newId));

            BloodBag entity = toEntity(dto, component);
            entity.setBagId(newId);
            entity.setStatus(dto.getStatus() != null ? dto.getStatus() : BloodBag.Status.VALID);
            entity.setComponent(component);

            BloodBag saved = bloodBagRepository.save(entity);
            return BloodBagDTO.fromEntity(saved);
        }
    }


    @Transactional
    public int autoUpdateExpiredStatus() {
        List<BloodBag> expiredBags = bloodBagRepository.findByExpirationDateBeforeAndStatus(
                new Date(), BloodBag.Status.VALID);
        for (BloodBag bag : expiredBags) {
            bag.setStatus(BloodBag.Status.EXPIRED);
        }
        bloodBagRepository.saveAll(expiredBags);
        return expiredBags.size();
    }

    private BloodBag toEntity(BloodBagDTO dto, Component component) {
        return BloodBag.builder()
                .bagId(dto.getBagId())
                .volume(dto.getVolume())
                .collectedDate(dto.getCollectedDate())
                .expirationDate(dto.getExpirationDate())
                .status(dto.getStatus())
                .component(component)
                .quantity(dto.getQuantity())
                .blood(bloodRepository.findByBloodCode(dto.getBloodCode())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm máu " + dto.getBloodCode())))
                .build();
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
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }
        if (dto.getComponentId() != null) {
            Component component = componentRepository.findById(dto.getComponentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Component với ID: " + dto.getComponentId()));
            existing.setComponent(component);
        }
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


    public List<BloodBagDTO> getAllBloodBags() {
        return bloodBagRepository.findAll()
                .stream()
                .map(BloodBagDTO::fromEntity)
                .collect(Collectors.toList());
    }


    public static String generateBloodBagId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int randomNum = new Random().nextInt(900) + 100; // 100–999
        return "BG-" + timestamp + "-" + randomNum;
    }
}
