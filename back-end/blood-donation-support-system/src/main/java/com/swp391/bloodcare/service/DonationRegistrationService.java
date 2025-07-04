package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class DonationRegistrationService {

    private final DonationRegistrationRepository donationRegistrationRepository;

    private final AccountRepository accountRepository;

    private final EventRepository eventRepository;


    public final FeedbackRepository feedbackRepository;

    private final BloodDonationHistoryService bloodDonationHistoryService;

    public DonationRegistrationService(DonationRegistrationRepository donationRegistrationRepository, AccountRepository accountRepository, EventRepository eventRepository, FeedbackRepository feedbackRepository, BloodDonationHistoryService bloodDonationHistoryService) {
        this.donationRegistrationRepository = donationRegistrationRepository;
        this.accountRepository = accountRepository;
        this.eventRepository = eventRepository;
        this.feedbackRepository = feedbackRepository;
        this.bloodDonationHistoryService = bloodDonationHistoryService;
    }

    public DonationRegistrationDTO createDonation(DonationRegistrationDTO dto, String accountId, String eventId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản"));

        // ⛔ Thiếu donationDate thì không tạo
        if (dto.getDonationDate() == null) {
            throw new IllegalArgumentException("Phải chọn ngày hiến máu");
        }

        // ✅ Kiểm tra đủ 12 tuần giữa lần hiến gần nhất và ngày muốn hiến mới
        if (!canRegister(accountId, dto.getDonationDate())) {
            throw new IllegalStateException("Bạn chưa đủ thời gian nghỉ giữa 2 lần hiến máu (tối thiểu 12 tuần)");
        }

        // ⛔ Nếu là hiến trực tiếp → không được có đơn đang xử lý
        boolean hasDirectPending = donationRegistrationRepository.findByAccountAccountId(accountId).stream()
                .anyMatch(reg -> reg.getEvent() == null && "Đang đợi".equalsIgnoreCase(reg.getStatus()));
        if (eventId == null && hasDirectPending) {
            throw new IllegalStateException("Bạn đã có đơn đăng ký hiến máu trực tiếp đang xử lý");
        }

        // ⛔ Nếu là sự kiện → kiểm tra trùng đơn
        if (eventId != null) {
            boolean alreadyRegistered = donationRegistrationRepository
                    .existsByAccount_AccountIdAndEvent_EventId(accountId, eventId);
            if (alreadyRegistered) {
                throw new IllegalStateException("Bạn đã đăng ký sự kiện này rồi");
            }
        }

        // ✅ Tạo đơn
        DonationRegistration reg = new DonationRegistration();
        reg.setRegistrationId(generateUniqueIdWithRetry(5));
        reg.setDateCreated(new Date());
        reg.setStatus("Đang đợi");
        reg.setDonationDate(dto.getDonationDate());
        reg.setAccount(account);

        if (eventId != null) {
            BloodDonationEvent event = eventRepository.findByEventId(eventId)
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện"));
            reg.setEvent(event);
        }

        DonationRegistration saved = donationRegistrationRepository.save(reg);
        bloodDonationHistoryService.create(saved);

        return DonationRegistrationDTO.toDTO(saved);
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
        if (newDonationDate == null || newDonationDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Ngày hiến máu không hợp lệ hoặc lớn hơn hiện tại");
        }

        DonationRegistration reg = donationRegistrationRepository.findByRegistrationId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn đăng ký với ID: " + id));

        // ⚠ Kiểm tra đủ 12 tuần trước ngày mới này không
        if (!canRegister(reg.getAccount().getAccountId(), newDonationDate)) {
            throw new IllegalStateException("Không đủ thời gian nghỉ giữa 2 lần hiến máu (tối thiểu 12 tuần)");
        }

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
