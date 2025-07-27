import { useState, useEffect } from 'react';
import { createBloodRequest, getAllBloodRequests, approveBloodRequest, rejectBloodRequest, cancelBloodRequest, updateBloodRequest } from '../services/request-blood.services';
import type { BloodRequestPayload, BloodRequest } from '../types/request-blood.types';

export const useRequestBlood = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);


  const createRequest = async (payload: BloodRequestPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createBloodRequest(payload);
      setSuccess(true);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError('Có lỗi xảy ra khi tạo yêu cầu hiến máu');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };
  

  return { createRequest, loading, error, clearMessages, success };
};

export const useAllBloodRequests = () => {
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBloodRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await getAllBloodRequests(token);
        setBloodRequests(response.data);
      } else {
        throw new Error('Token not found');
      }
    } catch (err) {
      console.error('Error fetching blood requests:', err);
      // Extract error message from API response if available
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError((err as Error).message || 'Có lỗi xảy ra khi tải danh sách đơn yêu cầu máu');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  return { bloodRequests, loading, error, refetch: fetchBloodRequests };
};

// Hook for managing blood request status updates
export const useBloodRequestStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateRequestStatus = async (requestId: string, action: 'approve' | 'reject' | 'cancel') => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      let response;
      switch (action) {
        case 'approve':
          response = await approveBloodRequest(requestId, token);
          break;
        case 'reject':
          response = await rejectBloodRequest(requestId, token);
          break;
        case 'cancel':
          response = await cancelBloodRequest(requestId, token);
          break;
        default:
          throw new Error('Invalid action');
      }
      
      // Try to extract success message from response
      if (response && typeof response === 'object' && 'message' in response) {
        setSuccessMessage((response as { message: string }).message);
      } else if (response && typeof response === 'object' && 'data' in response && 
                 typeof (response as { data: unknown }).data === 'object' && 
                 (response as { data: unknown }).data !== null &&
                 'message' in ((response as { data: unknown }).data as object)) {
        setSuccessMessage(((response as { data: { message: string } }).data as { message: string }).message);
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError('Có lỗi xảy ra khi cập nhật trạng thái đơn yêu cầu');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (requestId: string, payload: Partial<BloodRequestPayload>) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await updateBloodRequest(requestId, payload, token);
      
      // Try to extract success message from response
      if (response && typeof response === 'object' && 'message' in response) {
        setSuccessMessage((response as { message: string }).message);
      } else if (response && typeof response === 'object' && 'data' in response && 
                 typeof (response as { data: unknown }).data === 'object' && 
                 (response as { data: unknown }).data !== null &&
                 'message' in ((response as { data: unknown }).data as object)) {
        setSuccessMessage(((response as { data: { message: string } }).data as { message: string }).message);
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError('Có lỗi xảy ra khi cập nhật đơn yêu cầu');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return { updateRequestStatus, updateRequest, loading, error, successMessage, clearMessages };
};
