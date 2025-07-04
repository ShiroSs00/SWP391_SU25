import api from "../../../services/axios/api.ts"
import type {
  DonorFeedback,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  FeedbackFilters,
  FeedbackStats,
} from "../types/feedback.types"

class FeedbackService {
  // Tạo feedback mới
  async createFeedback(registrationId: string, data: CreateFeedbackRequest): Promise<DonorFeedback> {
    try {
      const response = await api.post(`/feedback/create/${registrationId}`, data)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể gửi feedback"
      throw new Error(errorMessage)
    }
  }

  // Lấy tất cả feedback (staff only)
  async getAllFeedbacks(filters?: FeedbackFilters): Promise<{
    feedbacks: DonorFeedback[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const params = new URLSearchParams()

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString())
          }
        })
      }

      const response = await api.get(`/feedback/getall?${params}`)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể tải danh sách feedback"
      throw new Error(errorMessage)
    }
  }

  // Lấy feedback theo registration ID
  async getFeedbackByRegistration(registrationId: string): Promise<DonorFeedback | null> {
    try {
      const response = await api.get(`/feedback/get-by-registration/${registrationId}`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      const errorMessage = error.response?.data?.message || "Không thể tải feedback"
      throw new Error(errorMessage)
    }
  }

  // Cập nhật feedback (staff reply)
  async updateFeedback(feedbackId: string, data: UpdateFeedbackRequest): Promise<DonorFeedback> {
    try {
      const response = await api.put(`/feedback/update/${feedbackId}`, data)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể cập nhật feedback"
      throw new Error(errorMessage)
    }
  }

  // Xóa feedback
  async deleteFeedback(feedbackId: string): Promise<void> {
    try {
      await api.delete(`/feedback/delete/${feedbackId}`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể xóa feedback"
      throw new Error(errorMessage)
    }
  }

  // Xóa nhiều feedback
  async deleteMultipleFeedbacks(feedbackIds: string[]): Promise<void> {
    try {
      await api.delete("/feedback/delete-multiple", {
        data: { feedbackIds },
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể xóa feedback"
      throw new Error(errorMessage)
    }
  }

  // Lấy thống kê feedback
  async getFeedbackStats(): Promise<FeedbackStats> {
    try {
      const response = await api.get("/feedback/dashboard")
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể tải thống kê"
      throw new Error(errorMessage)
    }
  }

  // Lọc feedback
  async filterFeedbacks(filters: FeedbackFilters): Promise<{
    feedbacks: DonorFeedback[]
    total: number
  }> {
    try {
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })

      const response = await api.get(`/feedback/filter?${params}`)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể lọc feedback"
      throw new Error(errorMessage)
    }
  }

  // Chatbot feedback (nếu cần)
  async chatbotFeedback(message: string): Promise<{ response: string }> {
    try {
      const response = await api.post("/feedback/chatbot", { message })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể xử lý yêu cầu chatbot"
      throw new Error(errorMessage)
    }
  }

  // Lấy đánh giá trung bình theo sự kiện
  async getAverageRatingByEvent(eventId: string): Promise<{ averageRating: number; totalFeedbacks: number }> {
    try {
      const response = await api.get(`/feedback/average/event/${eventId}`)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Không thể tải đánh giá trung bình"
      throw new Error(errorMessage)
    }
  }
}

export const feedbackService = new FeedbackService()
