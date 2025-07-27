import { useState, useEffect } from 'react';
import { findCompatibleDonors, checkBloodCompatibility, confirmDonation } from '../services/blood-request.services';
import type { Donor, BloodCompatibility } from '../types/request-blood.types';

/**
 * CUSTOM HOOK CHO DONOR MATCHING SYSTEM
 * 
 * Quản lý việc tìm kiếm và kết nối người hiến máu:
 * - Tìm người hiến phù hợp
 * - Kiểm tra tương thích máu
 * - Xử lý xác nhận hiến máu
 */

export const useDonorMatching = (recipientBloodCode: string) => {
  const [compatibleDonors, setCompatibleDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipientBloodCode) return;

    const findDonors = async () => {
      setLoading(true);
      setError(null);
      try {
        const donors = await findCompatibleDonors(recipientBloodCode);
        setCompatibleDonors(donors);
      } catch (err) {
        setError('Không thể tìm người hiến máu phù hợp');
        console.error('Error finding donors:', err);
      } finally {
        setLoading(false);
      }
    };

    findDonors();
  }, [recipientBloodCode]);

  return { compatibleDonors, loading, error };
};

export const useBloodCompatibility = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkCompatibility = async (donorBloodCode: string, recipientBloodCode: string): Promise<BloodCompatibility | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await checkBloodCompatibility(donorBloodCode, recipientBloodCode);
      return result;
    } catch (err) {
      setError('Không thể kiểm tra tương thích máu');
      console.error('Error checking compatibility:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkCompatibility, loading, error };
};

export const useDonationConfirmation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmDonationRequest = async (requestId: string, donorId: string, confirmed: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const result = await confirmDonation(requestId, donorId, confirmed);
      return result;
    } catch (err) {
      setError('Không thể xác nhận yêu cầu hiến máu');
      console.error('Error confirming donation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { confirmDonationRequest, loading, error };
};