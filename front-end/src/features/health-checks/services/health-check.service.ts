import type { HealthCheckDTO, CreateHealthCheckRequest } from '../types/health.types';
import api from '../../../services/axios/api';

class HealthCheckService {
  private baseUrl = '/api/healthcheck';

  async createHealthCheck(
    donationRegistrationId: string, 
    data: Omit<CreateHealthCheckRequest, 'donationRegistrationId'>
  ): Promise<HealthCheckDTO> {
    try {
      const response = await fetch(`${this.baseUrl}/create/${donationRegistrationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, donationRegistrationId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Create health check error:', error);
      throw error instanceof Error ? error : new Error('Failed to create health check');
    }
  }

  async getHealthCheck(healthCheckId: string): Promise<HealthCheckDTO> {
    try {
      const response = await fetch(`${this.baseUrl}/${healthCheckId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get health check error:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch health check');
    }
  }

  async getHealthChecksByDonor(donorId: string): Promise<HealthCheckDTO[]> {
    try {
      const response = await fetch(`${this.baseUrl}/donor/${donorId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Get health checks by donor error:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch health checks');
    }
  }

  async updateHealthCheck(
    healthCheckId: string, 
    data: Partial<CreateHealthCheckRequest>
  ): Promise<HealthCheckDTO> {
    try {
      const response = await fetch(`${this.baseUrl}/update/${healthCheckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Update health check error:', error);
      throw error instanceof Error ? error : new Error('Failed to update health check');
    }
  }

  validateHealthParameters(data: CreateHealthCheckRequest): string[] {
    const errors: string[] = [];
    if (data.weight < 45 || data.weight > 200) errors.push('Cân nặng phải từ 45-200kg');
    if (data.temperature < 36.0 || data.temperature > 37.5) errors.push('Nhiệt độ cơ thể phải từ 36.0-37.5°C');
    if (data.bloodPressure < 90 || data.bloodPressure > 180) errors.push('Huyết áp phải từ 90-180 mmHg');
    if (data.pulse < 50 || data.pulse > 100) errors.push('Nhịp tim phải từ 50-100 bpm');
    if (data.hemoglobin < 12.5 || data.hemoglobin > 18.0) errors.push('Hemoglobin phải từ 12.5-18.0 g/dL');
    if (data.volumeToTake < 350 || data.volumeToTake > 500) errors.push('Lượng máu lấy phải từ 350-500ml');
    return errors;
  }

  assessFitnessToDonate(data: Omit<CreateHealthCheckRequest, 'fitToDonate' | 'donationRegistrationId'>): {
    fit: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];
    if (data.weight < 45) reasons.push('Cân nặng dưới 45kg');
    if (data.temperature > 37.5) reasons.push('Sốt');
    if (data.bloodPressure > 160 || data.bloodPressure < 100) reasons.push('Huyết áp bất thường');
    if (data.pulse > 100 || data.pulse < 60) reasons.push('Nhịp tim bất thường');
    if (data.hemoglobin < 13.0) reasons.push('Hemoglobin thấp');
    return { fit: reasons.length === 0, reasons };
  }
}

export const healthCheckService = new HealthCheckService();