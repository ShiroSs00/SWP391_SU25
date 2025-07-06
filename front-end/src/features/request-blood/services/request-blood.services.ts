import api from '../../../services/axios/api';
import type { BloodRequestPayload, BloodCode } from '../types/request-blood.types';

export const createBloodRequest = async (payload: BloodRequestPayload): Promise<void> => {
  try {
    const response = await api.post('/blood-requests/create', payload);
    console.log('Blood request created successfully:', response.data);
  } catch (error) {
    console.error('Error creating blood request:', error);
    throw error;
  }
};

export const getBloodCodes = async (token: string): Promise<BloodCode[]> => {
  try {
    const response = await api.get('/blood', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    console.log('Blood codes fetched successfully:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching blood codes:', error);
    throw error;
  }
};
export const getAllBloodRequests = async (token: string) => {
  try {
    const response = await api.get('/blood-requests/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all blood requests:', error);
    throw error;
  }
};