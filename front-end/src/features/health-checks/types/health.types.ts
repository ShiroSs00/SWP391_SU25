export interface HealthCheckDTO {
  healthCheckId: string;
  weight: number;
  temperature: number;
  bloodPressure: number;
  pulse: number;
  hemoglobin: number;
  volumeToTake: number;
  note: string;
  donationRegistrationId: string;
  fitToDonate: boolean;
}

export interface CreateHealthCheckRequest {
  weight: number;
  temperature: number;
  bloodPressure: number;
  pulse: number;
  hemoglobin: number;
  volumeToTake: number;
  note?: string;
  donationRegistrationId: string;
  fitToDonate: boolean;
}

export interface HealthCheckFormData {
  weight: string;
  temperature: string;
  bloodPressure: string;
  pulse: string;
  hemoglobin: string;
  volumeToTake: string;
  note: string;
}

export interface VitalSignsProps {
  data: HealthCheckFormData;
  onChange: (field: keyof HealthCheckFormData, value: string) => void;
  errors?: Partial<Record<keyof HealthCheckFormData, string>>;
  readOnly?: boolean;
}

export interface MedicalHistoryItem {
  id: string;
  date: string;
  healthCheck: HealthCheckDTO;
  donorName?: string;
  status: 'fit' | 'unfit' | 'pending';
}

export interface CheckupResult {
  id: string;
  healthCheck: HealthCheckDTO;
  recommendation: string;
  nextCheckupDate?: string;
  restrictions?: string[];
}

export const HEALTH_THRESHOLDS = {
  weight: { min: 45, max: 200 },
  temperature: { min: 36.0, max: 37.5 },
  bloodPressure: { min: 90, max: 180 },
  pulse: { min: 50, max: 100 },
  hemoglobin: { min: 12.5, max: 18.0 },
  volumeToTake: { min: 350, max: 500 }
} as const;


export interface UseHealthCheckReturn {
  healthCheck: HealthCheckDTO | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  createHealthCheck: (donationRegistrationId: string, data: Omit<CreateHealthCheckRequest, 'donationRegistrationId'>) => Promise<HealthCheckDTO | null>;
  getHealthCheck: (healthCheckId: string) => Promise<void>;
  updateHealthCheck: (healthCheckId: string, data: Partial<CreateHealthCheckRequest>) => Promise<void>;
  validateForm: (formData: HealthCheckFormData) => { isValid: boolean; errors: Record<string, string> };
  clearError: () => void;
  reset: () => void;
}

export type HealthParameter = keyof typeof HEALTH_THRESHOLDS;