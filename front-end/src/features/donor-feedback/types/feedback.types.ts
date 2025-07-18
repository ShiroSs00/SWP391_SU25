// Feedback types for the donation system
export interface CreateFeedbackRequest {
  process: number; // 1-5 rating for donation process
  bloodTest: number; // 1-5 rating for blood test
  postDonationCare: number; // 1-5 rating for post-donation care
  comfortable: number; // 1-5 rating for comfort level
  description: string; // Detailed feedback description
}

export interface UpdateFeedbackRequest {
  process?: number;
  bloodTest?: number;
  postDonationCare?: number;
  comfortable?: number;
  description?: string;
}

export interface DonorFeedback {
  feedbackId: string;
  registrationId: string;
  process: number;
  bloodTest: number;
  postDonationCare: number;
  comfortable: number;
  description: string;
}

export interface FeedbackResponse {
  id: string;
  registrationId: string;
  userId?: string;
  process: number;
  bloodTest: number;
  postDonationCare: number;
  comfortable: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  registration?: {
    id: string;
    donationDate: string;
    location: string;
    status: string;
  };
}

export interface FeedbackListResponse {
  feedbacks: DonorFeedback[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FeedbackStats {
  totalFeedbacks: number;
  averageRatings: {
    process: number;
    bloodTest: number;
    postDonationCare: number;
    comfortable: number;
  };
  ratingDistribution: {
    [key: number]: number; // rating -> count
  };
  recentFeedbacks?: DonorFeedback[];
}

export interface FeedbackFilter {
  registrationId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EventFeedbackAverage {
  eventId: string;
  averageRatings: {
    process: number;
    bloodTest: number;
    postDonationCare: number;
    comfortable: number;
  };
  totalFeedbacks: number;
}

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  response: string;
}

// Error response type
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}