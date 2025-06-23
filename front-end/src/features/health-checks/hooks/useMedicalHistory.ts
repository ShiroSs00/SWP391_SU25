import { useState, useCallback, useEffect } from 'react';
import type { healthCheckService } from '../services/health-check.service';
import type { HealthCheckDTO, MedicalHistoryItem } from '../types/health.types';

interface UseMedicalHistoryReturn {
  medicalHistory: MedicalHistoryItem[];
  loading: boolean;
  error: string | null;
  fetchMedicalHistory: (donorId: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
  getHealthTrends: () => {
    weightTrend: Array<{ date: string; value: number }>;
    hemoglobinTrend: Array<{ date: string; value: number }>;
    bloodPressureTrend: Array<{ date: string; value: number }>;
  };
  getLatestResults: () => HealthCheckDTO | null;
  clearError: () => void;
}

export function useMedicalHistory(): UseMedicalHistoryReturn {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDonorId, setCurrentDonorId] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const transformHealthCheckToHistoryItem = useCallback((healthCheck: HealthCheckDTO): MedicalHistoryItem => ({
    id: healthCheck.healthCheckId,
    date: new Date().toISOString(),
    healthCheck,
    status: healthCheck.fitToDonate ? 'fit' : 'unfit'
  }), []);

  const fetchMedicalHistory = useCallback(async (donorId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setCurrentDonorId(donorId);
    try {
      const healthChecks = await healthCheckService.getHealthChecksByDonor(donorId);
      const historyItems = healthChecks.map(transformHealthCheckToHistoryItem);
      historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setMedicalHistory(historyItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lấy lịch sử khám sức khỏe';
      setError(errorMessage);
      setMedicalHistory([]);
    } finally {
      setLoading(false);
    }
  }, [transformHealthCheckToHistoryItem]);

  const refreshHistory = useCallback(async (): Promise<void> => {
    if (currentDonorId) {
      await fetchMedicalHistory(currentDonorId);
    }
  }, [currentDonorId, fetchMedicalHistory]);

  const getHealthTrends = useCallback(() => {
    const sortedHistory = [...medicalHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const weightTrend = sortedHistory.map(item => ({ date: new Date(item.date).toLocaleDateString('vi-VN'), value: item.healthCheck.weight }));
    const hemoglobinTrend = sortedHistory.map(item => ({ date: new Date(item.date).toLocaleDateString('vi-VN'), value: item.healthCheck.hemoglobin }));
    const bloodPressureTrend = sortedHistory.map(item => ({ date: new Date(item.date).toLocaleDateString('vi-VN'), value: item.healthCheck.bloodPressure }));
    return { weightTrend, hemoglobinTrend, bloodPressureTrend };
  }, [medicalHistory]);

  const getLatestResults = useCallback((): HealthCheckDTO | null => {
    return medicalHistory.length > 0 ? medicalHistory[0].healthCheck : null;
  }, [medicalHistory]);

  useEffect(() => {
    if (currentDonorId) {
      const interval = setInterval(() => {
        refreshHistory();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [currentDonorId, refreshHistory]);

  return {
    medicalHistory,
    loading,
    error,
    fetchMedicalHistory,
    refreshHistory,
    getHealthTrends,
    getLatestResults,
    clearError
  };
}