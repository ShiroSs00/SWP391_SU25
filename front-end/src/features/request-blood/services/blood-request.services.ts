import api from '../../../services/axios/api';
import type { BloodRequestPayload, Donor, BloodCompatibility } from '../types/request-blood.types';

// Tạo yêu cầu máu
export const createBloodRequest = async (payload: BloodRequestPayload): Promise<any> => {
  try {
    console.log('Creating blood request with payload:', payload);
    const response = await api.post('/blood-requests/create', payload);
    console.log('Blood request created successfully:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating blood request:', error);
    throw error;
  }
};


// Lấy tất cả yêu cầu hiến máu
export const getAllBloodRequests = async () => {
  try {
    const response = await api.get('/blood-requests/all');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all blood requests:', error);
    throw error;
  }
};


// Lấy chi tiết yêu cầu
export const getBloodRequestById = async (requestId: string) => {
  try {
    const response = await api.get(`/blood-requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blood request details:', error);
    throw error;
  }
};

// Duyệt yêu cầu
export const approveBloodRequest = async (requestId: string) => {
  try {
    const response = await api.put(`/blood-requests/${requestId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving blood request:', error);
    throw error;
  }
};

// Từ chối yêu cầu
export const rejectBloodRequest = async (requestId: string, reason?: string) => {
  try {
    const response = await api.put(`/blood-requests/${requestId}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting blood request:', error);
    throw error;
  }
};

// Tìm người hiến máu phù hợp
export const findCompatibleDonors = async (recipientBloodCode: string): Promise<Donor[]> => {
  try {
    const response = await api.get(`/blood-requests/compatible-donors/${recipientBloodCode}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error finding compatible donors:', error);
    throw error;
  }
};

// Kiểm tra tương thích máu
export const checkBloodCompatibility = async (donorBloodCode: string, recipientBloodCode: string): Promise<BloodCompatibility> => {
  try {
    const response = await api.get('/blood-requests/blood-compatibility', {
      params: { donorBloodCode, recipientBloodCode }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error checking blood compatibility:', error);
    throw error;
  }
};

// Xác nhận hiến máu từ donor
export const confirmDonation = async (requestId: string, donorId: string, confirmed: boolean) => {
  try {
    const response = await api.post('/blood-requests/api/confirm', {
      requestId,
      donorId,
      confirmed
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming donation:', error);
    throw error;
  }
};