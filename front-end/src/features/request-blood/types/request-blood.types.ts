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
  id: string;
  patientName: string;
  requestDate: string;
  bloodCode: string;
  volume: number;
  isEmergency: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestCreationDate?: string;
  accountName?: string;
  bloodType?: string;
}