import { useState, useEffect } from 'react';
import { DonationHistoryItem, HistoryFilters } from '../types/history.types';
import { historyService } from '../services/history.service';

export function useDonationHistory() {
  const [donations, setDonations] = useState<DonationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const fetchHistory = async (page = 1, filters?: HistoryFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await historyService.getDonationHistory(page, 10, filters);
      setDonations(data.donations);
      setPagination({
        page,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDonationDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const donation = await historyService.getDonationById(id);
      return donation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportHistory = async (format: 'pdf' | 'csv' = 'pdf') => {
    try {
      setLoading(true);
      setError(null);
      const blob = await historyService.exportHistory(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donation-history.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    donations,
    loading,
    error,
    pagination,
    fetchHistory,
    getDonationDetails,
    exportHistory
  };
}