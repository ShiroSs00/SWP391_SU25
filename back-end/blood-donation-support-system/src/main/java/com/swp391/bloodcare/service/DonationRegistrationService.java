package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class DonationRegistrationService {

    private final DonationRegistrationRepository donationRegistrationRepository;

    private final AccountRepository accountRepository;

    private final EventRepository eventRepository;


    public final FeedbackRepository feedbackRepository;


    public DonationRegistrationService(DonationRegistrationRepository donationRegistrationRepository, AccountRepository accountRepository, EventRepository eventRepository, FeedbackRepository feedbackRepository) {
        this.donationRegistrationRepository = donationRegistrationRepository;
        this.accountRepository = accountRepository;
        this.eventRepository = eventRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public DonationRegistrationDTO createDonation(DonationRegistrationDTO dto, String accountId) {
        String eventId = dto.getEventId();
        LocalDate donationDate = dto.getDonationDate();

        // ✅ Gọi hàm kiểm tra chung
        validateDonation(accountId, donationDate, eventId, false);

        // ✅ Lấy account & event
        Account acc = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản"));

        BloodDonationEvent event = (eventId != null && !eventId.isBlank())
                ? eventRepository.findByEventId(eventId).orElse(null)
                : null;

        // ✅ Tạo đơn
        DonationRegistration reg = DonationRegistration.builder()
                .donationDate(donationDate)
                .account(acc)
                .event(event)
                .status("Đang đợi")
                .build();

        reg.setRegistrationId(generateUniqueIdWithRetry(5));
        return DonationRegistrationDTO.toDTO(donationRegistrationRepository.save(reg));
    }

    private void validateDonation(String accountId, LocalDate donationDate, String eventId, boolean isUpdate) {
        LocalDate today = LocalDate.now();

        if (donationDate == null) {
            throw new IllegalArgumentException("Ngày hiến máu không được để trống");
        }

        // 1. Phạm vi ngày
        if (eventId != null && !eventId.isBlank()) {
            BloodDonationEvent event = eventRepository.findByEventId(eventId)
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + eventId));
            LocalDate endDate = event.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            if (donationDate.isBefore(today) || donationDate.isAfter(endDate)) {
                throw new IllegalArgumentException("Ngày hiến máu phải nằm trong khoảng từ hôm nay đến ngày kết thúc sự kiện");
            }
        } else {
            LocalDate max = today.plusDays(20);
            if (!donationDate.isAfter(today) || donationDate.isAfter(max)) {
                throw new IllegalArgumentException("Ngày hiến máu phải lớn hơn hôm nay và không quá 20 ngày tới");
            }
        }

        // 2. Khoảng cách giữa các lần hiến
        if (!canRegister(accountId, donationDate)) {
            throw new IllegalStateException("Không đủ thời gian nghỉ giữa 2 lần hiến máu (tối thiểu 12 tuần)");
        }

        // 3. Check trùng đơn đăng ký nếu là tạo mới
        if (!isUpdate) {
            if (eventId == null) {
                boolean hasPendingDirect = donationRegistrationRepository.findByAccountAccountId(accountId).stream()
                        .anyMatch(reg -> reg.getEvent() == null && "Đang đợi".equalsIgnoreCase(reg.getStatus()));
                if (hasPendingDirect) {
                    throw new IllegalStateException("Bạn đã có đơn đăng ký hiến máu trực tiếp đang xử lý");
                }
            } else {
                boolean registered = donationRegistrationRepository
                        .existsByAccount_AccountIdAndEvent_EventId(accountId, eventId);
                if (registered) {
                    throw new IllegalStateException("Bạn đã đăng ký sự kiện này rồi");
                }
            }
        }
    }



    private boolean canRegister(String accountId, LocalDate newDonationDate) {
        List<DonationRegistration> completedRegs = donationRegistrationRepository
                .findByAccountAccountId(accountId).stream()
                .filter(reg -> "Đã hoàn thành".equalsIgnoreCase(reg.getStatus()))
                .sorted((a, b) -> b.getDonationDate().compareTo(a.getDonationDate())) // lấy ngày hiến gần nhất
                .toList();

        if (completedRegs.isEmpty()) return true;

        LocalDate lastDonationDate = completedRegs.get(0).getDonationDate();
        LocalDate earliestAllowed = lastDonationDate.plusWeeks(12);

        // ❗ Kiểm tra ngày muốn hiến có >= 12 tuần sau lần gần nhất không
        return !newDonationDate.isBefore(earliestAllowed);
    }



    private String generateUniqueIdWithRetry(int maxTries) {
        for (int i = 0; i < maxTries; i++) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int rand = new Random().nextInt(900) + 100;
            String id = "RD-" + timestamp + "-" + rand;

            if (!donationRegistrationRepository.existsByRegistrationId(id)) {
                return id;
            }
        }
        throw new RuntimeException("Không thể tạo ID duy nhất sau " + maxTries + " lần thử");
    }


    public DonationRegistrationDTO updateStatusOnly(String id, String newStatus) {
        DonationRegistration reg = donationRegistrationRepository.findByRegistrationId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn đăng ký với ID: " + id));

        reg.setStatus(newStatus.trim());
        return DonationRegistrationDTO.toDTO(donationRegistrationRepository.save(reg));
    }

    public DonationRegistrationDTO updateDonationDate(String id, LocalDate newDonationDate) {
        DonationRegistration reg = donationRegistrationRepository.findByRegistrationId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn đăng ký với ID: " + id));

        String accountId = reg.getAccount().getAccountId();
        String eventId = reg.getEvent() != null ? reg.getEvent().getEventId() : null;

        // ✅ Gọi hàm kiểm tra chung
        validateDonation(accountId, newDonationDate, eventId, true);

        reg.setDonationDate(newDonationDate);
        return DonationRegistrationDTO.toDTO(donationRegistrationRepository.save(reg));
    }





    public void deleteDonationRegistration(String id) {
        DonationRegistration donorRegis = donationRegistrationRepository.findByRegistrationId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đăng ký với ID: " + id));
        donationRegistrationRepository.delete(donorRegis);
    }


    public List<DonationRegistrationDTO> getAllDonationRegistrations() {
        return donationRegistrationRepository.findAll()
                .stream()
                .map(DonationRegistrationDTO::toDTO)
                .collect(Collectors.toList());
    }

    public DonationRegistration getDonationRegistrationById(String id) {
        return donationRegistrationRepository.findByRegistrationId(id).orElse(null);
    }

    public List<DonationRegistrationDTO> getByAccountId(String accountId) {
        if (!accountRepository.existsByAccountId(accountId)) {
            throw new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + accountId);
        }

        List<DonationRegistrationDTO> result = donationRegistrationRepository.findByAccountAccountId(accountId)
                .stream()
                .map(DonationRegistrationDTO::toDTO)
                .collect(Collectors.toList());

        if (result.isEmpty()) {
            throw new EntityNotFoundException("Tài khoản \"" + accountId + "\" chưa đăng ký hiến máu lần nào.");
        }

        return result;
    }



    public List<DonationRegistrationDTO> getByEventId(String eventId) {
        if (!eventRepository.existsByEventId(eventId)) {
            throw new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + eventId);
        }

        List<DonationRegistrationDTO> result = donationRegistrationRepository.findByEventEventId(eventId)
                .stream()
                .map(DonationRegistrationDTO::toDTO)
                .collect(Collectors.toList());

        if (result.isEmpty()) {
            throw new EntityNotFoundException("Không tìm thấy đơn đăng ký nào cho sự kiện ID: " + eventId);
        }

        return result;
    }

    public List<DonationRegistrationDTO> getDirectDonationRegistrations() {
        return donationRegistrationRepository.findAll().stream()
                .filter(d -> d.getEvent() == null)
                .map(DonationRegistrationDTO::toDTO)
                .collect(Collectors.toList());
    }




    public List<DonationRegistrationDTO> getByAccountIdAndEventId(String accountId, String eventId) {
        // ⚠️ Kiểm tra account và event có tồn tại không
        if (!accountRepository.existsByAccountId(accountId)) {
            throw new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + accountId);
        }

        if (!eventRepository.existsByEventId(eventId)) {
            throw new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + eventId);
        }

        // ✅ Tìm các đơn đăng ký theo accountId + eventId
        List<DonationRegistrationDTO> result = donationRegistrationRepository
                .findByAccountAccountIdAndEventEventId(accountId, eventId)
                .stream()
                .map(DonationRegistrationDTO::toDTO)
                .collect(Collectors.toList());

        if (result.isEmpty()) {
            throw new EntityNotFoundException("Tài khoản \"" + accountId + "\" chưa đăng ký cho sự kiện \"" + eventId + "\".");
        }

        return result;
    }




    @Transactional
    public Map<String, Object> deleteMultipleDonationRegistrationsSafe(List<String> ids) {
        List<String> deleted = new ArrayList<>();
        Map<String, String> errors = new HashMap<>();

        for (String id : ids) {
            try {
                DonationRegistration existing = donationRegistrationRepository.findByRegistrationId(id)
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn đăng ký với ID: " + id));
                donationRegistrationRepository.delete(existing);
                deleted.add(id);
            } catch (EntityNotFoundException e) {
                errors.put(id, "Không tìm thấy đơn đăng ký");
                throw e; // ❗ phải ném ra lại nếu dùng @Transactional
            } catch (Exception e) {
                errors.put(id, "Lỗi không xác định: " + e.getMessage());
                throw e; // ❗ nếu không rollback-only sẽ xảy ra ngầm
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("deleted", deleted);
        result.put("errors", errors);
        return result;
    }


}
