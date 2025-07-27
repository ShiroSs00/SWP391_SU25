import api from '../../../services/axios/api';
import { type BloodRequestPayload, type BloodCode, type BloodBag, type BloodRequest, type Donor } from '../types/request-blood.types';

// Tạo yêu cầu máu
export const createBloodRequest = async (payload: BloodRequestPayload): Promise<void> => {
  await api.post('/blood-requests/create', payload);
};

// Lấy danh sách mã nhóm máu
export const getBloodCodes = async (token: string): Promise<BloodCode[]> => {
  try {
    const response = await api.get('/blood', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    console.log('Blood codes fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching blood codes:', error);
    throw error;
  }
};

// Lấy tất cả yêu cầu máu
export const getAllBloodRequests = async (token: string) => {

  const response = await api.get('/blood-requests/all', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update status functions
export const approveBloodRequest = async (requestId: string, token: string) => {
  const response = await api.put(`/blood-requests/${requestId}/approve`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const rejectBloodRequest = async (requestId: string, token: string) => {
  const response = await api.put(`/blood-requests/${requestId}/reject`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const cancelBloodRequest = async (requestId: string, token: string) => {
  const response = await api.put(`/blood-requests/${requestId}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateBloodRequest = async (requestId: string, payload: Partial<BloodRequestPayload>, token: string) => {
  const response = await api.put(`/blood-requests/update/${requestId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// Lấy yêu cầu máu của tôi
export const getMyRequests = async (accountId: string): Promise<BloodRequest[]> => {
  try {
    const response = await api.get(`/blood-requests/my-requests/${accountId}`);
    console.log('My requests fetched successfully:', response.data);
    return response.data; // Giả định response.data.data chứa mảng BloodRequest
  } catch (error) {
    console.error('Error fetching my requests:', error);
    throw error;
  }
};

// Lấy tất cả túi máu
export const getAllBloodBags = async (): Promise<BloodBag[]> => {
  try {
    const response = await api.get('/blood-bags/getall');
    console.log('Blood bags fetched successfully:', response.data);
    return response.data; // Giả định response.data.data chứa mảng BloodBag
  } catch (error) {
    console.error('Error fetching blood bags:', error);
    throw error;
  }
};

// Kiểm tra tính tương thích máu
export const checkBloodCompatibility = async (
  recipientBloodCode: string,
  donorBloodCode: string,
  componentId: string
): Promise<void> => {
  try {
    const response = await api.post('/blood-requests/blood-compatibility', {
      recipientBloodCode,
      donorBloodCode,
      componentId,
    });
    console.log('Blood compatibility checked successfully:', response.data);
  } catch (error) {
    console.error('Error checking blood compatibility:', error);
    throw error;
  }
};

// Phê duyệt yêu cầu máu


// Lấy danh sách người hiến máu tương thích
export const getCompatibleDonors = async (recipientBloodCode: string): Promise<Donor[]> => {
  try {
    const response = await api.get(`/blood-requests/compatible-donors/${recipientBloodCode}`);
    console.log('Compatible donors fetched successfully:', response.data);
    return response.data; // Giả định response.data.data chứa mảng Donor
  } catch (error) {
    console.error('Error fetching compatible donors:', error);
    throw error;
  }
};
