package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.AfterDonationBlood;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.entity.BloodMatchRequest;
import com.swp391.bloodcare.repository.AfterDonationRepository;
import com.swp391.bloodcare.repository.BloodBagRepository;
import com.swp391.bloodcare.repository.BloodMatchRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AfterDonationBloodService {

    private final AfterDonationRepository afterRepo;
    private final BloodBagRepository bagRepo;
    private final BloodMatchRequestRepository matchRepo;

    public AfterDonationBloodService(
            AfterDonationRepository afterRepo,
            BloodBagRepository bagRepo,
            BloodMatchRequestRepository matchRepo
    ) {
        this.afterRepo = afterRepo;
        this.bagRepo = bagRepo;
        this.matchRepo = matchRepo;
    }

    public AfterDonationBlood updateAfterDonation(Long id, AfterDonationBlood updated) {
        AfterDonationBlood existing = afterRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phiếu xét nghiệm"));

        // cập nhật các field...
        existing.setVolume(updated.getVolume());
        existing.setBloodType(updated.getBloodType());
        existing.setReadyToBag(updated.isReadyToBag());

        AfterDonationBlood saved = afterRepo.save(existing);

        // Nếu đã sẵn sàng -> tạo túi máu
        if (saved.isReadyToBag() && saved.getBloodBag() == null) {
            createBloodBagFromAfter(saved);
        }

        return saved;
    }

    private void createBloodBagFromAfter(AfterDonationBlood after) {
        BloodBag bag = BloodBag.builder()
                .bagId(generateBagId())
                .iADB(1)
                .volume(after.getVolume())
                .donorId(after.getDonorId())
                .collectedDate(new Date())
                .expirationDate(generateExpirationDate())
                .isUsed(false)
                .afterDonationBlood(after)
                .build();

        // Tìm yêu cầu ghép máu phù hợp để gán
        BloodMatchRequest matchRequest = matchRepo
                .findFirstByBloodTypeAndStatus(after.getBloodType(), "PENDING")
                .orElse(null);

        if (matchRequest != null) {
            bag.setBloodMatchRequest(matchRequest);
        }

        bagRepo.save(bag);
    }

    private Long generateBagId() {
        return System.currentTimeMillis(); // Tùy cách generate
    }

    private Date generateExpirationDate() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, 30);
        return cal.getTime();
    }
}
