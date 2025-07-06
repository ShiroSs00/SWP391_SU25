import { useState, useEffect } from 'react';
import { createBloodRequest, getAllBloodRequests } from '../services/request-blood.services';
import type { BloodRequestPayload, BloodRequest } from '../types/request-blood.types';

export const useRequestBlood = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (payload: BloodRequestPayload) => {
    console.log('Payload gửi lên API:', payload); // Log chi tiết payload
    setLoading(true);
    setError(null);
    try {
      await createBloodRequest(payload);
    } catch (err: unknown) {
      console.error('Response lỗi từ backend:', err); // Log chi tiết response lỗi
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

  useEffect(() => {
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
        setError((err as Error).message || 'Có lỗi xảy ra khi tải danh sách đơn hiến máu');
      } finally {
        setLoading(false);
      }
    };

    fetchBloodRequests();
  }, []);

  return { bloodRequests, loading, error };
};