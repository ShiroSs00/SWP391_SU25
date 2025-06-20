import {
    UserRole,
    BloodTypeABO,
    BloodTypeRh,
    BloodComponentType,
    Gender,
    NotificationType,
    RequestStatus,
    RequestPriority,
    DonationStatus,
    BloodUnitStatus,
    AppointmentStatus,
    HealthCheckStatus
} from '../utils/enums';

// Base types
export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TimestampedEntity extends BaseEntity {
    createdBy?: string;
    updatedBy?: string;
}

// User related types
export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    gender: Gender;
    nationalId: string;
    address: string;
    city: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    bloodType: BloodType;
    role: UserRole;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt?: string;
    profilePicture?: string;
    preferences: UserPreferences;
    medicalProfile: MedicalProfile;
    donorProfile?: DonorProfile;
    stats: UserStats;
}

export interface UserPreferences {
    language: string;
    timezone: string;
    notifications: NotificationPreferences;
    privacy: PrivacySettings;
}

export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
    appointmentReminders: boolean;
    eligibilityNotifications: boolean;
    urgentRequests: boolean;
    newsletters: boolean;
}

export interface PrivacySettings {
    showProfile: boolean;
    showDonationHistory: boolean;
    showAchievements: boolean;
    allowContact: boolean;
}

export interface UserStats {
    totalDonations: number;
    totalVolumeDonated: number; // in ml
    points: number;
    achievementCount: number;
    referralCount: number;
    lastDonationDate?: string;
    nextEligibleDate?: string;
}

// Blood type
export interface BloodType {
    abo: BloodTypeABO;
    rh: BloodTypeRh;
}

// Medical profile
export interface MedicalProfile extends BaseEntity {
    userId: string;
    height: number; // cm
    weight: number; // kg
    bmi: number;
    bloodPressure: BloodPressure;
    heartRate: number; // bpm
    temperature: number; // celsius
    hemoglobin: number; // g/dL
    medicalConditions: string[];
    medications: string[];
    allergies: string[];
    surgeries: Surgery[];
    isEligible: boolean;
    eligibilityNotes?: string;
    lastHealthCheck?: string;
}

export interface BloodPressure {
    systolic: number;
    diastolic: number;
}

export interface Surgery {
    type: string;
    date: string;
    notes?: string;
}

// Donor profile
export interface DonorProfile extends BaseEntity {
    userId: string;
    donorId: string; // Unique donor identifier
    registrationDate: string;
    totalDonations: number;
    totalVolumeDonated: number;
    lastDonationDate?: string;
    nextEligibleDate?: string;
    preferredDonationType: BloodComponentType;
    preferredLocation?: string;
    availabilitySchedule: AvailabilitySchedule;
    emergencyContact: boolean;
    notes?: string;
}

export interface AvailabilitySchedule {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
}

export interface TimeSlot {
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
}

// Blood donation
export interface BloodDonation extends TimestampedEntity {
    donorId: string;
    appointmentId?: string;
    donationDate: string;
    bloodType: BloodType;
    componentType: BloodComponentType;
    volume: number; // ml
    status: DonationStatus;
    location: string;
    staffId: string;
    preScreening: HealthScreening;
    postDonation: PostDonationCare;
    complications?: string[];
    notes?: string;
    bloodUnits: string[]; // Blood unit IDs created from this donation
}

export interface HealthScreening extends BaseEntity {
    donationId: string;
    screeningDate: string;
    staffId: string;
    vitals: VitalSigns;
    questionnaire: HealthQuestionnaire;
    status: HealthCheckStatus;
    notes?: string;
    deferralReason?: string;
    deferralUntil?: string;
}

export interface VitalSigns {
    weight: number;
    bloodPressure: BloodPressure;
    heartRate: number;
    temperature: number;
    hemoglobin: number;
}

export interface HealthQuestionnaire {
    feelingWell: boolean;
    recentIllness: boolean;
    recentTravel: boolean;
    recentVaccination: boolean;
    recentMedication: boolean;
    recentDentalWork: boolean;
    pregnancyOrBreastfeeding: boolean;
    recentTattooOrPiercing: boolean;
    riskBehaviors: boolean;
    additionalNotes?: string;
}

export interface PostDonationCare {
    restTime: number; // minutes
    refreshmentsProvided: boolean;
    adverseReactions: string[];
    instructions: string[];
    followUpRequired: boolean;
    followUpDate?: string;
    notes?: string;
}

// Blood units and inventory
export interface BloodUnit extends TimestampedEntity {
    unitId: string; // Unique identifier
    donationId: string;
    bloodType: BloodType;
    componentType: BloodComponentType;
    volume: number; // ml
    collectionDate: string;
    expirationDate: string;
    status: BloodUnitStatus;
    location: string;
    testResults: TestResult[];
    reservedFor?: string; // Request ID
    usedFor?: string; // Request ID
    notes?: string;
}

export interface TestResult extends BaseEntity {
    bloodUnitId: string;
    testType: string;
    result: 'positive' | 'negative' | 'pending' | 'inconclusive';
    testDate: string;
    technician: string;
    equipment?: string;
    notes?: string;
}

// Blood requests
export interface BloodRequest extends TimestampedEntity {
    requestId: string;
    patientId?: string;
    patientName: string;
    patientAge: number;
    patientGender: Gender;
    requestedBy: string; // User ID of requester
    hospitalId: string;
    bloodType: BloodType;
    componentType: BloodComponentType;
    unitsNeeded: number;
    urgency: RequestPriority;
    reason: string;
    medicalCondition?: string;
    status: RequestStatus;
    requestDate: string;
    neededBy: string;
    fulfilledDate?: string;
    allocatedUnits: string[]; // Blood unit IDs
    notes?: string;
    contactInfo: ContactInfo;
}

export interface ContactInfo {
    name: string;
    phone: string;
    email?: string;
    relationship: string; // e.g., "patient", "family", "doctor"
}

// Appointments
export interface Appointment extends TimestampedEntity {
    appointmentId: string;
    donorId: string;
    hospitalId: string;
    scheduledDate: string;
    scheduledTime: string;
    estimatedDuration: number; // minutes
    donationType: BloodComponentType;
    status: AppointmentStatus;
    staffId?: string;
    checkInTime?: string;
    completionTime?: string;
    notes?: string;
    reminders: AppointmentReminder[];
}

export interface AppointmentReminder {
    type: 'email' | 'sms' | 'push';
    scheduledFor: string;
    sent: boolean;
    sentAt?: string;
}

// Hospitals and locations
export interface Hospital extends BaseEntity {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    website?: string;
    coordinates: Coordinates;
    operatingHours: OperatingHours;
    services: string[];
    capacity: number;
    currentLoad: number;
    bloodBankCapacity: BloodBankCapacity;
    certifications: string[];
    isActive: boolean;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface OperatingHours {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
}

export interface DaySchedule {
    isOpen: boolean;
    openTime?: string; // HH:mm
    closeTime?: string; // HH:mm
    breaks?: TimeSlot[];
}

export interface BloodBankCapacity {
    totalCapacity: number;
    currentStock: number;
    byBloodType: Record<string, number>;
    byComponent: Record<BloodComponentType, number>;
}

// Notifications
export interface Notification extends BaseEntity {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    isRead: boolean;
    readAt?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    expiresAt?: string;
    actionUrl?: string;
    actionLabel?: string;
}

// Achievements and gamification
export interface Achievement extends BaseEntity {
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    pointsAwarded: number;
    criteria: AchievementCriteria;
    isActive: boolean;
}

export interface AchievementCriteria {
    type: 'donation_count' | 'volume_donated' | 'consecutive_donations' | 'referrals';
    target: number;
    timeframe?: string; // e.g., "yearly", "monthly"
}

export interface UserAchievement extends BaseEntity {
    userId: string;
    achievementId: string;
    unlockedAt: string;
    progress: number;
    isCompleted: boolean;
}

// Blog and content
export interface BlogPost extends TimestampedEntity {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    authorId: string;
    publishedAt?: string;
    tags: string[];
    category: string;
    featuredImage?: string;
    isPublished: boolean;
    viewCount: number;
    likeCount: number;
    commentCount: number;
}

export interface BlogComment extends TimestampedEntity {
    postId: string;
    userId: string;
    content: string;
    parentId?: string; // For nested comments
    isApproved: boolean;
    likeCount: number;
}

// System and configuration
export interface SystemConfig extends BaseEntity {
    key: string;
    value: any;
    description?: string;
    category: string;
    isPublic: boolean;
}

export interface AuditLog extends BaseEntity {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}

// API response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
    meta?: ResponseMeta;
}

export interface ResponseMeta {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
    search?: string;
    bloodType?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    [key: string]: any;
}

// Form types
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea';
    required?: boolean;
    placeholder?: string;
    options?: SelectOption[];
    validation?: ValidationRule[];
}

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface ValidationRule {
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    value?: any;
    message: string;
}

// Chart and analytics types
export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
}

export interface AnalyticsData {
    period: string;
    metrics: Record<string, number>;
    trends: Record<string, number>;
    comparisons: Record<string, number>;
}

// File upload types
export interface FileUpload {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    url?: string;
    error?: string;
}

export interface UploadedFile {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: string;
    uploadedBy: string;
}