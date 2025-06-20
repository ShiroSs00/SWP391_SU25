// src/useAuth.ts
import { useState } from 'react';
import api from '../../../services/axios/api';
import { type LoginFormData, type AuthResponse, type RegisterFormData } from '../types/auth.types';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = async (data: LoginFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post<AuthResponse>('/auth/login', data);
      const result = res.data;
      localStorage.setItem('authToken', result.token || '');
      return result;
    } catch (err: unknown) {
      let message = 'Lỗi không xác định';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (err as { response: { data: { message: string } } }).response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post<AuthResponse>('/auth/register', data);
      return res.data;
    } catch (err: unknown) {
      let message = 'Lỗi không xác định';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (err as { response: { data: { message: string } } }).response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading, error };
};
