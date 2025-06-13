// Base Types
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type BloodComponent = 'whole_blood' | 'red_blood_cells' | 'plasma' | 'platelets';
export type UserRole = 'member' | 'admin' | 'medical_staff' | 'guest';
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
    status: RequestStatus;
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
    location?: string;
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