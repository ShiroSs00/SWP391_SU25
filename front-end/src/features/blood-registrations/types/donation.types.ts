export interface Donor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  bloodType: BloodType;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: MedicalHistory;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalHistory {
  hasChronicIllness: boolean;
  chronicIllnesses?: string[];
  takingMedications: boolean;
  medications?: string[];
  hasAllergies: boolean;
  allergies?: string[];
  hasRecentSurgery: boolean;
  recentSurgeryDate?: Date;
  recentSurgeryType?: string;
  hasRecentTattoo: boolean;
  recentTattooDate?: Date;
  hasRecentTravel: boolean;
  recentTravelDestinations?: string[];
  hasRecentIllness: boolean;
  recentIllnessType?: string;
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy';
  lastDonationDate?: Date;
}

export interface DonationRegistration {
  id: string;
  donorId: string;
  donationType: DonationType;
  scheduledDate: Date;
  scheduledTime: string;
  location: {
    hospitalId: string;
    hospitalName: string;
    address: string;
  };
  status: DonationStatus;
  eligibilityStatus: EligibilityStatus;
  preScreeningResults?: PreScreeningResults;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PreScreeningResults {
  weight: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  hemoglobin: number;
  eligibilityScore: number;
  disqualifyingFactors: string[];
}

export interface EligibilityCheck {
  isEligible: boolean;
  score: number;
  reasons: EligibilityReason[];
  nextEligibleDate?: Date;
  recommendations: string[];
}

export interface EligibilityReason {
  type: 'age' | 'weight' | 'medical' | 'timing' | 'travel' | 'lifestyle';
  severity: 'info' | 'warning' | 'error';
  message: string;
  disqualifying: boolean;
}

export interface DonationAppointment {
  id: string;
  registrationId: string;
  date: Date;
  timeSlot: TimeSlot;
  duration: number; // in minutes
  location: DonationLocation;
  status: AppointmentStatus;
  reminder: {
    email: boolean;
    sms: boolean;
    reminderTime: '24h' | '2h' | '30m';
  };
  instructions: string[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  capacity: number;
  bookedCount: number;
}

export interface DonationLocation {
  id: string;
  name: string;
  address: string;
  facilities: string[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type DonationType = 'whole-blood' | 'plasma' | 'platelets' | 'red-cells' | 'double-red';

export type DonationStatus = 
  | 'pending' 
  | 'scheduled' 
  | 'confirmed' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no-show'
  | 'deferred';

export type EligibilityStatus = 'eligible' | 'temporarily-deferred' | 'permanently-deferred' | 'under-review';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

export interface DonationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  bloodType: BloodType;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Medical History
  medicalHistory: MedicalHistory;
  
  // Donation Preferences
  donationType: DonationType;
  preferredDate?: Date;
  preferredTime?: string;
  locationId?: string;
  
  // Consent and Terms
  consentToContact: boolean;
  acceptedTerms: boolean;
  marketingConsent: boolean;
}