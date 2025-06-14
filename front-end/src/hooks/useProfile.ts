import { useState, useEffect } from 'react';

export const useProfile = (username: string) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    fetch(`/api/profile?username=${encodeURIComponent(username)}`)
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy thông tin profile');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  return { profile, loading, error };
}; 