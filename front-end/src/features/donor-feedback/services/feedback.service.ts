import api from '../../../services/axios/api';
import type { 
  CreateFeedbackRequest, 
  FeedbackResponse, 
  FeedbackListResponse,
  FeedbackStats,
  FeedbackFilter
} from '../types/feedback.types';

// Create new feedback for a donation registration
// POST /api/feedback/create/{registrationId}
export const createFeedback = async (registrationId: string, payload: CreateFeedbackRequest): Promise<FeedbackResponse> => {
  try {
    const response = await api.post<FeedbackResponse>(`/feedback/create/${registrationId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error creating feedback:', error);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Dữ liệu không hợp lệ');
    }
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy thông tin đăng ký hiến máu');
    }
    if (error.response?.status === 409) {
      throw new Error('Bạn đã gửi feedback cho lần hiến máu này rồi');
    }
    if (error.response?.status === 403) {
      throw new Error('Bạn không có quyền gửi feedback cho đăng ký này');
    }
    
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi feedback. Vui lòng thử lại sau.');
  }
};

// Update feedback
// PUT /api/feedback/update/{registrationId}
export const updateFeedback = async (registrationId: string, data: CreateFeedbackRequest): Promise<FeedbackResponse> => {
  try {
    const response = await api.put<FeedbackResponse>(`/feedback/update/${registrationId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating feedback:', error);
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy feedback để cập nhật');
    }
    if (error.response?.status === 403) {
      throw new Error('Bạn không có quyền cập nhật feedback này');
    }
    throw new Error(error.response?.data?.message || 'Không thể cập nhật feedback');
  }
};

// Get all feedback with pagination and filters
// GET /api/feedback/getall
export const getAllFeedback = async (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<FeedbackListResponse> => {
  try {
    const response = await api.get<FeedbackListResponse>('/feedback/getall', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách feedback');
  }
};

// Get feedback by registration ID
// GET /api/feedback/get-by-registration/{registrationId}
export const getFeedbackByRegistrationId = async (registrationId: string): Promise<FeedbackResponse | null> => {
  try {
    const response = await api.get<FeedbackResponse>(`/feedback/get-by-registration/${registrationId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No feedback found for this registration
    }
    console.error('Error fetching feedback by registration ID:', error);
    throw new Error(error.response?.data?.message || 'Không thể kiểm tra feedback cho đăng ký này');
  }
};

// Filter feedback
// GET /api/feedback/filter
export const filterFeedback = async (params?: FeedbackFilter): Promise<FeedbackListResponse> => {
  try {
    const response = await api.get<FeedbackListResponse>('/feedback/filter', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error filtering feedback:', error);
    throw new Error(error.response?.data?.message || 'Không thể lọc feedback');
  }
};

// Get feedback dashboard data
// GET /api/feedback/dashboard
export const getFeedbackDashboard = async (): Promise<FeedbackStats> => {
  try {
    const response = await api.get<FeedbackStats>('/feedback/dashboard');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching feedback dashboard:', error);
    throw new Error(error.response?.data?.message || 'Không thể tải dashboard feedback');
  }
};

// Get feedback average by event
// GET /api/feedback/average/event/{eventId}
export const getFeedbackAverageByEvent = async (eventId: string): Promise<{
  eventId: string;
  averageRatings: {
    process: number;
    bloodTest: number;
    postDonationCare: number;
    comfortable: number;
    overallSatisfaction: number;
  };
  totalFeedbacks: number;
}> => {
  try {
    const response = await api.get(`/feedback/average/event/${eventId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching feedback average by event:', error);
    throw new Error(error.response?.data?.message || 'Không thể tải thống kê feedback cho sự kiện này');
  }
};

// Delete feedback by ID
// DELETE /api/feedback/delete/{id}
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    await api.delete(`/feedback/delete/${id}`);
  } catch (error: any) {
    console.error('Error deleting feedback:', error);
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy feedback để xóa');
    }
    if (error.response?.status === 403) {
      throw new Error('Bạn không có quyền xóa feedback này');
    }
    throw new Error(error.response?.data?.message || 'Không thể xóa feedback');
  }
};

// Delete multiple feedback
// DELETE /api/feedback/delete-multiple
export const deleteMultipleFeedback = async (ids: string[]): Promise<void> => {
  try {
    await api.delete('/feedback/delete-multiple', { data: { ids } });
  } catch (error: any) {
    console.error('Error deleting multiple feedback:', error);
    throw new Error(error.response?.data?.message || 'Không thể xóa các feedback đã chọn');
  }
};

// Chatbot endpoint
// POST /api/feedback/chatbot
export const feedbackChatbot = async (message: string): Promise<{ response: string }> => {
  try {
    const response = await api.post('/feedback/chatbot', { message });
    return response.data;
  } catch (error: any) {
    console.error('Error with feedback chatbot:', error);
    throw new Error(error.response?.data?.message || 'Không thể kết nối với chatbot hỗ trợ');
  }
};

// Check if user can submit feedback for a registration
export const canSubmitFeedback = async (registrationId: string): Promise<{
  canSubmit: boolean;
  reason?: string;
  existingFeedback?: FeedbackResponse;
}> => {
  try {
    // First check if feedback already exists
    const existingFeedback = await getFeedbackByRegistrationId(registrationId);
    
    if (existingFeedback) {
      return {
        canSubmit: false,
        reason: 'Bạn đã gửi feedback cho lần hiến máu này rồi',
        existingFeedback
      };
    }
    
    // If no existing feedback, user can submit
    return {
      canSubmit: true
    };
  } catch (error: any) {
    console.error('Error checking feedback eligibility:', error);
    throw new Error(error.response?.data?.message || 'Không thể kiểm tra quyền gửi feedback');
  }
};

// Validate registration ID exists (optional helper)
export const validateRegistrationId = async (registrationId: string): Promise<boolean> => {
  try {
    // This could be a separate endpoint to validate registration
    // For now, we'll use the get-by-registration endpoint
    await getFeedbackByRegistrationId(registrationId);
    return true;
  } catch (error: any) {
    // If 404, registration might exist but no feedback yet
    if (error.response?.status === 404) {
      return true;
    }
    return false;
  }
};