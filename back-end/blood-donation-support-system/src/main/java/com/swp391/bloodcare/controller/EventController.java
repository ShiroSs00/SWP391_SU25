package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/getall")
    public ResponseEntity<List<BloodDonationEventDTO>> getEvent() {
        List<BloodDonationEventDTO> events = eventService.getAllEvent();
        return ResponseEntity.ok(events);
    }

    @PostMapping("/create")
    public ResponseEntity<BloodDonationEventDTO> addEvent(@RequestBody BloodDonationEventDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        BloodDonationEventDTO createdEvent = eventService.createEventByUsername(username, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable("id") String id,
            @RequestBody BloodDonationEventDTO dto
    ) {
        try {
            BloodDonationEventDTO updatedEvent = eventService.updateEvent(id, dto);
            return ResponseEntity.ok(updatedEvent);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable("id") String id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully with id: " + id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Event not found with id: " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Delete failed: " + e.getMessage()));
        }
    }

    @GetMapping("/filter/by-date")
    public ResponseEntity<List<BloodDonationEventDTO>> getEventsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end
    ) {
        List<BloodDonationEventDTO> events = eventService.getEventByDate(start, end);
        return ResponseEntity.ok(events);
    }
}
