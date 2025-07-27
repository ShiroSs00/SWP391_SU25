import api from '../../../services/axios/api';
import { type BloodComponent, type BloodCode } from '../types/request-blood.types';

/**
 * API SERVICES CHO BLOOD SYSTEM
 * 
 * Tích hợp với backend APIs:
 * - GET /api/components - Lấy danh sách blood components
 * - GET /api/blood - Lấy danh sách blood codes
 * - GET /api/blood/{bloodCode} - Lấy thông tin chi tiết blood code
 * - GET /api/blood/rare - Lấy danh sách máu hiếm
 */

// Lấy danh sách blood components
export const getBloodComponents = async (): Promise<BloodComponent[]> => {
  try {
    const response = await api.get('/components');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching blood components:', error);
    throw error;
  }
};

// Lấy danh sách blood codes
export const getBloodCodes = async (): Promise<BloodCode[]> => {
  try {
    const response = await api.get('/blood');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching blood codes:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết blood code
export const getBloodCodeDetails = async (bloodCode: string): Promise<BloodCode> => {
  try {
    const response = await api.get(`/blood/${bloodCode}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching blood code details:', error);
    throw error;
  }
};

// Lấy danh sách máu hiếm
export const getRareBloodTypes = async (): Promise<BloodCode[]> => {
  try {
    const response = await api.get('/blood/rare');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching rare blood types:', error);
    throw error;
  }
};