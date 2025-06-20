import { useState, useEffect } from 'react';
import { DonationStats } from '../types/history.types';
import { historyService } from '../services/history.service';

export function useDonationStats() {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextEligibleDate, setNextEligibleDate] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await historyService.getDonationStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextEligibleDate = async () => {
    try {
      const date = await historyService.getNextEligibleDate();
      setNextEligibleDate(date);
    } catch (err) {
      console.error('Failed to fetch next eligible date:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchNextEligibleDate();
  }, []);

  return {
    stats,
    nextEligibleDate,
    loading,
    error,
    fetchStats,
    fetchNextEligibleDate
  };
}