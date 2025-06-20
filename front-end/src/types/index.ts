export interface User {
    id: string;
    email: string;
    name: string;
    phone: string;
    bloodType: BloodType;
    dateOfBirth: string;
    address: string;
    city: string;
    emergencyContact: string;
    medicalHistory: string[];
    role: 'user' | 'member' | 'staff' | 'admin';
    isEligible: boolean;
    lastDonation?: string;
    nextEligibleDate?: string;
    totalDonations: number;
    points: number;
    achievements: Achievement[];
    createdAt: string;
    updatedAt: string;
}

export interface BloodType {
    abo: 'A' | 'B' | 'AB' | 'O';
    rh: '+' | '-';
}

export interface BloodUnit {
    id: string;
    donorId: string;
    bloodType: BloodType;
    components: BloodComponent[];
    collectionDate: string;
    expirationDate: string;
    status: 'available' | 'reserved' | 'used' | 'expired';
    location: string;
    testResults: TestResult[];
    volume: number;
}

export interface BloodComponent {
    type: 'whole_blood' | 'red_cells' | 'plasma' | 'platelets';
    volume: number;
    expirationDate: string;
    status: 'available' | 'reserved' | 'used' | 'expired';
}

export interface BloodRequest {
    id: string;
    patientId: string;
    requestedBy: string;
    bloodType: BloodType;
    componentType: BloodComponent['type'];
    unitsNeeded: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    reason: string;
    hospitalId: string;
    status: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
    requestDate: string;
    neededBy: string;
    notes?: string;
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    bloodBankCapacity: number;
    currentInventory: BloodInventory[];
    certifications: string[];
    operatingHours: string;
}

export interface BloodInventory {
    bloodType: BloodType;
    componentType: BloodComponent['type'];
    availableUnits: number;
    reservedUnits: number;
    criticalLevel: number;
}

export interface DonationAppointment {
    id: string;
    donorId: string;
    hospitalId: string;
    scheduledDate: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    preScreeningPassed?: boolean;
    donationType: 'whole_blood' | 'plasma' | 'platelets';
    notes?: string;
}

export interface TestResult {
    type: string;
    result: 'positive' | 'negative' | 'pending';
    date: string;
    technician: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    pointsAwarded: number;
    unlockedAt: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'appointment_reminder' | 'eligibility_restored' | 'urgent_request' | 'achievement_unlocked';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    publishedAt: string;
    tags: string[];
    imageUrl?: string;
    isPublished: boolean;
}

export interface DonationHistory {
    id: string;
    donorId: string;
    donationDate: string;
    bloodType: BloodType;
    volume: number;
    components: BloodComponent[];
    hospitalId: string;
    preScreeningResults: Record<string, any>;
    postDonationNotes?: string;
    complications?: string[];
}