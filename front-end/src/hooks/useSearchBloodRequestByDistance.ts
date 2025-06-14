import { useState } from 'react';

export const useSearchBloodRequestByDistance = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tìm kiếm yêu cầu nhận máu theo khoảng cách
  const search = async (distance: number, location: string) => {
    setLoading(true);
    setError(null);
    setResults([]);
    const res = await fetch(`/api/blood-requests/search?distance=${distance}&location=${encodeURIComponent(location)}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    } else {
      setError('Không thể tìm kiếm yêu cầu nhận máu');
    }
    setLoading(false);
  };

  return { results, loading, error, search };
}; 