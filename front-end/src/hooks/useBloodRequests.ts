import { useState, useEffect } from 'react';

export const useBloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/blood-requests')
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy danh sách yêu cầu nhận máu');
        return res.json();
      })
      .then(data => setRequests(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { requests, loading, error };
}; 