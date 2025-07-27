import { useState, useEffect } from 'react';
import { getProfile } from '../services/user.serviecs';
import type { UserProfile } from '../types/request-blood.types';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // ĐỔI TỪ 'token' THÀNH 'authToken'
        const token = localStorage.getItem('authToken');
        console.log('🔑 AuthToken:', token ? 'Có token' : 'Không có token');
        
        if (!token) {
          setProfile(null);
          setLoading(false);
          return;
        }
        
        const userProfile = await getProfile(token);
        console.log('✅ Profile fetched:', userProfile);
        setProfile(userProfile);
        
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
        setError('Không thể tải thông tin người dùng');
        setProfile(null);
        // Xóa authToken nếu có lỗi
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};