package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodBagDTO;
import com.swp391.bloodcare.entity.AfterDonationBlood;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.entity.WaitingList;
import com.swp391.bloodcare.repository.AfterDonationRepository;
import com.swp391.bloodcare.repository.BloodBagRepository;
import com.swp391.bloodcare.repository.WaitingListRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodBagService {

    private final BloodBagRepository bloodBagRepository;
    private final WaitingListRepository waitingListRepository;
    private final AfterDonationRepository afterDonationRepository;

    public BloodBagDTO createBloodBag(BloodBagDTO dto) {
        // Tạo ID duy nhất
        String newId;
        do {
            newId = generateBloodBagId();
        } while (bloodBagRepository.existsByBagId(newId));

        BloodBag entity = BloodBagDTO.toEntity(dto);
        entity.setBagId(newId);
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "Available");

        // Gán WaitingList nếu có
        if (dto.getWaitingListId() != null) {
            WaitingList waitingList = waitingListRepository.findById(dto.getWaitingListId())
                    .orElseThrow(() -> new EntityNotFoundException("Waiting list not found"));
            entity.setWaitingList(waitingList);
        }

        // Gán AfterDonationBlood nếu có
        if (dto.getAfterDonationId() != null) {
            AfterDonationBlood afterDonationBlood = afterDonationRepository.findAfterDonationBloodByIdAfterDonation(dto.getAfterDonationId())
                    .orElseThrow(() -> new EntityNotFoundException("After donation not found"));
            entity.setAfterDonationBlood(afterDonationBlood);
            afterDonationBlood.setBloodBag(entity); // quan trọng nếu dùng mappedBy
        }

        BloodBag saved = bloodBagRepository.save(entity);
        return BloodBagDTO.fromEntity(saved);
    }


    public static String generateBloodBagId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int randomNum = new Random().nextInt(900) + 100; // 100-999
        return "BG-" + timestamp + "-" + randomNum;
    }

    public BloodBagDTO updateBloodBag(String bagId, BloodBagDTO dto) {
        BloodBag existing = bloodBagRepository.findByBagId(bagId)
                .orElseThrow(() -> new EntityNotFoundException("Blood bag not found"));

        existing.setVolume(dto.getVolume());
        existing.setCollectedDate(dto.getCollectedDate());
        existing.setExpirationDate(dto.getExpirationDate());
        existing.setStatus(dto.getStatus());

        if (dto.getWaitingListId() != null) {
            WaitingList waitingList = waitingListRepository.findById(dto.getWaitingListId())
                    .orElseThrow(() -> new EntityNotFoundException("Waiting list not found"));
            existing.setWaitingList(waitingList);
        } else {
            existing.setWaitingList(null);
        }

        BloodBag saved = bloodBagRepository.save(existing);
        return BloodBagDTO.fromEntity(saved);
    }

    public void deleteBloodBag(String bagId) {
        if (!bloodBagRepository.existsByBagId(bagId)) {
            throw new EntityNotFoundException("Blood bag not found");
        }
        bloodBagRepository.deleteBloodBagBybagId(bagId);
    }

    public BloodBagDTO findByAfterDonationId(String afterDonationId) {
        BloodBag bag = bloodBagRepository.findByAfterDonationBlood_IdAfterDonation(afterDonationId)
                .orElseThrow(() -> new EntityNotFoundException("Blood bag not found by after donation ID"));
        return BloodBagDTO.fromEntity(bag);
    }

    public List<BloodBagDTO> getAllBloodBags() {
        return bloodBagRepository.findAll()
                .stream()
                .map(BloodBagDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
