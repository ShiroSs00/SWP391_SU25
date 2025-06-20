import { Feedback, FeedbackForm, FeedbackStats, Survey, SurveyResponse } from '../types/feedback.types';

class FeedbackService {
  private baseUrl = '/api/feedback';

  async submitFeedback(feedback: FeedbackForm): Promise<Feedback> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(feedback)
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    return response.json();
  }

  async getFeedbacks(page = 1, limit = 10): Promise<{
    feedbacks: Feedback[];
    total: number;
    totalPages: number;
  }> {
    const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedbacks');
    }

    return response.json();
  }

  async getFeedbackById(id: string): Promise<Feedback> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    return response.json();
  }

  async getFeedbackStats(): Promise<FeedbackStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback stats');
    }

    return response.json();
  }

  async getSurveys(): Promise<Survey[]> {
    const response = await fetch(`${this.baseUrl}/surveys`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch surveys');
    }

    return response.json();
  }

  async submitSurveyResponse(surveyId: string, responses: SurveyResponse['responses']): Promise<SurveyResponse> {
    const response = await fetch(`${this.baseUrl}/surveys/${surveyId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ responses })
    });

    if (!response.ok) {
      throw new Error('Failed to submit survey response');
    }

    return response.json();
  }
}

export const feedbackService = new FeedbackService();