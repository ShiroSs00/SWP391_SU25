package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import static com.swp391.bloodcare.dto.DonationRegistrationDTO.toDTO;


@Service
public class DonationRegistrationService {

    private final DonationRegistrationRepository donationRegistrationRepository;

    private final AccountRepository accountRepository;

    private final HealthCheckRepository healthCheckRepository;

    private final ComponentRepository componentRepository;

    private final EventRepository eventRepository;

    public final FeedbackRepository feedbackRepository;

    public DonationRegistrationService(DonationRegistrationRepository donationRegistrationRepository, AccountRepository accountRepository, HealthCheckRepository healthCheckRepository, ComponentRepository componentRepository, EventRepository eventRepository, FeedbackRepository feedbackRepository) {
        this.donationRegistrationRepository = donationRegistrationRepository;
        this.accountRepository = accountRepository;
        this.healthCheckRepository = healthCheckRepository;
        this.componentRepository = componentRepository;
        this.eventRepository = eventRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public DonationRegistrationDTO createDonationByUsername(String accountId, String eventId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String donationId;
        do {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = new Random().nextInt(1000);
            String randomPart = String.format("%03d", randomCode);
            donationId = "RD-" + timestamp + "-" + randomPart;
        } while (donationRegistrationRepository.existsByRegistrationId(donationId));

        DonationRegistration donationRegistration = new DonationRegistration();
        donationRegistration.setRegistrationId(donationId);
        donationRegistration.setDateCreated(new Date());
        donationRegistration.setStatus("Đang đợi");
        donationRegistration.setAccount(account);

        // Chỉ gán sự kiện nếu eventId không null và tồn tại
        if (eventId != null && !eventId.isBlank()) {
            BloodDonationEvent event = eventRepository.findByEventId(eventId)
                    .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));
            donationRegistration.setEvent(event);
        }

        return toDTO(donationRegistrationRepository.save(donationRegistration));
    }


    public DonationRegistrationDTO updateDonationRegistration(String id, DonationRegistrationDTO dto) {
        DonationRegistration existing = donationRegistrationRepository.findByRegistrationId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đăng ký với ID: " + id));

        if (dto.getDateCreated() != null) {
            existing.setDateCreated(dto.getDateCreated());
        }

        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            existing.setStatus(dto.getStatus());
        }

        if (dto.getEventId() != null) {
            BloodDonationEvent event = eventRepository.findByEventId(dto.getEventId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện"));
            existing.setEvent(event);
        }

        if (dto.getAccountId() != null) {
            Account account = accountRepository.findByAccountId(dto.getAccountId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản"));
            existing.setAccount(account);
        }

        if (dto.getComponentId() != null) {
            Component component = componentRepository.findComponentByComponent(dto.getComponentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thành phần"));
            existing.setComponent(component);
        }

        if (dto.getHealthCheckId() != null) {
            HealthCheck healthCheck = healthCheckRepository.findByHealthCheckId(dto.getHealthCheckId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khám sức khỏe"));
            existing.setHealthCheck(healthCheck);
        }

        if (dto.getDonorFeedbackId() != null) {
            DonorFeedback feedback = feedbackRepository.findDonorFeedbackByFeedbackID(dto.getDonorFeedbackId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phản hồi người hiến"));
            existing.setDonorFeedback(feedback);
        }

        DonationRegistration saved = donationRegistrationRepository.save(existing);
        return DonationRegistrationDTO.toDTO(saved);
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
        // ⚠️ Kiểm tra account tồn tại
        if (!accountRepository.existsByAccountId(accountId)) {
            throw new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + accountId);
        }

        // ✅ Lấy các đơn đăng ký
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
