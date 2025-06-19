package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.DonationRegistrationDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.DonationRegistrationRepository;
import com.swp391.bloodcare.repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import static com.swp391.bloodcare.dto.DonationRegistrationDTO.toDTO;


@Service
public class DonationRegistrationService {

    @Autowired
    private DonationRegistrationRepository donationRegistrationRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private EventRepository eventRepository;

    public DonationRegistrationDTO createDonationByUsername(String username, String eventId) {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String donationId;
        do {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = new Random().nextInt(1000); // 0–999
            String randomPart = String.format("%03d", randomCode);
            donationId = "RD-" + timestamp + "-" + randomPart;
        } while (donationRegistrationRepository.existsByRegistrationId(donationId));

        BloodDonationEvent event = eventRepository.findByEventId(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));

        DonationRegistration donationRegistration = new DonationRegistration();
        donationRegistration.setRegistrationId(donationId);
        donationRegistration.setDateCreated(new Date());
        donationRegistration.setStatus("Đang đợi");
        donationRegistration.setEvent(event);
        donationRegistration.setAccount(account);

        return toDTO(donationRegistrationRepository.save(donationRegistration));
    }

    public DonationRegistrationDTO updateDonationRegistration(String id, DonationRegistration updatedData) {
        DonationRegistration existing = donationRegistrationRepository.findByRegistrationId(id)
                .orElseThrow(() -> new EntityNotFoundException("DonationRegistration not found with id: " + id));

        // Cập nhật các field nếu có truyền vào
        if (updatedData.getDateCreated() != null) {
            existing.setDateCreated(updatedData.getDateCreated());
        }

        if (updatedData.getStatus() != null && !updatedData.getStatus().isBlank()) {
            existing.setStatus(updatedData.getStatus());
        }

        if (updatedData.getEvent() != null) {
            existing.setEvent(updatedData.getEvent());
        }

        if (updatedData.getHealthCheck() != null) {
            existing.setHealthCheck(updatedData.getHealthCheck());
        }

        if (updatedData.getDonorFeedback() != null) {
            existing.setDonorFeedback(updatedData.getDonorFeedback());
        }

        if (updatedData.getComponent() != null) {
            existing.setComponent(updatedData.getComponent());
        }

        // Lưu và trả về DTO
        return toDTO(donationRegistrationRepository.save(existing));
    }


    public DonationRegistration deleteDonationRegistration(String id) {
        DonationRegistration donorRegis = donationRegistrationRepository.findByRegistrationId(id).orElse(null);
        if (donorRegis != null) {
            donationRegistrationRepository.delete(donorRegis);
        }
        return donorRegis;
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
}
