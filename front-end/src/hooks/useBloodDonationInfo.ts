import { useState, useEffect } from 'react';

export const useBloodDonationInfo = (username: string) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    fetch(`/api/blood-donation-info?username=${encodeURIComponent(username)}`)
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy thông tin hiến máu');
        return res.json();
      })
      .then(data => setInfo(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  // Cập nhật thông tin hiến máu
  const updateInfo = async (newInfo: any) => {
    const res = await fetch(`/api/blood-donation-info?username=${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInfo),
    });
    if (res.ok) {
      setInfo(newInfo);
      return true;
    }
    return false;
  };

  return { info, loading, error, updateInfo };
}; 