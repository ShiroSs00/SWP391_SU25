import { useState, useEffect } from 'react';
import { createBloodRequest, getAllBloodRequests, approveBloodRequest, rejectBloodRequest, cancelBloodRequest, updateBloodRequest } from '../services/request-blood.services';
import type { BloodRequestPayload, BloodRequest } from '../types/request-blood.types';

export const useRequestBlood = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (payload: BloodRequestPayload) => {
    setLoading(true);
    setError(null);
    try {
      await createBloodRequest(payload);
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

  return { createRequest, loading, error };
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
        setBloodRequests(response.data || []);
      } else {
        throw new Error('Token not found');
      }
    } catch (err) {
      setError((err as Error).message || 'Có lỗi xảy ra khi tải danh sách đơn hiến máu');
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

  const updateRequestStatus = async (requestId: string, action: 'approve' | 'reject' | 'cancel') => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      switch (action) {
        case 'approve':
          await approveBloodRequest(requestId, token);
          break;
        case 'reject':
          await rejectBloodRequest(requestId, token);
          break;
        case 'cancel':
          await cancelBloodRequest(requestId, token);
          break;
        default:
          throw new Error('Invalid action');
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
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      await updateBloodRequest(requestId, payload, token);
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

  return { updateRequestStatus, updateRequest, loading, error };
};