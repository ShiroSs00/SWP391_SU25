import { useState, useEffect } from 'react';

export const useDonationHistory = (username: string) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);
    fetch(`/api/donation-history?username=${encodeURIComponent(username)}`)
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy lịch sử hiến máu');
        return res.json();
      })
      .then(data => setHistory(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [username]);

  return { history, loading, error };
}; 