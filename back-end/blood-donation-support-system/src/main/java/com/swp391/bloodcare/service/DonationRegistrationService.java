package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private BloodDonationHistoryService bloodDonationHistoryService;

    public DonationRegistrationService(DonationRegistrationRepository donationRegistrationRepository, AccountRepository accountRepository, EventRepository eventRepository, FeedbackRepository feedbackRepository) {
        this.donationRegistrationRepository = donationRegistrationRepository;
        this.accountRepository = accountRepository;
        this.eventRepository = eventRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public DonationRegistrationDTO createDonation(@Valid DonationRegistrationDTO dto, String accountId) {
        String eventId = dto.getEventId();
        LocalDate donationDate = dto.getDonationDate();
        validateDonation(accountId, donationDate, eventId, false);

        Account acc = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản"));

        BloodDonationEvent event = (eventId != null && !eventId.isBlank())
                ? eventRepository.findByEventId(eventId).orElse(null)
                : null;

        DonationRegistration reg = DonationRegistration.builder()
                .donationDate(donationDate)
                .account(acc)
                .event(event)
                .dateCreated(new Date())
                .status(DonationRegistration.Status.PENDING)
                .build();

        reg.setRegistrationId(generateUniqueIdWithRetry());

        try {
            DonationRegistration saved = donationRegistrationRepository.save(reg);
            //tạo lịch sử
            bloodDonationHistoryService.create(saved);
            return DonationRegistrationDTO.toDTO(saved);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lưu đơn đăng ký: " + e.getMessage(), e);
        }
    }

    private void validateDonation(String accountId, LocalDate donationDate, String eventId, boolean isUpdate) {
        LocalDate today = LocalDate.now();

        if (donationDate == null) {
            throw new IllegalArgumentException("Ngày hiến máu không được để trống");
        }

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

        if (!canRegister(accountId, donationDate)) {
            throw new IllegalStateException("Không đủ thời gian nghỉ giữa 2 lần hiến máu (tối thiểu 12 tuần)");
        }

        if (!isUpdate) {
            boolean hasPending = donationRegistrationRepository
                    .findByAccountAccountId(accountId)
                    .stream()
                    .anyMatch(reg -> reg.getStatus() == DonationRegistration.Status.PENDING);

            if (hasPending) {
                throw new IllegalStateException("Tài khoản đã có đơn hiến máu 'Đang đợi'. Không thể tạo thêm.");
            }
        }
    }

    private boolean canRegister(String accountId, LocalDate newDonationDate) {

        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản"));
        if (account.getProfile() == null) {
            throw new IllegalStateException("Tài khoản chưa tạo hồ sơ cá nhân. Vui lòng hoàn tất hồ sơ trước khi đăng ký hiến máu.");
        }

        List<DonationRegistration> completedRegs = donationRegistrationRepository
                .findByAccountAccountId(accountId).stream()
                .filter(reg -> reg.getStatus() == DonationRegistration.Status.PASSED)
                .sorted(Comparator.comparing(DonationRegistration::getDonationDate).reversed())
                .toList();

        if (completedRegs.isEmpty()) return true;

        LocalDate lastDonationDate = completedRegs.stream()
                .map(DonationRegistration::getDonationDate)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy lịch sử hiến máu"));
        LocalDate earliestAllowed = lastDonationDate.plusWeeks(12);
        return !newDonationDate.isBefore(earliestAllowed);
    }

    @Transactional
    public int autoCancelExpiredRegistrations() {
        LocalDate today = LocalDate.now();

        List<DonationRegistration> expiredRegistrations = donationRegistrationRepository.findAll().stream()
                .filter(reg -> reg.getStatus() == DonationRegistration.Status.PENDING)
                .filter(reg -> reg.getDonationDate().isBefore(today))
                .collect(Collectors.toList());

        for (DonationRegistration reg : expiredRegistrations) {
            reg.setStatus(DonationRegistration.Status.CANCELLED);
            bloodDonationHistoryService.create(reg); // cập nhật lại lịch sử tương ứng
        }


        donationRegistrationRepository.saveAll(expiredRegistrations);

        return expiredRegistrations.size(); // trả về số lượng đã cập nhật
    }

    private String generateUniqueIdWithRetry() {
        for (int i = 0; i < 5; i++) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int rand = new Random().nextInt(900) + 100;
            String id = "RD-" + timestamp + "-" + rand;

            if (!donationRegistrationRepository.existsByRegistrationId(id)) {
                return id;
            }
        }
        throw new RuntimeException("Không thể tạo ID duy nhất sau " + 5 + " lần thử");
    }

    public DonationRegistrationDTO updateStatusOnly(String id, DonationRegistration.Status newStatus) {
        DonationRegistration reg = donationRegistrationRepository.findByRegistrationId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn đăng ký với ID: " + id));

        reg.setStatus(newStatus);
        DonationRegistration saved = donationRegistrationRepository.save(reg);
        bloodDonationHistoryService.create(reg); // cập nhật lịch sử
        return DonationRegistrationDTO.toDTO(saved);
    }

    public DonationRegistrationDTO updateDonationDate(String id, LocalDate newDonationDate) {
        DonationRegistration reg = donationRegistrationRepository.findByRegistrationId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn đăng ký với ID: " + id));

        String accountId = reg.getAccount().getAccountId();
        String eventId = reg.getEvent() != null ? reg.getEvent().getEventId() : null;

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
        if (!accountRepository.existsByAccountId(accountId)) {
            throw new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + accountId);
        }

        if (!eventRepository.existsByEventId(eventId)) {
            throw new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + eventId);
        }

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
                throw e;
            } catch (Exception e) {
                errors.put(id, "Lỗi không xác định: " + e.getMessage());
                throw e;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("deleted", deleted);
        result.put("errors", errors);
        return result;
    }
}