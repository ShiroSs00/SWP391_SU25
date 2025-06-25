import { useState, useCallback } from 'react';
import { healthCheckService } from '../services/health-check.service';
import type { UseHealthCheckReturn, HealthCheckDTO, CreateHealthCheckRequest, HealthCheckFormData } from '../types/health.types';


export function useHealthCheck(): UseHealthCheckReturn {
  const [healthCheck, setHealthCheck] = useState<HealthCheckDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setHealthCheck(null);
    setLoading(false);
    setSubmitting(false);
    setError(null);
  }, []);

  const validateForm = useCallback((formData: HealthCheckFormData) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    const weight = parseFloat(formData.weight);
    if (isNaN(weight) || weight < 45 || weight > 200) {
      errors.weight = 'Cân nặng phải từ 45-200kg';
      isValid = false;
    }

    const temperature = parseFloat(formData.temperature);
    if (isNaN(temperature) || temperature < 36.0 || temperature > 37.5) {
      errors.temperature = 'Nhiệt độ cơ thể phải từ 36.0-37.5°C';
      isValid = false;
    }

    const bloodPressure = parseFloat(formData.bloodPressure);
    if (isNaN(bloodPressure) || bloodPressure < 90 || bloodPressure > 180) {
      errors.bloodPressure = 'Huyết áp phải từ 90-180 mmHg';
      isValid = false;
    }

    const pulse = parseInt(formData.pulse);
    if (isNaN(pulse) || pulse < 50 || pulse > 100) {
      errors.pulse = 'Nhịp tim phải từ 50-100 bpm';
      isValid = false;
    }

    const hemoglobin = parseFloat(formData.hemoglobin);
    if (isNaN(hemoglobin) || hemoglobin < 12.5 || hemoglobin > 18.0) {
      errors.hemoglobin = 'Hemoglobin phải từ 12.5-18.0 g/dL';
      isValid = false;
    }

    const volumeToTake = parseInt(formData.volumeToTake);
    if (isNaN(volumeToTake) || volumeToTake < 350 || volumeToTake > 500) {
      errors.volumeToTake = 'Lượng máu lấy phải từ 350-500ml';
      isValid = false;
    }

    return { isValid, errors };
  }, []);

  const createHealthCheck = useCallback(async (
    donationRegistrationId: string, 
    data: Omit<CreateHealthCheckRequest, 'donationRegistrationId'>
  ): Promise<HealthCheckDTO | null> => {
    setSubmitting(true);
    setError(null);
    try {
      const validationErrors = healthCheckService.validateHealthParameters({
        ...data,
        donationRegistrationId
      });
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }
      const result = await healthCheckService.createHealthCheck(donationRegistrationId, data);
      setHealthCheck(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo khám sức khỏe';
      setError(errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const getHealthCheck = useCallback(async (healthCheckId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await healthCheckService.getHealthCheck(healthCheckId);
      setHealthCheck(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy thông tin khám sức khỏe';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHealthCheck = useCallback(async (
    healthCheckId: string, 
    data: Partial<CreateHealthCheckRequest>
  ): Promise<void> => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await healthCheckService.updateHealthCheck(healthCheckId, data);
      setHealthCheck(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật khám sức khỏe';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    healthCheck,
    loading,
    error,
    submitting,
    createHealthCheck,
    getHealthCheck,
    updateHealthCheck,
    validateForm,
    clearError,
    reset
  };
}