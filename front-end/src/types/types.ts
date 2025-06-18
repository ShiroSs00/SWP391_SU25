
// Blood Types and Compatibility

export interface BloodCompatibility {
    donor: BloodType[];
    recipient: BloodType[];
}

// User Types


export interface Address {
    street: string;
    city: string;
    district: string;
    province: string;
    postalCode: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

// Donor Profile
export interface DonorProfile {
    id: string;
    userId: string;
    lastDonationDate?: Date;
    nextEligibleDate?: Date;
    totalDonations: number;
    weight: number;
    height: number;
    medicalConditions: string[];
    emergencyContact: EmergencyContact;
    availability: DonorAvailability[];
    isActive: boolean;
    donationHistory: DonationRecord[];
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
}

export interface DonorAvailability {
    id: string;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    isRecurring: boolean;
    specificDate?: Date;
}

// Blood Requests
export interface BloodRequest {
    id: string;
    requesterId: string;
    patientName: string;
    bloodType: BloodType;
    component: BloodComponent;
    unitsRequired: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    hospitalName: string;
    hospitalAddress: Address;
    requestDate: Date;
    requiredDate: Date;
    description: string;
    status: 'pending' | 'partially_fulfilled' | 'fulfilled' | 'cancelled' | 'expired';
    donations: DonationAppointment[];
    createdAt: Date;
    updatedAt: Date;
}

// Donation Records
export interface DonationRecord {
    id: string;
    donorId: string;
    requestId?: string;
    donationDate: Date;
    bloodType: BloodType;
    component: BloodComponent;
    unitsCollected: number;
    location: string;
    medicalStaffId: string;
    preScreeningResults: PreScreeningResult;
    postDonationNotes?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    qrCode?: string;
    createdAt: Date;
}

export interface PreScreeningResult {
    hemoglobin: number;
    bloodPressure: {
        systolic: number;
        diastolic: number;
    };
    pulse: number;
    temperature: number;
    weight: number;
    eligibilityCheck: boolean;
    notes?: string;
    screeningDate: Date;
    medicalStaffId: string;
}

// Appointments
export interface DonationAppointment {
    id: string;
    donorId: string;
    requestId?: string;
    appointmentDate: Date;
    timeSlot: string;
    location: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    reminderSent: boolean;
    qrCode: string;
    notes?: string;
    createdAt: Date;
}

// Blood Inventory
export interface BloodInventory {
    id: string;
    bloodType: BloodType;
    component: BloodComponent;
    unitsAvailable: number;
    unitsReserved: number;
    expirationDate: Date;
    location: string;
    donationRecordId: string;
    status: 'available' | 'reserved' | 'expired' | 'used';
    lastUpdated: Date;
}

// Medical Facility
export interface MedicalFacility {
    id: string;
    name: string;
    type: 'hospital' | 'blood_bank' | 'clinic';
    address: Address;
    phone: string;
    email: string;
    license: string;
    isActive: boolean;
    operatingHours: OperatingHours[];
    services: string[];
}

export interface OperatingHours {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
}

// Dashboard & Reports
export interface DashboardStats {
    totalDonors: number;
    activeDonors: number;
    totalDonations: number;
    monthlyDonations: number;
    bloodInventory: BloodInventoryStats[];
    pendingRequests: number;
    urgentRequests: number;
    upcomingAppointments: number;
}

export interface BloodInventoryStats {
    bloodType: BloodType;
    component: BloodComponent;
    unitsAvailable: number;
    daysToExpiry: number;
    status: 'adequate' | 'low' | 'critical' | 'expired';
}

// Search & Filter Types
export interface SearchFilters {
    bloodType?: BloodType;
    component?: BloodComponent;
    location?: {
        lat: number;
        lng: number;
        radius: number; // in kilometers
    };
    urgency?: 'low' | 'medium' | 'high' | 'critical';
    availability?: {
        fromDate: Date;
        toDate: Date;
    };
}

export interface SearchResult {
    donors?: DonorProfile[];
    requests?: BloodRequest[];
    inventory?: BloodInventory[];
    distance?: number;
}

// Notification Types
export interface UserNotification {
    id: string;
    userId: string;
    type: 'reminder' | 'request' | 'appointment' | 'system' | 'emergency';
    title: string;
    message: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
    createdAt: Date;
    expiresAt?: Date;
}

// Form Types
export interface DonorRegistrationForm {
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        gender: string;
    };
    medicalInfo: {
        bloodType: BloodType;
        weight: number;
        height: number;
        medicalConditions: string[];
        lastDonationDate?: string;
    };
    address: Address;
    emergencyContact: EmergencyContact;
    availability: DonorAvailability[];
    consent: boolean;
}

export interface BloodRequestForm {
    patientInfo: {
        name: string;
        bloodType: BloodType;
        age: number;
        condition: string;
    };
    requestDetails: {
        component: BloodComponent;
        unitsRequired: number;
        urgencyLevel: string;
        requiredDate: string;
        description: string;
    };
    hospitalInfo: {
        name: string;
        address: Address;
        contactPerson: string;
        phone: string;
    };
}

// API Response Types

// Base Types
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type BloodComponent = 'whole_blood' | 'red_blood_cells' | 'plasma' | 'platelets';
export type UserRole = 'MEMBER' | 'ADMIN' | 'STAFF';
export type Gender = 'male' | 'female' | 'other';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type RequestStatus = 'pending' | 'approved' | 'fulfilled' | 'cancelled';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type DonationStatus = 'completed' | 'scheduled' | 'cancelled';

// Base Entity với timestamps
export interface BaseEntity {
    createdAt: Date;
    updatedAt?: Date;
}

// Account Entity - Chỉ thông tin đăng nhập
export interface Account {
    accountId: string; // UUID Primary Key
    username: string;
    email: string;
    password?: string; // Optional for display
    isActive: boolean;
    role: UserRole;
}

// Profile Entity - Thông tin cá nhân
export interface Profile {
    profileId: number; // INT Primary Key
    accountId: string; // UUID Foreign Key
    name: string;
    phone: string;
    email?: string; // Optional for display
    address: string;
    dob: Date | string;
    gender: Gender | boolean; // Support both formats
    numberOfBloodDonation: number;
    achievementName?: string;
    achievement?: number; // Achievement score
    bloodCode?: BloodType | string; // Blood type
    readableDate?: Date;
    role : UserRole; // Role for easy access
}

// User - Kết hợp Account + Profile (hợp lý vì thường dùng chung)
export interface User extends BaseEntity {
    // Account info
    accountId: string;
    username: string;
    email: string;
    password?: string;
    isActive?: boolean;
    role: UserRole;

    // Profile info
    profileId?: number;
    name: string;
    phone: string;
    address: string;
    dob: Date | string;
    gender: Gender | boolean;
    numberOfBloodDonation: number;
    achievementName?: string;
    achievement?: number;
    bloodCode?: BloodType | string;
    readableDate?: Date;
}

// Hospital Entity - Giữ riêng vì có logic riêng
export interface Hospital {
    hospitalId: string; // VARCHAR Primary Key
    name: string;
    address: string;
    phone: string;
    hospitalEmail: string;
}

// Component Entity - Giữ riêng vì có thể mở rộng
export interface Component {
    componentId: string; // VARCHAR Primary Key
    description: string;
}

// Blood Entity - Giữ riêng vì phức tạp
export interface Blood {
    bloodCode: number; // INT Primary Key
    bloodType: BloodType;
    componentId: string; // VARCHAR Foreign Key
    isUsed: boolean;
    usedBlood: boolean;
    volume: number;
    quantity: number;
    bloodTypeId?: number;
    expirationDate?: Date;
    location?: string;
}

// BloodRequest Entity - Giữ riêng vì có business logic riêng
export interface BloodRequest extends BaseEntity {
    idBloodRequest: number; // INT Primary Key
    accountId: string; // UUID Foreign Key
    hospitalId: string; // VARCHAR Foreign Key
    requestedDate: Date;
    bloodCode: number; // Foreign Key
    urgency: UrgencyLevel;
    status: "expired" | "pending" | "partially_fulfilled" | "fulfilled" | "cancelled";
    volume: number;
    quantity: number;

    // Populated fields (optional)
    requester?: User;
    hospital?: Hospital;
    bloodUnit?: Blood;
}

// BloodDonationEvent Entity - Giữ riêng vì quản lý event phức tạp
export interface BloodDonationEvent extends BaseEntity {
    eventId: string; // VARCHAR Primary Key
    nameOfEvent: string;
    startDate: Date;
    endDate: Date;
    expirationDate: Date;
    expectedVolume: number;
    actualVolume: number;
    location: string;
    status: EventStatus;
}

// BloodDonationHistory Entity - Giữ riêng vì có nhiều relationship
export interface BloodDonationHistory extends BaseEntity {
    historyId: number; // INT Primary Key
    accountId: string; // UUID Foreign Key
    eventId?: string; // VARCHAR Foreign Key
    bloodType: BloodType;
    component: BloodComponent;
    bloodVolume: number;
    locationDonated: string;
    healthStatus: string;
    status: DonationStatus;
}

// HealthCheck Entity - Giữ riêng vì có thể dùng độc lập
export interface HealthCheck {
    id: string; // UUID Primary Key
    registrationId: string; // UUID Foreign Key
    weight: number;
    temperature: number;
    bloodPressure: string;
    hemoglobin: number;
    isPEDetails: boolean;
    note?: string;
}

// DonationRegistration Entity - Giữ riêng vì có workflow riêng
export interface DonationRegistration {
    registrationId: string; // UUID Primary Key
    accountId: string; // UUID Foreign Key
    component: string;
    postDate: Date;
    comment?: string;
    tagName?: string;
}

// DonorFeedback Entity - Giữ riêng vì có thể analyze riêng
export interface DonorFeedback {
    feedbackId: number; // INT Primary Key
    registrationId: string; // UUID Foreign Key
    process: number;
    bloodTest: number;
    postDonationCare: number;
    comfortable: number;
    description?: string;
}

// Blog Entity - Giữ riêng vì có content management riêng
export interface Blog extends BaseEntity {
    blogId: number; // INT Primary Key
    content: string;
    postDate: Date;
    component: string; // ENUM
    accountId: string; // UUID Foreign Key
    tagName?: string;
}

// Notification Entity - Giữ riêng vì có notification logic riêng
export interface Notification {
    notificationId: number; // INT Primary Key
    accountId: string; // UUID Foreign Key
    title: string;
    content: string;
    img?: string;
    isRead?: boolean;
    priority?: 'low' | 'medium' | 'high';
    createdAt: Date;
}

// RoleInSystem Entity - Giữ riêng vì system config
export interface RoleInSystem {
    roleId: number; // INT Primary Key
    name: string;
    description: string;
}

// Achievement Entity - Giữ riêng vì gamification logic
export interface Achievement {
    achievementName: string; // VARCHAR Primary Key
    description: string;
    icon?: string;
    criteria?: string;
}

// Dashboard Stats - Kết hợp stats vì thường dùng chung
export interface DashboardStats {
    userStats: {
        totalDonors: number;
        activeDonors: number;
        newRegistrations: number;
    };

    donationStats: {
        totalDonations: number;
        monthlyDonations: number;
        upcomingEvents: number;
        completedEvents: number;
    };

    requestStats: {
        pendingRequests: number;
        urgentRequests: number;
        fulfilledRequests: number;
    };

    bloodInventory: BloodInventoryItem[];
}

export interface BloodInventoryItem {
    bloodType: BloodType;
    component: BloodComponent;
    unitsAvailable: number;
    daysToExpiry: number;
    status: 'adequate' | 'low' | 'critical' | 'expired';
}

// Search & Filter - Giữ đơn giản
export interface SearchFilters {
    bloodType?: BloodType;
    component?: BloodComponent;
    location?: {
        lat: number;
        lng: number;
        radius: number; // in kilometers
    };
    urgency?: UrgencyLevel;
    status?: RequestStatus | EventStatus | DonationStatus;
    dateRange?: {
        from: Date;
        to: Date;
    };
    userId?: string;
}

// API Response Types - Cần thiết cho API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BloodOrder {
  id: number;
  user: string;
  type: "Hiến máu" | "Nhận máu";
  date: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối" | "Hoàn thành";
  bloodType: string;
  component?: string;
  volume?: number;
  hospital?: string; // Made optional to match usage
  urgency?: boolean; // Changed to boolean to match table logic
  note?: string; // Made optional to match usage
}
  
// DTOs - Chỉ những cái thực sự cần
export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    name: string;
    phone: string;
    address: string;
    dob: Date | string;
    gender: Gender | boolean;
}

export interface UpdateProfileDto {
    name?: string;
    phone?: string;
    address?: string;
    dob?: Date | string;
    gender?: Gender | boolean;
    achievementName?: string;
    bloodCode?: BloodType | string;
}

export interface CreateBloodRequestDto {
    accountId: string;
    hospitalId: string;
    requestedDate: Date;
    bloodCode: number;
    urgency: UrgencyLevel;
    volume: number;
    quantity: number;
}

export interface CreateEventDto {
    nameOfEvent: string;
    startDate: Date;
    endDate: Date;
    expirationDate: Date;
    expectedVolume: number;
    location: string;
}

export interface HealthCheckDto {
    registrationId: string;
    weight: number;
    temperature: number;
    bloodPressure: string;
    hemoglobin: number;
    isPEDetails: boolean;
    note?: string;
}

export interface FeedbackDto {
    registrationId: string;
    process: number;
    bloodTest: number;
    postDonationCare: number;
    comfortable: number;
    description?: string;
}

// Utility Types - Hữu ích cho development
export type UserWithoutPassword = Omit<User, 'password'>;
export type PublicProfile = Pick<Profile, 'name' | 'numberOfBloodDonation' | 'achievementName' | 'bloodCode'>;
export type BloodRequestSummary = Pick<BloodRequest, 'idBloodRequest' | 'urgency' | 'status' | 'volume' | 'requestedDate'>;

// Blood Compatibility Logic - Business logic
export interface BloodCompatibilityRules {
    [key: string]: {
        canDonateTo: BloodType[];
        canReceiveFrom: BloodType[];
    };

}