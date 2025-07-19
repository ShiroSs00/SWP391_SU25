import api from '../../../services/axios/api';
import type { FeedbackApiResponse } from '../types/feedback-manage.types';

export const feedbackManageService = {
  // Lấy tất cả feedback
  getAllFeedbacks: async (): Promise<FeedbackApiResponse> => {
    try {
      const response = await api.get('/feedback/getall');
      return response.data;
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw error;
    }
  }
};

export default feedbackManageService;
