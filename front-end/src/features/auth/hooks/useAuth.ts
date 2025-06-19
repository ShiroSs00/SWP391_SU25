// useAuth.ts
import { useState } from 'react';
import { LoginFormData, AuthHookReturn } from './types/auth.types';

export const useAuth = (): AuthHookReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    setError('');

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const result = await response.json();
      
      // Store token in localStorage or handle as needed
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }

      // You can also store user data
      if (result.user) {
        localStorage.setItem('userData', JSON.stringify(result.user));
      }

      console.log('Login successful:', result);
      
      // You might want to redirect or update global state here
      // window.location.href = '/dashboard';
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Redirect to login page or update global state
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('authToken');
  };

  return { 
    login, 
    isLoading, 
    error,
    // You can add more methods if needed
    // logout,
    // isAuthenticated
  };
};