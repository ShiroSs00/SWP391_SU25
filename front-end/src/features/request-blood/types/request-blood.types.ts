export interface BloodRequestPayload {
  requestDate: string;
  bloodCode: string; // Cho phép null
  volume: number; // Cho phép null
  componentId: string;
  emergency: boolean; // Thay thế emergency
  // componentId: string; // Added componentId to payload if backend expects it
}

// Interface cho Blood Code
export interface BloodCode {
  bloodCode: string;
  bloodType: string;
  rhFactor: string;
  component: string;
  isRareBlood: boolean;
  quantity: number;
  bloodMatch: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  phone: string
  requestDate: string;
  bloodCode: string;
  volume: number | null;
  componentId: string; // Ensure this is present for InventoryChecker
  isEmergency: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestCreationDate?: string;
  accountName?: string;
  medicalReason?: string
  bloodType?: string;
  customReason?: string;
}

export interface CreateBloodRequestData {
  accountId: string;
  bloodCode: string;
  componentId: string;
  volume: number;
  emergency: boolean;
  requestDate: string;
}

// Blood Bag Types
export interface BloodBag {
  bagId: string;
  bloodCode: string;
  volume: number;
  collectedDate: string;
  expirationDate: string; // Changed expiryDate to expirationDate
  status: 'available' | 'reserved' | 'used' | 'expired';
  afterDonationId?: string;
  waitingListId?: string;
  componentId: string; // Added componentId to BloodBag for filtering in InventoryChecker
}

// Blood Compatibility Types
export interface BloodCompatibility {
  donorBloodCode: string;
  recipientBloodCode: string;
  isCompatible: boolean;
  compatibilityType: 'perfect' | 'acceptable' | 'emergency_only';
}

// Donor Types
export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodCode: string;
  lastDonationDate?: string;
  eligibleForDonation: boolean;
  address?: string;
}

// Component Types
export interface BloodComponent {
  componentId: string;
  type: string;
  expirationDays: number;
  description: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Form Types
export interface BloodRequestFormData {
  bloodCode: string;
  componentId: string;
  volume: number;
  emergency: boolean;
  requestDate: string;
  medicalReason: string;
  customReason?: string;
}

// Staff Dashboard Types
export interface StaffDashboardData {
  pendingRequests: BloodRequest[];
  bloodInventory: BloodBag[];
  compatibleDonors: Donor[];
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Interface cho Volume Options
export interface VolumeOption {
  value: number;
  label: string;
  description: string;
  isStandard: boolean;
}

// Interface cho User Profile
export interface UserProfile {
  profileId: string;
  accountId: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  dateOfBirth: string;
  address: string;
  medicalHistory?: string;
}
