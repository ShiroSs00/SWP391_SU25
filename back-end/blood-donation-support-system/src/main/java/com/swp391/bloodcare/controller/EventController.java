package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/event")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getEvent() {
        try {
            List<BloodDonationEventDTO> events = eventService.getAllEvent();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy danh sách sự kiện: " + e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> addEvent(@RequestBody BloodDonationEventDTO dto) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            BloodDonationEventDTO createdEvent = eventService.createEventByUsername(username, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy tài khoản tạo sự kiện"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Tạo sự kiện thất bại: " + e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable("id") String id,
                                         @RequestBody BloodDonationEventDTO dto) {
        try {
            BloodDonationEventDTO updatedEvent = eventService.updateEvent(id, dto);
            return ResponseEntity.ok(updatedEvent);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy sự kiện với ID: " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Cập nhật thất bại: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable("id") String id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(Map.of("message", "Đã xoá sự kiện thành công với ID: " + id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy sự kiện với ID: " + id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Xóa sự kiện thất bại: " + e.getMessage()));
        }
    }

    @GetMapping("/filter/by-date")
    public ResponseEntity<?> getEventsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end
    ) {
        try {
            List<BloodDonationEventDTO> events = eventService.getEventByDate(start, end);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Không thể lọc sự kiện theo ngày: " + e.getMessage()));
        }
    }
}

