import { useState, useEffect } from 'react';
import {
  updateHealthCheck,
  createHealthCheck,
  getAllHealthChecks,
  getHealthCheckByRegistration,
  deleteHealthCheck,
  deleteMultipleHealthChecks
} from '../services/health-check.services';
import type { HealthCheckData } from '../types/health-check.types';
import type { DonationRegistrationDTO } from '../../donation-register/types/donations-register.types';

export const useHealthCheck = (donationRegistrationId?: string) => {
  const [healthCheck, setHealthCheck] = useState<HealthCheckData | null>(null);
  const [healthChecks, setHealthChecks] = useState<HealthCheckData[]>([]);
  const [donationRegistrations, setDonationRegistrations] = useState<DonationRegistrationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy tất cả health checks
  const fetchAllHealthChecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllHealthChecks();
      setHealthChecks(data);
    } catch (err) {
      setError('Không thể tải danh sách health check');
      console.error('Error fetching health checks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lấy health check cho donation registration cụ thể
  const fetchHealthCheckForRegistration = async (registrationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHealthCheckByRegistration(registrationId);
      setHealthCheck(data);
      return data;
    } catch (err) {
      setError('Không thể tải health check cho đơn đăng ký này');
      console.error('Error fetching health check for registration:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy health check theo registration ID
  const fetchHealthCheckByRegistration = async (registrationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHealthCheckByRegistration(registrationId);
      return data;
    } catch (err) {
      setError('Không thể tải health check');
      console.error('Error fetching health check:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Tạo health check mới
  const createNewHealthCheck = async (donationRegistrationId: string, data: HealthCheckData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createHealthCheck(donationRegistrationId, data);
      await fetchAllHealthChecks(); // Refresh danh sách
      return result;
    } catch (err) {
      setError('Không thể tạo health check');
      console.error('Error creating health check:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật health check
  const updateExistingHealthCheck = async (donationRegistrationId: string, data: HealthCheckData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateHealthCheck(donationRegistrationId, data);
      await fetchAllHealthChecks(); // Refresh danh sách
      return result;
    } catch (err) {
      setError('Không thể cập nhật health check');
      console.error('Error updating health check:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Xóa health check
  const removeHealthCheck = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteHealthCheck(id);
      await fetchAllHealthChecks(); // Refresh danh sách
      return true;
    } catch (err) {
      setError('Không thể xóa health check');
      console.error('Error deleting health check:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa nhiều health checks
  const removeMultipleHealthChecks = async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);
      await deleteMultipleHealthChecks(ids);
      await fetchAllHealthChecks(); // Refresh danh sách
      return true;
    } catch (err) {
      setError('Không thể xóa health checks');
      console.error('Error deleting multiple health checks:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Lấy tất cả donation registrations (để chọn trong health check)
  const fetchDonationRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      // Import hàm getAllDonations từ donation-register
      const { getAllDonations } = await import('../../donation-register/hooks/useBloodDonation');
      const data = await getAllDonations();
      setDonationRegistrations(data);
    } catch (err) {
      setError('Không thể tải danh sách đơn đăng ký');
      console.error('Error fetching donation registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    if (donationRegistrationId) {
      fetchHealthCheckForRegistration(donationRegistrationId);
    } else {
      fetchAllHealthChecks();
      fetchDonationRegistrations();
    }
  }, [donationRegistrationId]);

  return {
    healthCheck, // Health check cho donation registration cụ thể
    healthChecks,
    donationRegistrations,
    loading,
    error,
    fetchAllHealthChecks,
    fetchDonationRegistrations,
    fetchHealthCheckForRegistration,
    fetchHealthCheckByRegistration,
    createNewHealthCheck,
    updateExistingHealthCheck,
    removeHealthCheck,
    removeMultipleHealthChecks,
    setError
  };
};