import { useState, useEffect } from 'react';

export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/staff')
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy danh sách nhân viên');
        return res.json();
      })
      .then(data => setStaff(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { staff, loading, error };
}; 