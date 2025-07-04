// Health Check Types
export interface HealthCheckData {
  donationRegistrationId: string;
  bloodPressure?: string;
  heartRate?: number;
  weight?: number;
  height?: number;
  temperature?: number;
  hemoglobin?: number;
  notes?: string;
  status?: string;
  checkDate?: string;
}