// src/useAuth.ts
import { useState, useEffect } from 'react';
import api from '../../../services/axios/api';
import { type LoginFormData, type AuthResponse, type RegisterFormData } from '../types/auth.types';
import { triggerUserStateChange } from '../../../lib/userUtils';
import { geocodeAddress } from '../../../services/geocoding.service';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = async (data: LoginFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post<AuthResponse>('/auth/login', data);
      const result = res.data;
      
      // Lưu token
      localStorage.setItem('authToken', result.token || '');
      
      // Lưu thông tin người dùng
      if (result.success) {
        // Lưu thông tin cơ bản từ response login
        const basicUserInfo = {
          email: result.email || '',
          role: result.role || '',
          username: data.username
        };
        localStorage.setItem('user', JSON.stringify(basicUserInfo));
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', result.role || '');

        // Gọi API để lấy thông tin profile đầy đủ
        try {
          const profileRes = await api.get('/profile');
          const profileData = profileRes.data;
          
          // Cập nhật với thông tin profile đầy đủ
          const fullUserInfo = {
            ...basicUserInfo,
            name: profileData.name || profileData.fullName || '',
            profileId: profileData.profileId || '',
            phone: profileData.phone || '',
            bloodType: profileData.bloodType || '',
            address: profileData.address || null
          };
          
          localStorage.setItem('user', JSON.stringify(fullUserInfo));
          localStorage.setItem('name', profileData.name || profileData.fullName || '');
        } catch (profileError) {
          console.error('Lỗi khi lấy thông tin profile:', profileError);
          // Vẫn tiếp tục với thông tin cơ bản nếu không lấy được profile
        }
      }
      
      // Trigger user state change event after successful login
      triggerUserStateChange();
      
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
      // Geocode address to get latitude and longitude
      const fullAddress = `${data.address.street}, ${data.address.ward}, ${data.address.district}, ${data.address.city}, Vietnam`;
      console.log('🗺️ Geocoding address:', fullAddress);
      
      const geocodingResults = await geocodeAddress(fullAddress);
      console.log('🎯 Geocoding results:', geocodingResults);

      if (geocodingResults.length > 0) {
        const { lat, lon } = geocodingResults[0];
        data.address.latitude = parseFloat(lat);
        data.address.longitude = parseFloat(lon);
        console.log('📍 Coordinates set:', { latitude: data.address.latitude, longitude: data.address.longitude });
      } else {
        console.warn('⚠️ No geocoding results found for address:', fullAddress);
      }

      console.log('📤 Sending registration data:', data);
      const res = await api.post<AuthResponse>('/auth/register', data);
      console.log('📥 Registration response:', res.data);
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

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/logout');
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
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      
      // Trigger user state change event after logout
      triggerUserStateChange();
      
      setIsLoading(false);
    }
  };

  return { login, register, logout, isLoading, error };
};

export const useProfile = () => {
  const [profile, setProfile] = useState<{ accountId: string } | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('user');
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error('Lỗi khi parse thông tin người dùng từ localStorage:', error);
      }
    }
  }, []);

  return { profile };
};

interface CurrentUser {
  username: string;
  name?: string;
  email?: string;
  role?: string;
  profileId?: string;
  phone?: string;
  bloodType?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    ward?: string;
  } | null;
}

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const updateUserState = () => {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setCurrentUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Lỗi khi parse user data:', error);
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };

    // Cập nhật state ban đầu
    updateUserState();

    // Lắng nghe sự kiện thay đổi user state
    window.addEventListener('userStateChange', updateUserState);

    return () => {
      window.removeEventListener('userStateChange', updateUserState);
    };
  }, []);

  return {
    currentUser,
    isLoggedIn,
    username: currentUser?.username || null,
    name: currentUser?.name || null,
    role: currentUser?.role || null,
    email: currentUser?.email || null
  };
};
