export interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  gender: "Male" | "Female" | "Other"
  birthDate: string
  bloodType: string
  avatar?: string
  isAvailableToDonate: boolean
  temporaryDeferral: boolean
  notificationRange: number
  emergencyNotifications: boolean
  getNotifications: boolean
  sendToFamily: boolean
  rangeNotifications: number
  accountId: string
  address: string
  dateCreated?: string
  status: string
}

export interface DonationRecord {
  id: string
  name: string
  event: string
  bloodCode: string
  volumeToTake: number
  volume: number
  healCheck: string
  healthCheck: string
  afterDonationBlood: string
  status: string
  type: "donation" | "receiving"
  feedback: string
  date: string
  location: string
  registerId: string
  donorFeedbackId?: DonorFeedback

  // Blood request specific fields (for receiving type)
  requesterName?: string
  requesterPhone?: string
  requesterEmail?: string
  requesterAddress?: string
  bloodType?: string
  component?: string
  emergency?: boolean
  requestCreationDate?: string
  processedBy?: string
  processedDate?: string
  rejectionReason?: string
  contactPhone?: string
  contactEmail?: string
  requestDate?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  tier: "Bronze" | "Silver" | "Gold" | "Platinum"
  isUnlocked: boolean
  progress: number
  maxProgress: number
  dateUnlocked?: string
  achievementId?: string
  name?: string
  achieved?: boolean
}

export interface PointsData {
  totalPoints: number
  breakdown: Array<{
    source: string
    points: number
    date: string
  }>
  availableRewards: Array<{
    id: string
    title: string
    cost: number
    description: string
  }>
}

export interface EventParticipation {
  id: string
  eventName: string
  date: string
  location: string
  role: "Donor" | "Volunteer" | "Organizer"
  banner?: string
  status: "UPCOMING" | "COMPLETED" | "ONGOING"
  eventId?: string
  name?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface FeedbackItem {
  id: string
  relatedRecordId: string
  message: string
  rating: number
  date: string
  response?: string
  registrationId?: string
  dateCreated?: string
  dateUpdated?: string
}

export interface DonorFeedback {
  feedbackId: string
  registrationId: string
  process: number // Rating cho quy trình
  bloodTest: number // Rating cho xét nghiệm máu
  postDonationCare: number // Rating cho chăm sóc sau hiến máu
  comfortable: number // Rating cho sự thoải mái
  description: string // Mô tả chi tiết
}

// Dashboard summary types
export interface DashboardSummary {
  totalDonations: number
  totalVolume: number
  nextAppointment?: string
  recentAchievements: Achievement[]
  upcomingEvents: EventParticipation[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Filter types
export interface FeedbackFilter {
  rating?: number
  dateFrom?: string
  dateTo?: string
  eventId?: string
  registrationId?: string
}

export interface DonationFilter {
  status?: string
  dateFrom?: string
  dateTo?: string
  bloodType?: string
  eventId?: string
}
