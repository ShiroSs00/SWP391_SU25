package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController("/api/event")
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/getall")
    public ResponseEntity<List<BloodDonationEvent>> getEvent() {
       List<BloodDonationEvent> events = eventService.getAllEvent();
        return ResponseEntity.ok(events);
    }

    @PostMapping("/create")
    public ResponseEntity<BloodDonationEvent> addEvent(@RequestBody BloodDonationEvent event) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        BloodDonationEvent createdEvent = eventService.createEventByUsername(username, event);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }


    @PutMapping("update/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable("id") int id,
            @RequestBody BloodDonationEvent updatedEvent
    ) {
        try {
            BloodDonationEvent result = eventService.updateEvent(id, updatedEvent);
            return ResponseEntity.ok(result); // 200 OK + object
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found with id: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable("id") int id) {
        try {
            eventService.deleteEvent(id);

            // Trả về JSON message thông báo thành công
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event deleted successfully with id: " + id);
            return ResponseEntity.ok(response); // 200 OK

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "Event not found with id: " + id));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Delete failed: " + e.getMessage()));
        }
    }



    @GetMapping("filter/by-date")
    public ResponseEntity<List<BloodDonationEvent>> getEventsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end
    ) {
        List<BloodDonationEvent> events = eventService.getEventByDate(start, end);
        return ResponseEntity.ok(events);
    }











}
