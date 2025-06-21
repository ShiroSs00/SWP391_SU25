package com.swp391.bloodcare.controller;

import org.springframework.http.HttpStatus;
import com.swp391.bloodcare.dto.DonorFeedbackDTO;
import com.swp391.bloodcare.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping("/average/event/{eventId}")
    public ResponseEntity<Map<String, Double>> getAverageByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(feedbackService.getAverageScoresByEvent(eventId));
    }


    @GetMapping("/filter")
    public ResponseEntity<List<DonorFeedbackDTO>> getFeedbackByScore(
            @RequestParam("criteria") String criteria,
            @RequestParam("score") int score
    ) {
        return ResponseEntity.ok(feedbackService.getFeedbacksByScore(criteria, score));
    }


    @PostMapping("/chatbot")
    public ResponseEntity<String> chatbot(@RequestBody Map<String, String> input) {
        String message = input.get("message");
        String reply = feedbackService.autoReply(message);
        return ResponseEntity.ok(reply);
    }


    @GetMapping("/getall")
    public ResponseEntity<List<DonorFeedbackDTO>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @GetMapping("/get-by-registration/{registrationId}")
    public ResponseEntity<DonorFeedbackDTO> getFeedbackByRegistration(@PathVariable String registrationId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByRegistrationId(registrationId));
    }

    @PostMapping("/create/{registrationId}")
    public ResponseEntity<DonorFeedbackDTO> createFeedback(
            @PathVariable String registrationId,
            @RequestBody DonorFeedbackDTO feedbackDTO) {
        DonorFeedbackDTO created = feedbackService.createFeedback(registrationId, feedbackDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        return ResponseEntity.ok(feedbackService.getDashboardSummary());
    }

    @PutMapping("/update/{registrationId}")
    public ResponseEntity<DonorFeedbackDTO> updateFeedback(
            @PathVariable String registrationId,
            @RequestBody DonorFeedbackDTO updatedDTO) {
        DonorFeedbackDTO updated = feedbackService.updateFeedbackByRegistrationId(registrationId, updatedDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteFeedback(@PathVariable String id) {
        DonorFeedbackDTO deleted = feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Đã xóa thành công phản hồi",
                "data", deleted
        ));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<Map<String, Object>> deleteMultipleFeedbacks(@RequestBody List<String> ids) {
        Map<String, Object> result = feedbackService.deleteMultipleFeedbacksSafe(ids);
        return ResponseEntity.ok(Map.of(
                "status", "partial-success",
                "message", "Đã xử lý xóa danh sách phản hồi",
                "data", result
        ));
    }



}
