package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/event")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping("/create")
    public ResponseEntity<BloodDonationEventDTO> create(@RequestBody BloodDonationEventDTO dto) {
        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(eventService.createEvent(dto, accountId));
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<BloodDonationEventDTO> update(@PathVariable String id,
                                                        @RequestBody BloodDonationEventDTO dto) {
        return ResponseEntity.ok(eventService.updateEvent(id, dto));
    }

    @GetMapping("/getall")
    public ResponseEntity<List<BloodDonationEventDTO>> getAll() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<BloodDonationEventDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<Map<String, Object>> deleteMultiple(@RequestBody List<String> ids) {
        return ResponseEntity.ok(eventService.deleteMultipleEventsSafe(ids));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BloodDonationEventDTO>> search(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(eventService.searchByName(keyword));
    }

    @GetMapping("/by-end-date-range")
    public ResponseEntity<List<BloodDonationEventDTO>> getByEndDateRange(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date to
    ) {
        return ResponseEntity.ok(eventService.getByEndDateRange(from, to));
    }
}
