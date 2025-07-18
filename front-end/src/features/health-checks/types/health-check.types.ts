// Health Check Types
export interface HealthCheckData {
  healthCheckId?: string;
  donationRegistrationId: string;
  weight?: number;
  temperature?: number;
  bloodPressure?: number;
  pulse?: number;
  hemoglobin?: number;
  volumeToTake?: number | null; // Allow null for volumeToTake
  isFitToDonate?: boolean;
  note?: string;
}

export interface HealthCheckPayload {
  healthCheckId: string;
  donationRegistrationId: string;
  weight: number;
  temperature: number;
  bloodPressure: number;
  pulse: number;
  hemoglobin: number;
  volumeToTake: number;
  isFitToDonate: boolean;
  note: string;
}