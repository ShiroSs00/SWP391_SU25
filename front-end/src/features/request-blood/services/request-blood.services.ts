import api from '../../../services/axios/api';
import { type BloodRequestPayload, type BloodCode, type BloodBag, type BloodRequest, type Donor } from '../types/request-blood.types';

// Tạo yêu cầu máu
export const createBloodRequest = async (payload: BloodRequestPayload): Promise<void> => {
  try {
    const response = await api.post('/blood-requests/create', payload);
    console.log('Blood request created successfully:', response.data);
  } catch (error) {
    console.error('Error creating blood request:', error);
    throw error;
  }
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
export const approveBloodRequest = async (requestId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.put(`/blood-requests/${requestId}/approve`);
    console.log('Blood request approved successfully:', response.data);
    return { success: true };
  } catch (error) {
    console.error('Error approving blood request:', error);
    throw error;
  }
};

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

// // Lấy danh sách yêu cầu máu đang chờ
// export const getPendingRequests = async (): Promise<BloodRequest[]> => {
//   try {
//     const response = await api.get('/blood-requests/pending');
//     console.log('Pending requests fetched successfully:', response.data);
//     return response.data; // Giả định response.data chứa mảng BloodRequest
//   } catch (error) {
//     console.error('Error fetching pending requests:', error);
//     throw error;
//   }
// };

// Từ chối yêu cầu máu
export const rejectBloodRequest = async (requestId: string, reason?: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.put(`/blood-requests/${requestId}/reject`, { reason });
    console.log('Blood request rejected successfully:', response.data);
    return { success: true };
  } catch (error) {
    console.error('Error rejecting blood request:', error);
    throw error;
  }
};
