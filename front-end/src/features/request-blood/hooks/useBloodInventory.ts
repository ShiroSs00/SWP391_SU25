import { useState, useEffect } from 'react';
import { getAllBloodBags, checkInventoryAvailability, reserveBloodBags } from '../services/blood-bag.services';
import type { BloodBag } from '../types/request-blood.types';

/**
 * CUSTOM HOOK CHO BLOOD INVENTORY MANAGEMENT
 * 
 * Quản lý state và operations cho:
 * - Lấy danh sách blood bags
 * - Kiểm tra tồn kho
 * - Reserve blood bags
 */

export const useBloodInventory = () => {
  const [bloodBags, setBloodBags] = useState<BloodBag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBloodBags = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBloodBags();
      setBloodBags(data);
    } catch (err) {
      setError('Không thể tải danh sách blood bags');
      console.error('Error fetching blood bags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBags();
  }, []);

  const checkAvailability = async (bloodCode: string, requiredVolume: number) => {
    try {
      return await checkInventoryAvailability(bloodCode, requiredVolume);
    } catch (err) {
      console.error('Error checking availability:', err);
      throw err;
    }
  };

  const reserveBags = async (bloodCode: string, requiredVolume: number, requestId: string) => {
    try {
      const result = await reserveBloodBags(bloodCode, requiredVolume, requestId);
      // Refresh blood bags list after reservation
      await fetchBloodBags();
      return result;
    } catch (err) {
      console.error('Error reserving bags:', err);
      throw err;
    }
  };

  return {
    bloodBags,
    loading,
    error,
    checkAvailability,
    reserveBags,
    refetch: fetchBloodBags
  };
};

export const useInventoryCheck = (bloodCode: string, volume: number) => {
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bloodCode || !volume) return;

    const checkStock = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await checkInventoryAvailability(bloodCode, volume);
        setAvailability(result);
      } catch (err) {
        setError('Không thể kiểm tra tồn kho');
        console.error('Error checking inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    checkStock();
  }, [bloodCode, volume]);

  return { availability, loading, error };
};