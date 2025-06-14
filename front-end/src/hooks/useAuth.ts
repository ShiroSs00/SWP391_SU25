import { useAuth as useAuthContext } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const { user, login, logout } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Hàm đăng nhập: truyền username, password, gọi API, nhận user và token
  const loginWithApi = async (username: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      // data.user và data.token phải đúng theo backend trả về
      login(data.user, data.token);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (user?.username) {
      setLoadingProfile(true);
      const token = localStorage.getItem('token');
      fetch(`/api/profile?username=${encodeURIComponent(user.username)}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => setProfile(data))
        .catch(() => setProfile(null))
        .finally(() => setLoadingProfile(false));
    } else {
      setProfile(null);
    }
  }, [user]);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';
  const isUser = user?.role === 'user';

  return {
    user,
    profile,
    loadingProfile,
    isLoggedIn,
    isAdmin,
    isStaff,
    isUser,
    login: loginWithApi, // login mới: truyền username, password
    logout,
  };
};
