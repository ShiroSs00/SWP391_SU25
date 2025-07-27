package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.service.AccountService;
import com.swp391.bloodcare.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/event")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<BloodDonationEventDTO>> create(@Valid @RequestBody BloodDonationEventDTO dto,
                                                                     BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Dữ liệu không hợp lệ", null, getValidationErrors(bindingResult))
            );
        }

        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        BloodDonationEventDTO created = eventService.createEvent(dto, accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo sự kiện thành công", created));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/notify")
    public ResponseEntity<ApiResponse<String>> notifyOngoingEventToNearbyAccounts(
            @RequestParam String eventId,
            @RequestParam(defaultValue = "20") double radiusKm,
            @RequestParam(required = false) List<String> bloodTypes) {

        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();

        List<Account> nearbyAccounts = accountService.findNearbyDonors(
                radiusKm,
                bloodTypes,
                accountId
        );

        eventService.notifyOngoingEventToAccounts(eventId, nearbyAccounts);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Gửi thiệp sự kiện cho các người hiến gần nhất thành công",
                null
        ));
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<BloodDonationEventDTO>> update(@PathVariable String id,
                                                                     @Valid @RequestBody BloodDonationEventDTO dto,
                                                                     BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Dữ liệu không hợp lệ", null, getValidationErrors(bindingResult))
            );
        }

        BloodDonationEventDTO updated = eventService.updateEvent(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật sự kiện thành công", updated));
    }



    @GetMapping("/getall")
    public ResponseEntity<ApiResponse<List<BloodDonationEventDTO>>> getAll() {
        List<BloodDonationEventDTO> list = eventService.getAllEvents();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách sự kiện thành công", list));
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ApiResponse<BloodDonationEventDTO>> getById(@PathVariable String id) {
        BloodDonationEventDTO event = eventService.getEventById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết sự kiện thành công", event));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa sự kiện thành công", null));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteMultiple(@RequestBody List<String> ids) {
        Map<String, Object> result = eventService.deleteMultipleEventsSafe(ids);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa nhiều sự kiện thành công", result));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BloodDonationEventDTO>>> search(@RequestParam("keyword") String keyword) {
        List<BloodDonationEventDTO> list = eventService.searchByName(keyword);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tìm kiếm sự kiện thành công", list));
    }

    @GetMapping("/by-end-date-range")
    public ResponseEntity<ApiResponse<List<BloodDonationEventDTO>>> getByEndDateRange(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date to) {
        List<BloodDonationEventDTO> list = eventService.getByEndDateRange(from, to);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy sự kiện theo khoảng ngày kết thúc", list));
    }

    private Map<String, String> getValidationErrors(BindingResult bindingResult) {
        return bindingResult.getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage(),
                        (existing, replacement) -> existing
                ));
    }
}
