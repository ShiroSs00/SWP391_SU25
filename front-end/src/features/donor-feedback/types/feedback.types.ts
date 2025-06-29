export interface Feedback {
  id: string;
  registrationId: string;
  donationId: string;
  rating: number;
  comment: string;
  category: FeedbackCategory;
  isAnonymous: boolean;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
  donorInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreateFeedbackRequest {
  registrationId: string;
  rating: number;
  comment: string;
  category: FeedbackCategory;
  isAnonymous: boolean;
}

export interface UpdateFeedbackRequest {
  rating?: number;
  comment?: string;
  category?: FeedbackCategory;
  isAnonymous?: boolean;
  status?: FeedbackStatus;
}

export interface FeedbackFilter {
  category?: FeedbackCategory;
  rating?: number;
  status?: FeedbackStatus;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  categoryBreakdown: Record<FeedbackCategory, number>;
  ratingDistribution: Record<number, number>;
}

// String constants instead of enums
export const FeedbackCategory = {
  STAFF_SERVICE: 'STAFF_SERVICE',
  FACILITY_CLEANLINESS: 'FACILITY_CLEANLINESS',
  DONATION_PROCESS: 'DONATION_PROCESS',
  WAITING_TIME: 'WAITING_TIME',
  OVERALL_EXPERIENCE: 'OVERALL_EXPERIENCE',
  GENERAL_SUGGESTION: 'GENERAL_SUGGESTION'
} as const;

export const FeedbackStatus = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  RESOLVED: 'RESOLVED'
} as const;

// Type unions for type safety
export type FeedbackCategory = typeof FeedbackCategory[keyof typeof FeedbackCategory];
export type FeedbackStatus = typeof FeedbackStatus[keyof typeof FeedbackStatus];

export interface SurveyResponse {
  registrationId: string;
  questions: {
    questionId: string;
    answer: string | number;
  }[];
  additionalComments?: string;
}

export interface DonationInfo {
  id: string;
  donationDate: string;
  location: string;
  bloodType: string;
  status: string;
}