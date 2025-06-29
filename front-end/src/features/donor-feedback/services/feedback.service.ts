
import type{
    Feedback,
    FeedbackForm,
    FeedbackStatus,
    Survey,
    SurveyResponse,
    ChatbotRequest,
    ChatbotResponse,
    FeedbackFilters,
    DashboardData,
    EventAverageData,
    PaginatedFeedbackResponse, // Sửa lại tên đúng
    BulkUpdateRequest,
    SearchFeedbackResponse,    // Sửa lại tên đúng
    SearchOptions
} from "../types/feedback.types";

class FeedbackService {
    private baseUrl = '/api/feedback';

    // Helper method for making authenticated requests
    private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        };

        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        return response.json();
    }

    // ===== CRUD OPERATIONS =====

    // POST /api/feedback - Create new feedback
    async submitFeedback(feedback: FeedbackForm): Promise<Feedback> {
        return this.makeRequest<Feedback>(this.baseUrl, {
            method: 'POST',
            body: JSON.stringify(feedback)
        });
    }

    // GET /api/feedback/{id} - Get feedback by ID
    async getFeedbackById(id: string): Promise<Feedback> {
        return this.makeRequest<Feedback>(`${this.baseUrl}/${id}`);
    }

    // PUT /api/feedback/update/{registrationId}
    async updateFeedbackByRegistration(registrationId: string, feedback: Partial<FeedbackForm>): Promise<Feedback> {
        return this.makeRequest<Feedback>(`${this.baseUrl}/update/${registrationId}`, {
            method: 'PUT',
            body: JSON.stringify(feedback)
        });
    }

    // POST /api/feedback/create/{registrationId}
    async createFeedbackByRegistration(registrationId: string, feedback: FeedbackForm): Promise<Feedback> {
        return this.makeRequest<Feedback>(`${this.baseUrl}/create/${registrationId}`, {
            method: 'POST',
            body: JSON.stringify(feedback)
        });
    }

    // DELETE /api/feedback/delete/{id}
    async deleteFeedback(id: string): Promise<{ message: string }> {
        return this.makeRequest<{ message: string }>(`${this.baseUrl}/delete/${id}`, {
            method: 'DELETE'
        });
    }

    // DELETE /api/feedback/delete-multiple
    async deleteMultipleFeedbacks(ids: string[]): Promise<{ message: string; deletedCount: number }> {
        return this.makeRequest<{ message: string; deletedCount: number }>(`${this.baseUrl}/delete-multiple`, {
            method: 'DELETE',
            body: JSON.stringify({ ids })
        });
    }

    // ===== FEEDBACK MANAGEMENT =====

    // Respond to feedback
    async respondToFeedback(id: string, response: string): Promise<Feedback> {
        return this.makeRequest<Feedback>(`${this.baseUrl}/${id}/respond`, {
            method: 'PUT',
            body: JSON.stringify({ response })
        });
    }

    // Update feedback status
    async updateFeedbackStatus(id: string, status: FeedbackStatus): Promise<Feedback> {
        return this.makeRequest<Feedback>(`${this.baseUrl}/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // ===== DATA RETRIEVAL =====

    // GET /api/feedback/getall
    async getAllFeedbacks(page = 1, limit = 10): Promise<PaginatedFeedbackResponse> {
        return this.makeRequest<PaginatedFeedbackResponse>(`${this.baseUrl}/getall?page=${page}&limit=${limit}`);
    }

    // GET /api/feedback - Original method with pagination
    async getFeedbacks(page = 1, limit = 10): Promise<PaginatedFeedbackResponse> {
        return this.makeRequest<PaginatedFeedbackResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`);
    }

    // GET /api/feedback/get-by-registration/{registrationId}
    async getFeedbackByRegistration(registrationId: string): Promise<Feedback[]> {
        return this.makeRequest<Feedback[]>(`${this.baseUrl}/get-by-registration/${registrationId}`);
    }

    // Get feedback by donor
    async getFeedbackByDonor(donorId: string): Promise<Feedback[]> {
        return this.makeRequest<Feedback[]>(`${this.baseUrl}/donor/${donorId}`);
    }

    // Get feedback by donation
    async getFeedbackByDonation(donationId: string): Promise<Feedback[]> {
        return this.makeRequest<Feedback[]>(`${this.baseUrl}/donation/${donationId}`);
    }

    // Get feedback by category
    async getFeedbackByCategory(category: string): Promise<Feedback[]> {
        return this.makeRequest<Feedback[]>(`${this.baseUrl}/category/${category}`);
    }

    // Get feedback by status
    async getFeedbackByStatus(status: FeedbackStatus): Promise<Feedback[]> {
        return this.makeRequest<Feedback[]>(`${this.baseUrl}/status/${status}`);
    }

    // GET /api/feedback/filter
    async getFilteredFeedbacks(filters: FeedbackFilters): Promise<PaginatedFeedbackResponse> {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.makeRequest<PaginatedFeedbackResponse>(`${this.baseUrl}/filter?${params.toString()}`);
    }

    // ===== ANALYTICS & REPORTING =====

    // GET /api/feedback/stats
    // async getFeedbackStats(): Promise<FeedbackStats> {
    //     return this.makeRequest<FeedbackStats>(`${this.baseUrl}/stats`);
    // }

    // GET /api/feedback/dashboard
    async getDashboardData(): Promise<DashboardData> {
        return this.makeRequest<DashboardData>(`${this.baseUrl}/dashboard`);
    }

    // GET /api/feedback/average/event/{eventId}
    async getEventAverageRating(eventId: string): Promise<EventAverageData> {
        return this.makeRequest<EventAverageData>(`${this.baseUrl}/average/event/${eventId}`);
    }

    // ===== CHATBOT INTEGRATION =====

    // POST /api/feedback/chatbot
    async sendChatbotMessage(request: ChatbotRequest): Promise<ChatbotResponse> {
        return this.makeRequest<ChatbotResponse>(`${this.baseUrl}/chatbot`, {
            method: 'POST',
            body: JSON.stringify(request)
        });
    }

    // ===== SURVEY OPERATIONS =====

    // Get all surveys
    async getSurveys(): Promise<Survey[]> {
        return this.makeRequest<Survey[]>(`${this.baseUrl}/surveys`);
    }

    // Submit survey response
    async submitSurveyResponse(surveyId: string, responses: SurveyResponse[]): Promise<SurveyResponse> {
        return this.makeRequest<SurveyResponse>(`${this.baseUrl}/surveys/${surveyId}/responses`, {
            method: 'POST',
            body: JSON.stringify({ responses })
        });
    }

    // ===== UTILITY METHODS =====

    // Bulk operations
    async bulkUpdateFeedbacks(updates: BulkUpdateRequest['updates']): Promise<Feedback[]> {
        return this.makeRequest<Feedback[]>(`${this.baseUrl}/bulk-update`, {
            method: 'PUT',
            body: JSON.stringify({ updates })
        });
    }

    // Export feedbacks
    async exportFeedbacks(format: 'csv' | 'xlsx' = 'csv', filters?: FeedbackFilters): Promise<Blob> {
        const params = new URLSearchParams({ format });

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await fetch(`${this.baseUrl}/export?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to export feedbacks');
        }

        return response.blob();
    }

    // Search feedbacks with advanced options
    async searchFeedbacks(query: string, options?: SearchOptions): Promise<SearchFeedbackResponse> {
        const params = new URLSearchParams({ query });

        if (options) {
            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, value.toString());
                    }
                }
            });
        }

        return this.makeRequest<SearchFeedbackResponse>(`${this.baseUrl}/search?${params.toString()}`);
    }

    // Get feedback statistics by date range

}

export const feedbackService = new FeedbackService();
