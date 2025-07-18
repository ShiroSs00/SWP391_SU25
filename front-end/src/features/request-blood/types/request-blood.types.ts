export interface BloodRequestPayload {
  patientName: string;
  requestDate: string;
  bloodCode: string | null; // Cho phép null
  volume: number | null; // Cho phép null
  isEmergency: boolean; // Thay thế emergency
}

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
  idBloodRequest: string; // Mapped from API
  requesterName: string; // API field name
  requestDate: string;
  bloodType: string; // API field name
  volume: number;
  emergency: boolean; // API field name
  status: 'PENDING' | 'APPROVE' | 'REJECT' | 'CANCELLED'; // Exact enum values from backend
  requestCreationDate?: string;
  requesterPhone?: string;
  requesterEmail?: string;
  requesterAddress?: string;
  component?: string;
  processedBy?: string;
  processedDate?: string;
  rejectionReason?: string;
  bloodBagId?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
}