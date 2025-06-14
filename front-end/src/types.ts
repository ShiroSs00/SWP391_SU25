// Blood Types and Compatibility
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodComponent = 'whole_blood' | 'red_blood_cells' | 'plasma' | 'platelets';

export interface BloodCompatibility {
    donor: BloodType[];
    recipient: BloodType[];
}

// User Types
export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    bloodType: BloodType;
    address: Address;
    role: 'donor' | 'recipient' | 'admin' | 'medical_staff';
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

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
export interface Notification {
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