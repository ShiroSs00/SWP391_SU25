package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BloodDonationEventDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.BloodDonationEvent;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.swp391.bloodcare.dto.BloodDonationEventDTO.toDTO;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final AccountRepository accountRepository;
    private final EmailNotifier emailNotifier;

    public BloodDonationEventDTO createEvent(BloodDonationEventDTO dto, String accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy account với accountID: " + accountId));

        if (dto.getStartDate().after(dto.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày bắt đầu phải trước ngày kết thúc");
        }

        String eventId;
        do {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            int randomCode = new Random().nextInt(1000);
            eventId = "EV-" + timestamp + "-" + String.format("%03d", randomCode);
        } while (eventRepository.existsByEventId(eventId));

        BloodDonationEvent event = BloodDonationEvent.builder()
                .eventId(eventId)
                .creationDate(new Date())
                .nameOfEvent(dto.getNameOfEvent())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .exectedCost(dto.getExpectedCost())
                .expectedBloodVolume(dto.getExpectedBloodVolume())
                .actualVolume(0L)
                .location(dto.getLocation())
                .account(account)
                .build();
        updateEventStatus(event);
        return toDTO(eventRepository.save(event));
    }



    public BloodDonationEventDTO updateEvent(String id, BloodDonationEventDTO dto) {
        BloodDonationEvent existing = eventRepository.findByEventId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + id));

        if (dto.getStartDate().after(dto.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày bắt đầu phải trước ngày kết thúc");
        }


        setEntityFromDTO(existing, dto);
        updateEventStatus(existing);
        return toDTO(eventRepository.save(existing));
    }

    @Transactional
    public void deleteEvent(String id) {
        BloodDonationEvent event = eventRepository.findByEventId(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + id));
        event.getDonationRegistrations().size();
        event.getDonationRegistrations().clear();
        eventRepository.save(event);
        eventRepository.delete(event);
    }

    @Scheduled(cron = "0 00 0 * * ?", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public int autoUpdateEventStatuses() {
        Date now = new Date();
        List<BloodDonationEvent> allEvents = eventRepository.findAll();

        int updated = 0;

        for (BloodDonationEvent event : allEvents) {
            BloodDonationEvent.Status oldStatus = event.getStatus();
            BloodDonationEvent.Status newStatus;

            if (now.before(event.getStartDate())) {
                newStatus = BloodDonationEvent.Status.UPCOMING;
            } else if (now.after(event.getEndDate())) {
                newStatus = BloodDonationEvent.Status.FINISHED;
            } else {
                newStatus = BloodDonationEvent.Status.ONGOING;
            }

            if (!newStatus.equals(oldStatus)) {
                event.setStatus(newStatus);
                updated++;
            }
        }

        eventRepository.saveAll(allEvents);
        return updated;
    }

    public void notifyEventOngoing(String eventId, List<String> recipientEmails) {
        BloodDonationEvent event = eventRepository.findByEventId(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sự kiện với ID: " + eventId));

        if (event.getStatus() != BloodDonationEvent.Status.ONGOING) {
            throw new IllegalStateException("Sự kiện chưa bắt đầu hoặc đã kết thúc");
        }

        String subject = "🎉 Sự kiện hiến máu đang diễn ra!";

        String htmlContent = generateEventHtmlCard(event);

        recipientEmails.forEach(email -> {
            try {
                emailNotifier.sendHtml(email, subject, htmlContent);
            } catch (Exception e) {
                System.err.println("Không thể gửi email tới " + email + ": " + e.getMessage());
            }
        });
    }

    private String generateEventHtmlCard(BloodDonationEvent event) {
        return """
    <div style="max-width:600px;margin:auto;padding:20px;border-radius:15px;
         background: linear-gradient(135deg, #f5f7fa, #c3cfe2); 
         font-family: Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <h2 style="color:#d62828;text-align:center;">💉 SỰ KIỆN HIẾN MÁU ĐANG DIỄN RA 💉</h2>
        <p><strong>Tên sự kiện:</strong> %s</p>
        <p><strong>Thời gian:</strong> %s đến %s</p>
        <p><strong>Địa điểm:</strong> %s</p>
        <p><strong>Kỳ vọng:</strong> %d ml máu</p>
        <p><strong>Kinh phí dự kiến:</strong> %d VNĐ</p>
        <p style="margin-top:20px;color:#555;">Hãy cùng chung tay cứu người bằng hành động nhỏ nhưng ý nghĩa lớn!</p>
        <p style="text-align:center;margin-top:30px;">
            <a href="#" style="background-color:#d62828;color:white;padding:10px 20px;
               border-radius:5px;text-decoration:none;font-weight:bold;">
               THAM GIA NGAY
            </a>
        </p>
    </div>
    """.formatted(
                event.getNameOfEvent(),
                formatDate(event.getStartDate()),
                formatDate(event.getEndDate()),
                event.getLocation(),
                event.getExpectedBloodVolume(),
                event.getExectedCost()
        );
    }

    private String formatDate(Date date) {
        return new java.text.SimpleDateFormat("dd/MM/yyyy").format(date);
    }



    public void updateEventStatus(BloodDonationEvent event) {
        LocalDate today = LocalDate.now();

        LocalDate start = event.getStartDate().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        LocalDate end = event.getEndDate().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();

        if (today.isBefore(start)) {
            event.setStatus(BloodDonationEvent.Status.UPCOMING);
        } else if ((today.isEqual(start) || today.isAfter(start)) && today.isBefore(end.plusDays(1))) {
            event.setStatus(BloodDonationEvent.Status.ONGOING);
        } else {
            event.setStatus(BloodDonationEvent.Status.FINISHED);
        }
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
                event.getDonationRegistrations().size();
                event.getDonationRegistrations().clear();
                eventRepository.save(event);
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
        if (dto.getStartDate() != null) event.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) event.setEndDate(dto.getEndDate());
        if (dto.getExpectedBloodVolume() != null) event.setExpectedBloodVolume(dto.getExpectedBloodVolume());
        if (dto.getLocation() != null) event.setLocation(dto.getLocation());
        if (dto.getActualVolume() != null) event.setActualVolume(dto.getActualVolume());
        if(dto.getExpectedCost() != null) event.setExectedCost(dto.getExpectedCost());

        if (dto.getAccountId() != null && !dto.getAccountId().isBlank()) {
            Account account = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + dto.getAccountId()));
            event.setAccount(account);
        }
    }

}
