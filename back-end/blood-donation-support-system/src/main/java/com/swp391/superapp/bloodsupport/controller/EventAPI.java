package com.swp391.superapp.bloodsupport.controller;

import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.entity.BloodDonationEvent;
import com.swp391.superapp.bloodsupport.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
@RestController
public class EventAPI {
    @Autowired
    private EventService eventService;
    @GetMapping("/api/event")
    public ResponseEntity<List<BloodDonationEvent>> getEvent() {
       List<BloodDonationEvent> events = eventService.getAllEvent();
        return ResponseEntity.ok(events);
    }
//    @PostMapping("/api/event")
//    public ResponseEntity<BloodDonationEvent> addEvent(@RequestBody BloodDonationEvent event,
//                                                       @AuthenticationPrincipal Account account) {
//        BloodDonationEvent createdEvent = eventService.createEvent(account, event);
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
//    }
    @PutMapping("/api/event/{id}")
    public ResponseEntity<BloodDonationEvent> updateEvent(
            @PathVariable int id,
            @RequestBody BloodDonationEvent updatedEvent
    ) {
        BloodDonationEvent result = eventService.updateEvent(id, updatedEvent);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/api/event/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable int id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with id: " + id);
        }
    }

    @GetMapping("/api/event/by-date")
    public ResponseEntity<List<BloodDonationEvent>> getEventsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end
    ) {
        List<BloodDonationEvent> events = eventService.getEventByDate(start, end);
        return ResponseEntity.ok(events);
    }











}
