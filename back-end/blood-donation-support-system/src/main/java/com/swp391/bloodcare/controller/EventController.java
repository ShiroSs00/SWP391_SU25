package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.service.EventService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/event")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/getall")
    public ResponseEntity<List<BloodDonationEventDTO>> getEvent() {
        return ResponseEntity.ok(eventService.getAllEvent());
    }

    @PostMapping("/create")
    public ResponseEntity<BloodDonationEventDTO> addEvent(@RequestBody BloodDonationEventDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        BloodDonationEventDTO createdEvent = eventService.createEventByUsername(username, dto);
        return ResponseEntity.status(201).body(createdEvent);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BloodDonationEventDTO> updateEvent(
            @PathVariable("id") String id,
            @RequestBody BloodDonationEventDTO dto) {
        BloodDonationEventDTO updatedEvent = eventService.updateEvent(id, dto);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable("id") String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Đã xoá sự kiện thành công với ID: " + id));
    }

    @GetMapping("/filter/by-date")
    public ResponseEntity<List<BloodDonationEventDTO>> getEventsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end) {
        return ResponseEntity.ok(eventService.getEventByDate(start, end));
    }



    @DeleteMapping("/delete-multiple")
    public ResponseEntity<?> deleteMultipleEvents(@RequestBody List<String> ids) {
        Map<String, Object> result = eventService.deleteMultipleEventsSafe(ids);
        return ResponseEntity.ok(Map.of(
                "status", "partial-success",
                "message", "✅ Đã xử lý xóa danh sách sự kiện",
                "data", result
        ));
    }

}
