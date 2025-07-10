package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.AfterDonationBloodDTO;
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
import static com.swp391.bloodcare.dto.AfterDonationBloodDTO.toDTO;
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

    public AfterDonationService(
            AfterDonationRepository afterRepo,
            HealthCheckRepository healthCheckRepo,
            BloodRepository bloodRepo,
            BloodDonationHistoryService bloodDonationHistoryService,
            ProfileRepository profileRepo,
            BloodBagRepository bloodBagRepo,
            ComponentRepository componentRepository) {
        this.afterRepo = afterRepo;
        this.healthCheckRepo = healthCheckRepo;
        this.bloodRepo = bloodRepo;
        this.bloodDonationHistoryService = bloodDonationHistoryService;
        this.profileRepo = profileRepo;
        this.bloodBagRepo = bloodBagRepo;
        this.componentRepository = componentRepository;
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

        return toDTO(afterRepo.save(entity));
    }

    @Transactional
    public Map<String, Object> separateManually(List<String> afterDonationIds) {
        Map<String, String> result = new HashMap<>();

        for (String id : afterDonationIds) {
            AfterDonationBlood after = afterRepo.findAfterDonationBloodByIdAfterDonation(id)
                    .orElse(null);

            if (after == null) {
                result.put(id, "Không tìm thấy đơn máu");
                continue;
            }

            if (after.getStatus() == AfterDonationBlood.Status.SEPARATED) {
                result.put(id, "Đã được tách trước đó");
                continue;
            }

            if (!Boolean.TRUE.equals(after.getIsBloodUsable())) {
                result.put(id, "Máu không đạt chất lượng");
                continue;
            }

            LocalDateTime createdAt = after.getHealthCheck()
                    .getDonationRegistration()
                    .getDateCreated()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            // ❌ Nếu quá 24h thì không cho tách nữa
            if (Duration.between(createdAt, LocalDateTime.now()).toHours() > 24) {
                result.put(id, "Đã quá thời gian tách, máu sẽ được xử lý tự động");
                continue;
            }

            List<BloodBag> bags = createSeparatedBags(after);
            bloodBagRepo.saveAll(bags);
            after.setStatus(AfterDonationBlood.Status.SEPARATED);
            afterRepo.save(after);
            result.put(id, "Đã tách thành công thành phần máu");
        }

        return Map.of("result", result);
    }




    private String generateAfterDonationId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int rand = new Random().nextInt(900) + 100;
        return "AD-" + timestamp + "-" + rand;
    }


    private List<BloodBag> createSeparatedBags(AfterDonationBlood after) {
        String[][] components = {
                {"102", "125", "42"},    // Hồng cầu
                {"103", "60", "5"},      // Tiểu cầu
                {"104", "65", "365"}     // Huyết tương
        };

        List<BloodBag> bags = new ArrayList<>();
        for (String[] c : components) {
            Component component = componentRepository.findById(c[0]).orElseThrow();
            int volume = Integer.parseInt(c[1]);
            int expire = Integer.parseInt(c[2]);

            BloodBag bag = BloodBag.builder()
                    .bagId(generateBloodBagId())
                    .blood(after.getBlood())
                    .volume(BloodBag.Volume.fromInt(volume))
                    .component(component)
                    .expirationDate(java.sql.Date.valueOf(LocalDate.now().plusDays(expire)))
                    .collectedDate(new Date())
                    .status(BloodBag.Status.VALID)
                    .build();

            bags.add(bag);
        }

        return bags;
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
            profile.setNumberOfBloodDonation(profile.getNumberOfBloodDonation() + 1);
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

}