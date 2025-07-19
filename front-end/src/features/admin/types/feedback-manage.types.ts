export interface Feedback {
  feedbackId: string;
  process: number;
  bloodTest: number;
  postDonationCare: number;
  comfortable: number;
  description: string;
  registrationId: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data: Feedback[];
  errors?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
}

export interface FeedbackApiResponse {
  success: boolean;
  message: string;
  data: Feedback[];
}
