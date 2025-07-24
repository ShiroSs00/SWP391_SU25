package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodBagDTO;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.entity.Component;
import com.swp391.bloodcare.repository.AfterDonationRepository;
import com.swp391.bloodcare.repository.BloodBagRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import com.swp391.bloodcare.repository.ComponentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodBagService {

    private final BloodBagRepository bloodBagRepository;
    private final ComponentRepository componentRepository;
    private final BloodRepository bloodRepository;
    private final AfterDonationRepository afterDonationRepository;

    @Transactional
    public BloodBagDTO createBloodBag(BloodBagDTO dto) {
        if (dto.getVolume() == null) {
            throw new IllegalArgumentException("Thể tích túi máu là bắt buộc (ML_250, ML_350, ML_450)");
        }

        Component component = componentRepository.findById(dto.getComponentId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Component với ID: " + dto.getComponentId()));

        Optional<BloodBag> existingOpt = bloodBagRepository.findByMatchingAttributes(
                dto.getBloodCode(), BloodBag.Volume.fromInt(dto.getVolume()), dto.getExpirationDate(), component
        );

        if (existingOpt.isPresent()) {
            BloodBag existing = existingOpt.get();
            BloodBag updated = bloodBagRepository.save(existing);
            return BloodBagDTO.fromEntity(updated);
        } else {
            String newId;
            do {
                newId = generateBloodBagId();
            } while (bloodBagRepository.existsByBagId(newId));

            BloodBag entity = convertToEntity(dto, component);
            entity.setBagId(newId);

            if (dto.getExpirationDate() != null && dto.getExpirationDate().before(new Date())) {
                entity.setStatus(BloodBag.Status.EXPIRED);
            } else {
                entity.setStatus(dto.getStatus() != null ? dto.getStatus() : BloodBag.Status.VALID);
            }

            entity.setComponent(component);
            BloodBag saved = bloodBagRepository.save(entity);
            autoUpdateExpiredStatus();
            return BloodBagDTO.fromEntity(saved);
        }
    }

    @Transactional
    public List<BloodBagDTO> importFromExcel(MultipartFile file) {
        List<BloodBagDTO> importedList = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) continue;

                try {
                    BloodBagDTO dto = parseRowToDTO(row);
                    BloodBagDTO saved = createBloodBag(dto); // dùng lại logic đã có
                    importedList.add(saved);
                } catch (Exception ex) {
                    // Log lỗi từng dòng, hoặc gom lỗi lại nếu muốn
                    System.err.println("Lỗi tại dòng " + (rowIndex + 1) + ": " + ex.getMessage());
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi đọc file Excel: " + e.getMessage());
        }

        return importedList;
    }

    private BloodBagDTO parseRowToDTO(Row row) {
        DataFormatter formatter = new DataFormatter();

        String bloodCode = formatter.formatCellValue(row.getCell(0));           // Nhóm máu
        int volume = Integer.parseInt(formatter.formatCellValue(row.getCell(1))); // 250/350/450
        String componentId = formatter.formatCellValue(row.getCell(2));         // TP-HC/TP-HH...
        String collectedStr = formatter.formatCellValue(row.getCell(3));        // yyyy-MM-dd
        String expirationStr = formatter.formatCellValue(row.getCell(4));
        String afterDonationId = formatter.formatCellValue(row.getCell(5));     // ID afterDonation

        Date collectedDate = java.sql.Date.valueOf(collectedStr);
        Date expirationDate = java.sql.Date.valueOf(expirationStr);

        return BloodBagDTO.builder()
                .bloodCode(bloodCode)
                .volume(volume)
                .componentId(componentId)
                .collectedDate(collectedDate)
                .expirationDate(expirationDate)
                .afterDonationId(afterDonationId)
                .build();
    }


    @Scheduled(cron = "0 0 0 * * ?") // Chạy mỗi ngày lúc 0h
    @Transactional
    public int autoUpdateExpiredStatus() {

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        Date todayDate = Date.from(today.atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant());

        List<BloodBag> allBags = bloodBagRepository.findAll();
        int updatedCount = 0;

        for (BloodBag bag : allBags) {
            if (bag.getExpirationDate().before(todayDate) && bag.getStatus() != BloodBag.Status.EXPIRED) {
                bag.setStatus(BloodBag.Status.EXPIRED);
                updatedCount++;
            }
            else if (!bag.getExpirationDate().before(todayDate) && bag.getStatus() != BloodBag.Status.VALID) {
                bag.setStatus(BloodBag.Status.VALID);
                updatedCount++;
            }
        }

        bloodBagRepository.saveAll(allBags);
        return updatedCount;
    }


    private BloodBag convertToEntity(BloodBagDTO dto, Component component) {
        return BloodBag.builder()
                .bagId(dto.getBagId())
                .volume(BloodBag.Volume.fromInt(dto.getVolume()))
                .collectedDate(dto.getCollectedDate())
                .expirationDate(dto.getExpirationDate())
                .status(dto.getStatus())
                .component(component)
                .blood(bloodRepository.findByBloodCode(dto.getBloodCode())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm máu " + dto.getBloodCode())))
                .afterDonationBlood(afterDonationRepository.findById(dto.getAfterDonationId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy AfterDonationBlood với ID: " + dto.getAfterDonationId())))
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

    @Transactional
    public BloodBagDTO updateBloodBag(BloodBagDTO dto) {
        BloodBag existing = bloodBagRepository.findByBagId(dto.getBagId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy túi máu có ID: " + dto.getBagId()));

        if (dto.getVolume() != null) existing.setVolume(BloodBag.Volume.fromInt(dto.getVolume()));
        if (dto.getCollectedDate() != null) existing.setCollectedDate(dto.getCollectedDate());
        if (dto.getExpirationDate() != null) {
            existing.setExpirationDate(dto.getExpirationDate());
            if (dto.getExpirationDate().before(new Date())) {
                existing.setStatus(BloodBag.Status.EXPIRED);
            }
        }

        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        if (dto.getComponentId() != null) {
            Component component = componentRepository.findById(dto.getComponentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Component với ID: " + dto.getComponentId()));
            existing.setComponent(component);
        }

        autoUpdateExpiredStatus();
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
