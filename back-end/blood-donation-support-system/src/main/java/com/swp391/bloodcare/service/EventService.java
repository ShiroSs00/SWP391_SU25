package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AccountRepository accountRepository;

    public BloodDonationEventDTO createEventByUsername(String username, BloodDonationEventDTO eventDTO) {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String eventId;
        do {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = new Random().nextInt(1000);
            String randomPart = String.format("%03d", randomCode);
            eventId = "EV-" + timestamp + "-" + randomPart;
        } while (eventRepository.existsByEventId(eventId));

        BloodDonationEvent event = new BloodDonationEvent();
        event.setEventId(eventId);
        event.setAccount(account);
        event.setCreationDate(new Date());
        event.setNameOfEvent(eventDTO.getNameOfEvent());
        event.setStartDate(eventDTO.getStartDate());
        event.setEndDate(eventDTO.getEndDate());
        event.setExpectedBloodVolume(eventDTO.getExpectedBloodVolume());
        event.setActualVolume(eventDTO.getActualVolume());
        event.setLocation(eventDTO.getLocation());
        event.setStatus(eventDTO.getStatus());

        return toDTO(eventRepository.save(event));
    }

    public BloodDonationEventDTO updateEvent(String id, BloodDonationEventDTO eventDTO) {
        BloodDonationEvent existingEvent = eventRepository.findByEventId(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found with ID: " + id
                ));

        existingEvent.setNameOfEvent(eventDTO.getNameOfEvent());
        existingEvent.setStartDate(eventDTO.getStartDate());
        existingEvent.setEndDate(eventDTO.getEndDate());
        existingEvent.setExpectedBloodVolume(eventDTO.getExpectedBloodVolume());
        existingEvent.setActualVolume(eventDTO.getActualVolume());
        existingEvent.setLocation(eventDTO.getLocation());
        existingEvent.setStatus(eventDTO.getStatus());

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
}
