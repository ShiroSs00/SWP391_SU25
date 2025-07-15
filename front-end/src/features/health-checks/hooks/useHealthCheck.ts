import { useState, useEffect } from 'react';
import {
  getAllHealthChecks,
  createHealthCheck,
  updateHealthCheck,
  deleteHealthCheck,
} from '../services/health-check.services';
import type { HealthCheckData } from '../types/health-check.types';

/**
 * Custom hook to interact with the Health Check service.
 */
export const useHealthCheck = () => {
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch health check data from the server.
   */
  const fetchHealthCheckData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllHealthChecks();
      setHealthCheckData(data);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while fetching health check data.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new health check record.
   * @param data HealthCheckData object
   */
  const addHealthCheck = async (donationRegistrationId: string, data: HealthCheckData) => {
    setLoading(true);
    setError(null);
    try {
      const newData = await createHealthCheck(donationRegistrationId, data);
      setHealthCheckData((prev) => [...prev, newData]);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while adding health check data.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing health check record.
   * @param id ID of the health check record
   * @param data Updated HealthCheckData object
   */
  const updateHealthCheckData = async (donationRegistrationId: string, data: HealthCheckData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = await updateHealthCheck(donationRegistrationId, data);
      setHealthCheckData((prev) =>
        prev.map((item) => (item.donationRegistrationId === donationRegistrationId ? updatedData : item))
      );
    } catch (err) {
      setError((err as Error).message || 'An error occurred while updating health check data.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a health check record.
   * @param id ID of the health check record
   */
  const deleteHealthCheckData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteHealthCheck(id);
      setHealthCheckData((prev) => prev.filter((item) => item.donationRegistrationId !== id));
    } catch (err) {
      setError((err as Error).message || 'An error occurred while deleting health check data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthCheckData();
  }, []);

  return {
    healthCheckData,
    loading,
    error,
    fetchHealthCheckData,
    addHealthCheck,
    updateHealthCheckData,
    deleteHealthCheckData,
  };
};
