package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.DonorFeedbackDTO;
import com.swp391.bloodcare.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping("/average/event/{eventId}")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getAverageByEvent(@PathVariable String eventId) {
        Map<String, Double> averages = feedbackService.getAverageScoresByEvent(eventId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy điểm trung bình thành công", averages));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<DonorFeedbackDTO>>> getFeedbackByScore(
            @RequestParam("criteria") String criteria,
            @RequestParam("score") int score) {
        List<DonorFeedbackDTO> feedbacks = feedbackService.getFeedbacksByScore(criteria, score);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lọc phản hồi thành công", feedbacks));
    }

    @PostMapping("/chatbot")
    public ResponseEntity<ApiResponse<String>> chatbot(@RequestBody Map<String, String> input) {
        String message = input.get("message");
        String reply = feedbackService.autoReply(message);
        return ResponseEntity.ok(new ApiResponse<>(true, "Phản hồi từ chatbot", reply));
    }

    @GetMapping("/getall")
    public ResponseEntity<ApiResponse<List<DonorFeedbackDTO>>> getAllFeedback() {
        List<DonorFeedbackDTO> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy tất cả phản hồi thành công", feedbacks));
    }

    @GetMapping("/get-by-registration/{registrationId}")
    public ResponseEntity<ApiResponse<DonorFeedbackDTO>> getFeedbackByRegistration(@PathVariable String registrationId) {
        DonorFeedbackDTO dto = feedbackService.getFeedbackByRegistrationId(registrationId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy phản hồi theo đăng ký thành công", dto));
    }

    @PostMapping("/create/{registrationId}")
    public ResponseEntity<ApiResponse<?>> createFeedback(
            @PathVariable String registrationId,
            @Valid @RequestBody DonorFeedbackDTO feedbackDTO,
            BindingResult result) {

        if (result.hasErrors()) {
            Map<String, String> errors = result.getFieldErrors().stream()
                    .filter(error -> error.getDefaultMessage() != null)
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage,
                            (a, b) -> b,
                            LinkedHashMap::new
                    ));


            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Dữ liệu không hợp lệ", null, errors)
            );
        }

        DonorFeedbackDTO created = feedbackService.createFeedback(registrationId, feedbackDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "Tạo phản hồi thành công", created)
        );
    }


    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardSummary() {
        Map<String, Object> dashboard = feedbackService.getDashboardSummary();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy dashboard thành công", dashboard));
    }

    @PutMapping("/update/{registrationId}")
    public ResponseEntity<ApiResponse<DonorFeedbackDTO>> updateFeedback(
            @PathVariable String registrationId,
            @Valid @RequestBody DonorFeedbackDTO updatedDTO) {
        DonorFeedbackDTO updated = feedbackService.updateFeedbackByRegistrationId(registrationId, updatedDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật phản hồi thành công", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<DonorFeedbackDTO>> deleteFeedback(@PathVariable String id) {
        DonorFeedbackDTO deleted = feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xóa phản hồi thành công", deleted));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteMultipleFeedbacks(@RequestBody List<String> ids) {
        Map<String, Object> result = feedbackService.deleteMultipleFeedbacksSafe(ids);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xử lý xóa nhiều phản hồi thành công", result));
    }
}
