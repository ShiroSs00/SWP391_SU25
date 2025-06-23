package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AfterDonationBloodDTO;
import com.swp391.bloodcare.entity.AfterDonationBlood;
import com.swp391.bloodcare.entity.Blood;
import com.swp391.bloodcare.entity.HealthCheck;
import com.swp391.bloodcare.repository.AfterDonationRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import com.swp391.bloodcare.repository.HealthCheckRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

import static com.swp391.bloodcare.dto.AfterDonationBloodDTO.toDTO;

@Service
public class AfterDonationService {
    private final AfterDonationRepository afterRepo;
    private final HealthCheckRepository healthCheckRepo;
    private final BloodRepository bloodRepo;

    public AfterDonationService(AfterDonationRepository afterRepo, HealthCheckRepository healthCheckRepo, BloodRepository bloodRepo) {
        this.afterRepo = afterRepo;
        this.healthCheckRepo = healthCheckRepo;
        this.bloodRepo = bloodRepo;
    }

    public List<AfterDonationBloodDTO> getAll() {
        return afterRepo.findAll().stream().map(AfterDonationBloodDTO::toDTO).toList();
    }

    @Transactional
    public AfterDonationBloodDTO create(String healthCheckId, AfterDonationBloodDTO dto) {
        HealthCheck healthCheck = healthCheckRepo.findByHealthCheckId(healthCheckId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy HealthCheck"));

        if (afterRepo.findByHealthCheck_HealthCheckId(healthCheckId).isPresent()) {
            throw new IllegalStateException("Đã tồn tại dữ liệu sau hiến cho HealthCheck này");
        }

        AfterDonationBlood entity = AfterDonationBloodDTO.toEntity(dto);
        entity.setIdAfterDonation(generateId());
        entity.setHealthCheck(healthCheck);

        if (dto.getBloodId() != null) {
            Blood blood = bloodRepo.findByBloodCode(dto.getBloodId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blood"));
            entity.setBlood(blood);
        }

        return toDTO(afterRepo.save(entity));
    }

    @Transactional
    public AfterDonationBloodDTO updateById(String idAfterDonation, AfterDonationBloodDTO dto) {
        AfterDonationBlood existing = afterRepo.findAfterDonationBloodByIdAfterDonation(idAfterDonation)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi AfterDonation"));

        if (dto.getInfectiousDiseasesChecked() != null)
            existing.setInfectiousDiseasesChecked(dto.getInfectiousDiseasesChecked());
        if (dto.getIsBloodUsable() != null)
            existing.setBloodUsable(dto.getIsBloodUsable());
        if (dto.getStatus() != null)
            existing.setStatus(dto.getStatus());
        if (dto.getNote() != null && !dto.getNote().isBlank())
            existing.setNote(dto.getNote());

        return toDTO(afterRepo.save(existing));
    }

    @Transactional
    public AfterDonationBloodDTO delete(String id) {
        AfterDonationBlood existing = afterRepo.findAfterDonationBloodByIdAfterDonation(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi để xóa"));
        afterRepo.delete(existing);
        return toDTO(existing);
    }

    public Map<String, Object> deleteMultiple(List<String> ids) {
        List<String> deleted = new ArrayList<>();
        Map<String, String> errors = new HashMap<>();

        for (String id : ids) {
            try {
                AfterDonationBlood existing = afterRepo.findAfterDonationBloodByIdAfterDonation(id)
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy ID: " + id));
                afterRepo.delete(existing);
                deleted.add(id);
            } catch (Exception e) {
                errors.put(id, e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("deleted", deleted);
        result.put("errors", errors);
        return result;
    }

    public AfterDonationBloodDTO getByHealthCheckId(String healthCheckId) {
        AfterDonationBlood entity = afterRepo.findByHealthCheck_HealthCheckId(healthCheckId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi cho healthCheck"));
        return toDTO(entity);
    }

    private String generateId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int rand = new Random().nextInt(900) + 100;
        return "AD-" + timestamp + "-" + rand;
    }
}
