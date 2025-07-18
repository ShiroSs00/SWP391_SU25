import { useState, useEffect } from 'react';
import { getBloodComponents, getBloodCodes, getRareBloodTypes } from '../services/blood.services';
import type { BloodComponent, BloodCode } from '../types/request-blood.types';

/**
 * CUSTOM HOOK CHO BLOOD DATA
 * 
 * Quản lý state và fetch data từ các API:
 * - Blood Components
 * - Blood Codes  
 * - Rare Blood Types
 */

export const useBloodComponents = () => {
  const [components, setComponents] = useState<BloodComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBloodComponents();
        setComponents(data);
      } catch (err) {
        setError('Không thể tải danh sách thành phần máu');
        console.error('Error fetching components:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  return { components, loading, error };
};

export const useBloodCodes = () => {
  const [bloodCodes, setBloodCodes] = useState<BloodCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBloodCodes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBloodCodes();
        setBloodCodes(data);
      } catch (err) {
        setError('Không thể tải danh sách mã máu');
        console.error('Error fetching blood codes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodCodes();
  }, []);

  return { bloodCodes, loading, error };
};

export const useRareBloodTypes = () => {
  const [rareBloodTypes, setRareBloodTypes] = useState<BloodCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRareBloodTypes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRareBloodTypes();
        setRareBloodTypes(data);
      } catch (err) {
        setError('Không thể tải danh sách máu hiếm');
        console.error('Error fetching rare blood types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRareBloodTypes();
  }, []);

  return { rareBloodTypes, loading, error };
};