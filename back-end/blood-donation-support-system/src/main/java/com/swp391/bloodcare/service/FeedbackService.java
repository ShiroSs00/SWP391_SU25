package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.DonorFeedbackDTO;
import com.swp391.bloodcare.entity.DonationRegistration;
import com.swp391.bloodcare.entity.DonorFeedback;
import com.swp391.bloodcare.repository.DonationRegistrationRepository;
import com.swp391.bloodcare.repository.FeedbackRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static com.swp391.bloodcare.dto.DonorFeedbackDTO.fromEntity;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final DonationRegistrationRepository registrationRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, DonationRegistrationRepository registrationRepository) {
        this.feedbackRepository = feedbackRepository;
        this.registrationRepository = registrationRepository;
    }

    public List<DonorFeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(DonorFeedbackDTO::fromEntity)
                .toList();
    }

    public DonorFeedbackDTO getFeedbackByRegistrationId(String registrationId) {
        DonorFeedback feedback = feedbackRepository
                .findByDonationRegistrationRegistrationId(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phản hồi với mã đăng ký: " + registrationId));

        return fromEntity(feedback);
    }

    @Transactional
    public DonorFeedbackDTO createFeedback(String registrationId, DonorFeedbackDTO dto) {
        DonationRegistration registration = registrationRepository.findByRegistrationId(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bản đăng ký hiến máu với ID: " + registrationId));

        // Nếu đã có phản hồi thì không cho tạo mới
        if (feedbackRepository.findByDonationRegistrationRegistrationId(registrationId).isPresent()) {
            throw new IllegalStateException("Phản hồi đã tồn tại cho bản đăng ký này");
        }

        DonorFeedback feedback = toEntity(dto);
        feedback.setDonationRegistration(registration);
        feedback.setFeedbackID(generateFeedbackId());

        DonorFeedback saved = feedbackRepository.save(feedback);
        return fromEntity(saved);
    }

    @Transactional
    public DonorFeedbackDTO updateFeedbackByRegistrationId(String registrationId, DonorFeedbackDTO dto) {
        DonorFeedback existing = feedbackRepository.findByDonationRegistrationRegistrationId(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phản hồi với mã đăng ký: " + registrationId));

        if (dto.getProcess() >= 0) existing.setProcess(dto.getProcess());
        if (dto.getBloodTest() >= 0) existing.setBloodTest(dto.getBloodTest());
        if (dto.getPostDonationCare() >= 0) existing.setPostDonationCare(dto.getPostDonationCare());
        if (dto.getComfortable() >= 0) existing.setComfortable(dto.getComfortable());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());

        return fromEntity(feedbackRepository.save(existing));
    }

    @Transactional
    public DonorFeedbackDTO deleteFeedback(String feedbackId) {
        DonorFeedback existing = feedbackRepository.findDonorFeedbackByFeedbackID(feedbackId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phản hồi với ID: " + feedbackId));

        if (existing.getDonationRegistration() != null) {
            existing.setDonationRegistration(null);
        }

        feedbackRepository.delete(existing);
        return fromEntity(existing);
    }

    @Transactional
    public Map<String, Object> deleteMultipleFeedbacksSafe(List<String> ids) {
        List<String> deleted = new ArrayList<>();
        Map<String, String> errors = new HashMap<>();

        for (String id : ids) {
            try {
                DonorFeedback fb = feedbackRepository.findDonorFeedbackByFeedbackID(id)
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phản hồi với ID: " + id));
                feedbackRepository.delete(fb);
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

    public static String generateFeedbackId() {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        int random = new Random().nextInt(900) + 100;
        return "FB-" + timestamp + "-" + random;
    }

    public static DonorFeedback toEntity(DonorFeedbackDTO dto) {
        DonorFeedback fb = new DonorFeedback();
        fb.setFeedbackID(dto.getFeedbackID());
        fb.setProcess(dto.getProcess());
        fb.setBloodTest(dto.getBloodTest());
        fb.setPostDonationCare(dto.getPostDonationCare());
        fb.setComfortable(dto.getComfortable());
        fb.setDescription(dto.getDescription());
        return fb;
    }

    public Map<String, Double> getAverageScoresByEvent(String eventId) {
        List<DonorFeedback> feedbacks = feedbackRepository.findByDonationRegistration_Event_EventId(eventId);

        Map<String, Double> avg = new HashMap<>();
        avg.put("process", feedbacks.stream().mapToDouble(DonorFeedback::getProcess).average().orElse(0));
        avg.put("bloodTest", feedbacks.stream().mapToDouble(DonorFeedback::getBloodTest).average().orElse(0));
        avg.put("postDonationCare", feedbacks.stream().mapToDouble(DonorFeedback::getPostDonationCare).average().orElse(0));
        avg.put("comfortable", feedbacks.stream().mapToDouble(DonorFeedback::getComfortable).average().orElse(0));
        return avg;
    }

    public String autoReply(String message) {
        message = message.toLowerCase();
        if (message.contains("giờ")) return "Thời gian hiến máu sẽ được thông báo qua sự kiện.";
        if (message.contains("cảm ơn")) return "Cảm ơn bạn đã đồng hành cùng BloodCare!";
        return "Câu hỏi của bạn đã được ghi nhận.";
    }

    public List<DonorFeedbackDTO> getFeedbacksByScore(String criteria, int score) {
        List<DonorFeedback> all = feedbackRepository.findAll();

        return all.stream()
                .filter(fb -> switch (criteria.toLowerCase()) {
                    case "process" -> fb.getProcess() == score;
                    case "bloodtest" -> fb.getBloodTest() == score;
                    case "postdonationcare" -> fb.getPostDonationCare() == score;
                    case "comfortable" -> fb.getComfortable() == score;
                    default -> false;
                })
                .map(DonorFeedbackDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getDashboardSummary() {
        List<DonorFeedback> all = feedbackRepository.findAll();

        double avgProcess = all.stream().mapToLong(DonorFeedback::getProcess).average().orElse(0);
        double avgBloodTest = all.stream().mapToLong(DonorFeedback::getBloodTest).average().orElse(0);
        double avgPostCare = all.stream().mapToLong(DonorFeedback::getPostDonationCare).average().orElse(0);
        double avgComfortable = all.stream().mapToLong(DonorFeedback::getComfortable).average().orElse(0);

        Map<String, Object> result = new HashMap<>();
        result.put("totalFeedbacks", all.size());
        result.put("averageProcess", avgProcess);
        result.put("averageBloodTest", avgBloodTest);
        result.put("averagePostCare", avgPostCare);
        result.put("averageComfortable", avgComfortable);
        return result;
    }



}
