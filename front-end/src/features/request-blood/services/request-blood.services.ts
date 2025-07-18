import api from '../../../services/axios/api';
import type { BloodRequestPayload, BloodCode } from '../types/request-blood.types';

export const createBloodRequest = async (payload: BloodRequestPayload): Promise<void> => {
  await api.post('/blood-requests/create', payload);
};

export const getBloodCodes = async (token: string): Promise<BloodCode[]> => {
  const response = await api.get('/blood', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return response.data.data;
};
export const getAllBloodRequests = async (token: string) => {
  const response = await api.get('/blood-requests/all', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update status functions
export const approveBloodRequest = async (requestId: string, token: string): Promise<void> => {
  await api.put(`/blood-requests/${requestId}/approve`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const rejectBloodRequest = async (requestId: string, token: string): Promise<void> => {
  await api.put(`/blood-requests/${requestId}/reject`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const cancelBloodRequest = async (requestId: string, token: string): Promise<void> => {
  await api.put(`/blood-requests/${requestId}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateBloodRequest = async (requestId: string, payload: Partial<BloodRequestPayload>, token: string): Promise<void> => {
  await api.put(`/blood-requests/update/${requestId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};