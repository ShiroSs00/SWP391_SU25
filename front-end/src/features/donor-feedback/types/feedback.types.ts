export interface Feedback {
  id: string;
  donorId: string;
  donationId?: string;
  rating: number;
  category: FeedbackCategory;
  title: string;
  message: string;
  isAnonymous: boolean;
  status: FeedbackStatus;
  response?: string;
  respondedBy?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type FeedbackCategory = 
  | 'service_quality'
  | 'staff_behavior'
  | 'facility_cleanliness'
  | 'waiting_time'
  | 'overall_experience'
  | 'suggestion'
  | 'complaint';

export type FeedbackStatus = 'pending' | 'reviewed' | 'responded' | 'resolved';

export interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
  categoryBreakdown: {
    [key in FeedbackCategory]: number;
  };
  responseRate: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  isActive: boolean;
  targetAudience: 'all' | 'first_time' | 'regular' | 'vip';
  createdAt: Date;
  expiresAt?: Date;
}

export interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'yes_no';
  question: string;
  options?: string[];
  required: boolean;
  order: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  donorId: string;
  responses: {
    questionId: string;
    answer: string | number;
  }[];
  completedAt: Date;
}

export interface FeedbackForm {
  rating: number;
  category: FeedbackCategory;
  title: string;
  message: string;
  isAnonymous: boolean;
  donationId?: string;
}