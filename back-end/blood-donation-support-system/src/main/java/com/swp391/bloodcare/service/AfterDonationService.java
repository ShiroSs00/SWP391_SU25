package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AfterDonationBloodDTO;
import com.swp391.bloodcare.dto.BloodBagDTO;
import com.swp391.bloodcare.dto.request.BloodBagCreateRequest;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import static com.swp391.bloodcare.service.BloodBagService.generateBloodBagId;

@Service
public class AfterDonationService {
    private final AfterDonationRepository afterRepo;
    private final HealthCheckRepository healthCheckRepo;
    private final BloodRepository bloodRepo;
    private final BloodDonationHistoryService bloodDonationHistoryService;
    private final ProfileRepository profileRepo;
    private final BloodBagRepository bloodBagRepo;
    private final ComponentRepository componentRepository;
   private final ProfileService profileService;

    public AfterDonationService(
            AfterDonationRepository afterRepo,
            HealthCheckRepository healthCheckRepo,
            BloodRepository bloodRepo,
            BloodDonationHistoryService bloodDonationHistoryService,
            ProfileRepository profileRepo,
            BloodBagRepository bloodBagRepo,
            ComponentRepository componentRepository,
            ProfileService profileService   ) {
        this.afterRepo = afterRepo;
        this.healthCheckRepo = healthCheckRepo;
        this.bloodRepo = bloodRepo;
        this.bloodDonationHistoryService = bloodDonationHistoryService;
        this.profileRepo = profileRepo;
        this.bloodBagRepo = bloodBagRepo;
        this.componentRepository = componentRepository;
        this.profileService = profileService;
    }
    public List<AfterDonationBloodDTO> getAll() {
        return afterRepo.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional
    public AfterDonationBloodDTO create(AfterDonationBloodDTO dto) {
        HealthCheck healthCheck = healthCheckRepo.findByHealthCheckId(dto.getHealthCheckId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy HealthCheck"));

        if (afterRepo.findByHealthCheck_HealthCheckId(dto.getHealthCheckId()).isPresent()) {
            throw new IllegalStateException("Đã tồn tại dữ liệu sau hiến cho HealthCheck này");
        }

        AfterDonationBlood entity = toEntity(dto);
        entity.setIdAfterDonation(generateAfterDonationId());
        entity.setHealthCheck(healthCheck);
        entity.setStatus(AfterDonationBlood.Status.PENDING);

        if (dto.getBloodId() != null) {
            Blood blood = bloodRepo.findByBloodCode(dto.getBloodId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blood"));

            Profile profile = healthCheck.getDonationRegistration().getAccount().getProfile();
            if(profile.getBloodCode() == null){
                profile.setBloodCode(blood);
                profileRepo.save(profile);
            }

            entity.setBlood(blood);
        }
        bloodDonationHistoryService.updateFromAfterDonation(entity);

        return toDTO(afterRepo.save(entity));
    }

    @Transactional
    public Map<String, Object> separateManually(BloodBagCreateRequest request) {
        Map<String, String> result = new HashMap<>();

        // Kiểm tra các đơn máu
        for (String id : request.getAfterDonationIds()) {
            AfterDonationBlood after = afterRepo.findAfterDonationBloodByIdAfterDonation(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn máu: " + id));

            if (after.getStatus() != AfterDonationBlood.Status.PASSED) {
                throw new IllegalStateException("Đơn máu " + id + " không hợp lệ hoặc đã được tách trước đó ");
            }
        }

        // Kiểm tra các thành phần và nhóm máu
        for (BloodBagDTO dto : request.getBloodBags()) {
            if (!componentRepository.existsById(dto.getComponentId())) {
                throw new IllegalArgumentException("Không tìm thấy thành phần máu: " + dto.getComponentId());
            }

            if (!bloodRepo.existsById(dto.getBloodCode())) {
                throw new IllegalArgumentException("Không tìm thấy nhóm máu: " + dto.getBloodCode());
            }
        }

        // Cập nhật trạng thái các đơn máu
        for (String id : request.getAfterDonationIds()) {
            AfterDonationBlood after = afterRepo.findAfterDonationBloodByIdAfterDonation(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn máu: " + id));
            after.setStatus(AfterDonationBlood.Status.SEPARATED);
            afterRepo.save(after);
            bloodDonationHistoryService.updateFromAfterDonation(after); // cập nhật lịch sử
            result.put(id, "Cập nhật trạng thái: ĐÃ TÁCH");
        }

        // Tạo các túi máu
        for (BloodBagDTO dto : request.getBloodBags()) {
            Blood blood = bloodRepo.findById(dto.getBloodCode())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhóm máu: " + dto.getBloodCode()));

            Component component = componentRepository.findById(dto.getComponentId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thành phần máu: " + dto.getComponentId()));

            if (dto.getCollectedDate() == null) {
                throw new IllegalArgumentException("Ngày tách máu (collectedDate) không được để trống");
            }

            LocalDate collectedDate = dto.getCollectedDate().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();

            LocalDate expirationDate = collectedDate.plusDays(component.getExpirationDays());

            BloodBag.Status status = expirationDate.isBefore(LocalDate.now())
                    ? BloodBag.Status.EXPIRED
                    : BloodBag.Status.VALID;

            BloodBag bag = BloodBag.builder()
                    .bagId(generateBloodBagId())
                    .volume(dto.getVolume())
                    .collectedDate(dto.getCollectedDate())
                    .expirationDate(java.sql.Date.valueOf(expirationDate))
                    .component(component)
                    .status(status)
                    .blood(blood)
                    .quantity(dto.getQuantity())
                    .build();

            bloodBagRepo.save(bag);
        }

        return Map.of("message", "Đã tách thành công các túi máu thủ công", "after", result);
    }







    private String generateAfterDonationId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int rand = new Random().nextInt(900) + 100;
        return "AD-" + timestamp + "-" + rand;
    }




    @Transactional
    public void autoSeparateExpired() {
        List<AfterDonationBlood> afterList = afterRepo.findAll();

        for (AfterDonationBlood after : afterList) {
            if (after.getStatus() == AfterDonationBlood.Status.SEPARATED) continue;
            if (!Boolean.TRUE.equals(after.getIsBloodUsable())) continue;

            LocalDateTime createdAt = after.getHealthCheck()
                    .getDonationRegistration()
                    .getDateCreated()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            if (Duration.between(createdAt, LocalDateTime.now()).toHours() > 24) {
                Component component = componentRepository.findById("101").orElseThrow();
                BloodBag wholeBag = BloodBag.builder()
                        .bagId(generateBloodBagId())
                        .blood(after.getBlood())
                        .volume(BloodBag.Volume.ML_250)
                        .component(component)
                        .expirationDate(java.sql.Date.valueOf(LocalDate.now().plusDays(35)))
                        .collectedDate(new Date())
                        .status(BloodBag.Status.VALID)
                        .build();

                bloodBagRepo.save(wholeBag);
                after.setStatus(AfterDonationBlood.Status.SEPARATED);
                afterRepo.save(after);
                bloodDonationHistoryService.updateFromAfterDonation(after);
            }
        }
    }


    @Transactional
    public AfterDonationBloodDTO updateById(String idAfterDonation, AfterDonationBloodDTO dto) {
        AfterDonationBlood existing = afterRepo.findAfterDonationBloodByIdAfterDonation(idAfterDonation)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản ghi AfterDonation"));

        if (dto.getInfectiousDiseasesChecked() != null)
            existing.setInfectiousDiseasesChecked(dto.getInfectiousDiseasesChecked());
        if (dto.getIsBloodUsable() != null)
            existing.setIsBloodUsable(dto.getIsBloodUsable());
        if (dto.getStatus() != null)
            existing.setStatus(dto.getStatus());
        if (dto.getNote() != null && !dto.getNote().isBlank())
            existing.setNote(dto.getNote());
        bloodDonationHistoryService.updateFromAfterDonation(existing);

        Profile profile = existing.getHealthCheck().getDonationRegistration().getAccount().getProfile();

        if("PASS".equalsIgnoreCase(dto.getStatus().name())){
            String accountId = profile.getAccount().getAccountId();
            profileService.increaseBloodDonationCount(accountId);
            if(existing.getBlood() != null){
                profile.setRestDate(LocalDate.now().plusDays(84));
            }
        }

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

    private AfterDonationBlood toEntity(AfterDonationBloodDTO dto) {
        AfterDonationBlood entity = new AfterDonationBlood();
        entity.setInfectiousDiseasesChecked(dto.getInfectiousDiseasesChecked());
        entity.setIsBloodUsable(dto.getIsBloodUsable());
        entity.setStatus(dto.getStatus());
        entity.setHealthCheck(
                healthCheckRepo.findByHealthCheckId(dto.getHealthCheckId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy HealthCheck với ID: " + dto.getHealthCheckId()))
        );
        entity.setNote(dto.getNote());
        return entity;
    }

    private AfterDonationBloodDTO toDTO(AfterDonationBlood entity) {
        AfterDonationBloodDTO dto = new AfterDonationBloodDTO();
        dto.setIdAfterDonation(entity.getIdAfterDonation());
        dto.setInfectiousDiseasesChecked(entity.getInfectiousDiseasesChecked());
        dto.setIsBloodUsable(entity.getIsBloodUsable());
        dto.setStatus(entity.getStatus());
        dto.setNote(entity.getNote());
        if (entity.getHealthCheck() != null)
            dto.setHealthCheckId(entity.getHealthCheck().getHealthCheckId());
        if (entity.getBlood() != null)
            dto.setBloodId(entity.getBlood().getBloodCode());
        return dto;
    }
}