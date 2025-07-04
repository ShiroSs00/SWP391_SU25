export interface DonorFeedback {
  feedbackId: string;
  registrationId: string;
  donorName?: string;
  donorEmail?: string;
  process: number; // 1-5 rating
  bloodTest: number; // 1-5 rating
  postDonationCare: number; // 1-5 rating
  comfortable: number; // 1-5 rating
  overallSatisfaction: number; // 1-5 rating
  description: string;
  staffReply?: string;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'replied' | 'resolved';
}

export interface CreateFeedbackRequest {
  process: number;
  bloodTest: number;
  postDonationCare: number;
  comfortable: number;
  overallSatisfaction: number;
  description: string;
}

export interface UpdateFeedbackRequest {
  staffReply: string;
}

export interface FeedbackFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  minRating?: number;
  maxRating?: number;
  status?: 'pending' | 'replied' | 'resolved' | 'all';
  sortBy?: 'createdAt' | 'overallSatisfaction' | 'process' | 'bloodTest' | 'postDonationCare' | 'comfortable';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  pendingCount: number;
  repliedCount: number;
  resolvedCount: number;
  ratingDistribution: {
    [key: number]: number;
  };
  categoryAverages: {
    process: number;
    bloodTest: number;
    postDonationCare: number;
    comfortable: number;
    overallSatisfaction: number;
  };
  monthlyStats: {
    month: string;
    count: number;
    averageRating: number;
  }[];
}

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  response: string;
  suggestions?: string[];
}