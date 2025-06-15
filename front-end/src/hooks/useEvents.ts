import { useState, useEffect } from 'react';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/events')
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy danh sách sự kiện');
        return res.json();
      })
      .then(data => setEvents(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading, error };
}; 