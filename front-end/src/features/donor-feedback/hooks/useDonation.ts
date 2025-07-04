import { useState, useCallback } from 'react';
import type { DonationRegistration, DonationFilters } from '../types/donation.types';
import { donationService } from '../services/donation.service';

export const useDonation = () => {
  const [donations, setDonations] = useState<DonationRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAllDonations = useCallback(async (filters?: DonationFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await donationService.getAllDonations(filters);
      setDonations(result.donations);
      setTotal(result.total);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateFeedbackLink = useCallback((registrationId: string) => {
    return donationService.generateFeedbackLink(registrationId);
  }, []);

  return {
    donations,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    getAllDonations,
    generateFeedbackLink,
    setError,
  };
};