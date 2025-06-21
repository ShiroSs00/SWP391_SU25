package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.EventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    private final AccountRepository accountRepository;

    public EventService(EventRepository eventRepository, AccountRepository accountRepository) {
        this.eventRepository = eventRepository;
        this.accountRepository = accountRepository;
    }

    private String generateUniqueEventId() {
        String eventId;
        do {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = new Random().nextInt(1000);
            String randomPart = String.format("%03d", randomCode);
            eventId = "EV-" + timestamp + "-" + randomPart;
        } while (eventRepository.existsByEventId(eventId));
        return eventId;
    }

    private BloodDonationEvent buildEventFromDTO(BloodDonationEventDTO dto, String eventId, Account account) {
        BloodDonationEvent event = new BloodDonationEvent();
        event.setEventId(eventId);
        event.setAccount(account);
        event.setCreationDate(new Date());
        event.setNameOfEvent(dto.getNameOfEvent());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setExpectedBloodVolume(dto.getExpectedBloodVolume());
        event.setActualVolume(dto.getActualVolume());
        event.setLocation(dto.getLocation());
        event.setStatus(dto.getStatus());
        return event;
    }

    public BloodDonationEventDTO createEventByUsername(String username, BloodDonationEventDTO eventDTO) {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String eventId = generateUniqueEventId();

        BloodDonationEvent event = buildEventFromDTO(eventDTO, eventId, account);

        return toDTO(eventRepository.save(event));
    }


    public BloodDonationEventDTO updateEvent(String id, BloodDonationEventDTO eventDTO) {
        BloodDonationEvent existingEvent = eventRepository.findByEventId(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found with ID: " + id
                ));

        if (eventDTO.getNameOfEvent() != null && !eventDTO.getNameOfEvent().isBlank()) {
            existingEvent.setNameOfEvent(eventDTO.getNameOfEvent());
        }

        if (eventDTO.getStartDate() != null) {
            existingEvent.setStartDate(eventDTO.getStartDate());
        }

        if (eventDTO.getEndDate() != null) {
            existingEvent.setEndDate(eventDTO.getEndDate());
        }

        if (eventDTO.getExpectedBloodVolume() != null) {
            existingEvent.setExpectedBloodVolume(eventDTO.getExpectedBloodVolume());
        }

        if (eventDTO.getActualVolume() != null) {
            existingEvent.setActualVolume(eventDTO.getActualVolume());
        }

        if (eventDTO.getLocation() != null && !eventDTO.getLocation().isBlank()) {
            existingEvent.setLocation(eventDTO.getLocation());
        }

        if (eventDTO.getStatus() != null && !eventDTO.getStatus().isBlank()) {
            existingEvent.setStatus(eventDTO.getStatus());
        }

        return toDTO(eventRepository.save(existingEvent));
    }


    public List<BloodDonationEventDTO> getAllEvent() {
        return eventRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<BloodDonationEventDTO> getEventByDate(Date startTime, Date endTime) {
        return eventRepository.findByCreationDateBetween(startTime, endTime)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteEvent(String id) {
        BloodDonationEvent event = eventRepository.findByEventId(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
        eventRepository.delete(event);
    }

    private BloodDonationEventDTO toDTO(BloodDonationEvent event) {
        BloodDonationEventDTO dto = new BloodDonationEventDTO();
        dto.setEventId(event.getEventId());
        dto.setNameOfEvent(event.getNameOfEvent());
        dto.setCreationDate(event.getCreationDate());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setExpectedBloodVolume(event.getExpectedBloodVolume());
        dto.setActualVolume(event.getActualVolume());
        dto.setLocation(event.getLocation());
        dto.setStatus(event.getStatus());
        dto.setAccountId(event.getAccount().getAccountId());
        return dto;
    }

    @Transactional
    public Map<String, Object> deleteMultipleEventsSafe(List<String> ids) {
        List<String> deleted = new ArrayList<>();
        Map<String, String> errors = new HashMap<>();

        for (String id : ids) {
            try {
                eventRepository.findByEventId(id).ifPresentOrElse(
                        event -> {
                            eventRepository.delete(event);
                            deleted.add(id);
                        },
                        () -> errors.put(id, "Không tìm thấy sự kiện")
                );
            } catch (Exception e) {
                errors.put(id, "Lỗi không xác định: " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("deleted", deleted);
        result.put("errors", errors);
        return result;
    }

}
