import { useState, useEffect } from 'react';
import type { Achievement } from '../types/achievement-manage.types';
import { achievementManageService } from '../services/achievement-manage.services';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await achievementManageService.getAllAchievements();
      
      if (response.success) {
        setAchievements(response.data);
      } else {
        setError(response.message || 'Failed to fetch achievements');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements
  };
};
