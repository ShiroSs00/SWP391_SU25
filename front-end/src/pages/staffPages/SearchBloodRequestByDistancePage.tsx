import React, { useState } from 'react';
import { useSearchBloodRequestByDistance } from '../../hooks/useSearchBloodRequestByDistance';

const SearchBloodRequestByDistancePage: React.FC = () => {
  const { results, loading, error, search } = useSearchBloodRequestByDistance();
  const [distance, setDistance] = useState(10);
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    search(distance, location);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-red-600">Tìm kiếm yêu cầu nhận máu theo khoảng cách</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="number"
          value={distance}
          onChange={e => setDistance(Number(e.target.value))}
          placeholder="Khoảng cách (km)"
          className="border p-2 rounded w-1/3"
        />
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Địa điểm"
          className="border p-2 rounded w-2/3"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSearch} disabled={loading}>
          Tìm kiếm
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <ul className="mt-4">
        {results.map((req: any) => (
          <li key={req.id} className="border-b py-2">
            {req.detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBloodRequestByDistancePage; 