import { useState, useEffect } from 'react';

export const useDonationApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách đơn xin hiến máu
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/donation-applications')
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy danh sách đơn xin hiến máu');
        return res.json();
      })
      .then(data => setApplications(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Cập nhật trạng thái đơn xin hiến máu
  const updateApplicationStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/donation-applications/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      // Cập nhật lại danh sách sau khi thay đổi
      setApplications(applications => applications.map(app => app.id === id ? { ...app, status } : app));
      return true;
    }
    return false;
  };

  return { applications, loading, error, updateApplicationStatus };
}; 