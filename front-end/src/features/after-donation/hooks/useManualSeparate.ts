import { useState, useCallback } from 'react';
import { manualseparateAfterDonation } from '../services/after-donation.services';
import type { ManualSeparateData } from '../types/after-donation.types';

export const useManualSeparate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const separateBlood = useCallback(async (data: ManualSeparateData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await manualseparateAfterDonation(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tách máu';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    separateBlood,
    clearError
  };
};
