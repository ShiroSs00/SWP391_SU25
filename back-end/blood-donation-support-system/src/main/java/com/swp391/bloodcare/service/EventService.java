package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.swp391.bloodcare.dto.BloodDonationEventDTO.toDTO;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;

    public BloodDonationEventDTO createEvent(BloodDonationEventDTO dto, String accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy account với accountID: " + accountId));

        String eventId;
        do {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = new Random().nextInt(1000);
            String randomPart = String.format("%03d", randomCode);
            eventId = "EV-" + timestamp + "-" + randomPart;
        } while (eventRepository.existsByEventId(eventId));

        BloodDonationEvent event = new BloodDonationEvent();
        event.setEventId(eventId);
        event.setCreationDate(new Date());
        event.setAccount(account);
        setEntityFromDTO(event, dto);


        // 👇 GÁN account tạo sự kiện
        event.setAccount(account);

        return toDTO(eventRepository.save(event));
    }


    public BloodDonationEventDTO updateEvent(String id, BloodDonationEventDTO dto) {
        BloodDonationEvent existing = eventRepository.findByEventId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + id));

        setEntityFromDTO(existing, dto);
        return toDTO(eventRepository.save(existing));
    }

    public void deleteEvent(String id) {
        BloodDonationEvent event = eventRepository.findByEventId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + id));
        eventRepository.delete(event);
    }

    public List<BloodDonationEventDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(BloodDonationEventDTO::toDTO)
                .collect(Collectors.toList());
    }

    public BloodDonationEventDTO getEventById(String id) {
        BloodDonationEvent event = eventRepository.findByEventId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + id));
        return toDTO(event);
    }

    public List<BloodDonationEventDTO> searchByName(String keyword) {
        List<BloodDonationEvent> events = eventRepository.findByNameOfEventContainingIgnoreCase(keyword);
        if (events.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sự kiện nào chứa từ khóa: " + keyword);
        }

        return events.stream()
                .map(BloodDonationEventDTO::toDTO)
                .collect(Collectors.toList());
    }

    public List<BloodDonationEventDTO> getByEndDateRange(Date from, Date to) {
        return eventRepository.findByEndDateBetween(from, to).stream()
                .map(BloodDonationEventDTO::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> deleteMultipleEventsSafe(List<String> ids) {
        List<String> deleted = new ArrayList<>();
        Map<String, String> errors = new HashMap<>();

        for (String id : ids) {
            try {
                BloodDonationEvent event = eventRepository.findByEventId(id)
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + id));
                eventRepository.delete(event);
                deleted.add(id);
            } catch (EntityNotFoundException e) {
                errors.put(id, "Không tìm thấy");
            } catch (Exception e) {
                errors.put(id, "Lỗi không xác định: " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("deleted", deleted);
        result.put("errors", errors);
        return result;
    }

    private void setEntityFromDTO(BloodDonationEvent event, BloodDonationEventDTO dto) {
        if (dto.getNameOfEvent() != null) event.setNameOfEvent(dto.getNameOfEvent());
        if (dto.getCreationDate() != null) event.setCreationDate(dto.getCreationDate());
        if (dto.getStartDate() != null) event.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) event.setEndDate(dto.getEndDate());
        if (dto.getExpectedBloodVolume() != null) event.setExpectedBloodVolume(dto.getExpectedBloodVolume());
        if (dto.getLocation() != null) event.setLocation(dto.getLocation());
        if (dto.getStatus() != null) event.setStatus(dto.getStatus());

        if (dto.getAccountId() != null && !dto.getAccountId().isBlank()) {
            Account account = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + dto.getAccountId()));
            event.setAccount(account);
        }
    }
}
