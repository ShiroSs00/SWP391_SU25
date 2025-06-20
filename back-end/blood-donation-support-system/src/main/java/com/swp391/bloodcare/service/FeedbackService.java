package com.swp391.bloodcare.service;


import com.swp391.bloodcare.entity.DonorFeedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {
    private FeedbackService feedbackService ;
    public DonorFeedback createFeedback(DonorFeedback feedback) {
        return feedbackService.createFeedback(feedback);
    }
    public DonorFeedback updateFeedback(DonorFeedback feedback) {
        return feedbackService.updateFeedback(feedback);
    }
    public void deleteFeedback(DonorFeedback feedback) {
        feedbackService.deleteFeedback(feedback);
    }
    public List<DonorFeedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }
    public List<DonorFeedback> getFeedbackByAccount(String accountId) {
        return feedbackService.getFeedbackByAccount(accountId);
    }

}
