export interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  birthDate: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  avatar?: string;
  isAvailableToDonate: boolean;
  temporaryDeferral: boolean;
  notificationRange: number;
  emergencyNotifications: boolean;
  getNotifications: boolean;
  sendToFamily: boolean;
  rangeNotifications: number;
  // Real API fields
  accountId: string;
  address?: string;
  dateCreated?: string;
  status?: string;
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


export interface DonationRecord {
  id: string;
  name: string;
  event: string;
  bloodCode: string;
  volumeToTake: number;
  healCheck?: string;
  healthCheck?: string; // Alternative spelling
  afterDonationBlood: string;
  status: string;
  type: 'donation' | 'receiving';
  donorFeedbackId?: DonorFeedback;
  date: string;
  location: string;
  registerId: string;
  volume?: number; // For blood requests
  feedback?: DonorFeedback;

  // Blood request specific fields
  requesterName?: string;
  requesterPhone?: string;
  requesterEmail?: string;
  requesterAddress?: string;
  bloodType?: string;
  component?: string;
  emergency?: boolean;
  requestCreationDate?: string;
  processedBy?: string | null;
  processedDate?: string | null;
  rejectionReason?: string | null;
  bloodBagId?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  requestDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  dateUnlocked?: string;
  // Real API fields
  achievementId?: string;
  achievementName?: string;
  name?: string;
  achieved?: boolean;
  target?: number;
  minValue?: number;
  maxValue?: number;
  currentValue?: number;
}

export interface PointsData {
  totalPoints: number;
  breakdown: {
    source: string;
    points: number;
    date: string;
  }[];
  availableRewards: {
    id: string;
    title: string;
    cost: number;
    description: string;
  }[];
}

export interface EventParticipation {
  id: string;
  eventName: string;
  date: string;
  location: string;
  role: 'Donor' | 'Volunteer';
  banner?: string;
  status: 'Completed' | 'UPCOMING' | 'Cancelled';
  // Real API fields
  eventId?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  description?: string;
}

export interface FeedbackItem {
  id: string;
  relatedRecordId: string;
  message: string;
  rating: number;
  date: string;
  response?: string;
  // Real API fields
  registrationId?: string;
  dateCreated?: string;
  dateUpdated?: string;
  adminResponse?: string;
}

// Additional types for Real API responses
export interface BloodRequest {
  id: string;
  requestId?: string;
  bloodType: string;
  volume: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: string;
  location: string;
  dateCreated: string;
  requestDate?: string;
  description?: string;
}

export interface Event {
  id: string;
  eventId?: string;
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate?: string;
  banner?: string;
  image?: string;
  status: string;
  maxParticipants?: number;
  currentParticipants?: number;
}

export interface BloodDonationHistory {
  id: string;
  name: string;
  event: string;
  bloodCode: string;
  volumeToTake: string;
  healthCheck: string;
  afterDonationBlood: string;
  registerId: string;
  status: string;
  donationDate?: string;
  dateCreated: string;
  location?: string;
}

export interface AfterDonationBlood {
  idAfterDonation: string;
  infectiousDiseasesChecked: boolean;
  isBloodUsable: boolean;
  status: string;
  note: string;
  healthCheckId: string;
  bloodId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface EmergencyRequest {
  id: string;
  bloodType: string;
  volume: number;
  urgency: 'Emergency';
  location: string;
  contactInfo: string;
  dateCreated: string;
  status: 'Active' | 'Fulfilled' | 'Cancelled';
}

export interface OptimizedDonor {
  profileId: string;
  accountId: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  isActive: boolean;
  distance?: number;
  lastDonation?: string;
}

