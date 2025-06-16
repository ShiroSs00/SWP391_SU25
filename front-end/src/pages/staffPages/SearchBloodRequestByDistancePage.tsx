import React, { useState, useEffect } from 'react';

interface BloodRequest {
  id: number;
  bloodType: string;
  location: string;
  urgency: boolean;
  detail: string;
}

const mockBloodRequests: BloodRequest[] = [
  {
    id: 1,
    bloodType: "A+",
    location: "Hồ Chí Minh",
    urgency: true,
    detail: "Yêu cầu A+ tại Hồ Chí Minh, khẩn cấp!",
  },
  {
    id: 2,
    bloodType: "B-",
    location: "Hà Nội",
    urgency: false,
    detail: "Yêu cầu B- tại Hà Nội.",
  },
  {
    id: 3,
    bloodType: "O+",
    location: "Đà Nẵng",
    urgency: true,
    detail: "Yêu cầu O+ tại Đà Nẵng, khẩn cấp!",
  },
  {
    id: 4,
    bloodType: "AB+",
    location: "Hồ Chí Minh",
    urgency: false,
    detail: "Yêu cầu AB+ tại Hồ Chí Minh.",
  },
  {
    id: 5,
    bloodType: "A+",
    location: "Cần Thơ",
    urgency: true,
    detail: "Yêu cầu A+ tại Cần Thơ, khẩn cấp!",
  },
];

const SearchBloodRequestByDistancePage: React.FC = () => {
  const [results, setResults] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState(10);
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Load all mock requests initially
    setResults(mockBloodRequests);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const filtered = mockBloodRequests.filter(req => {
        const matchesLocation = location 
          ? req.location.toLowerCase().includes(location.toLowerCase())
          : true;
        
        // Simulate distance check (for simplicity, only check for HCM, HN, DN, CT)
        // In a real app, you'd calculate actual distance
        const isInDistance = true; // Always true for mock, as we don't have actual coordinates

        return matchesLocation && isInDistance;
      });
      setResults(filtered);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setError("Không thể tìm kiếm yêu cầu nhận máu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tìm kiếm yêu cầu nhận máu theo khoảng cách</h2>
      <p className="text-gray-700 mb-6">Nhập địa điểm để tìm kiếm các yêu cầu nhận máu gần đó.</p>
      <div className="mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Nhập địa điểm (ví dụ: Hồ Chí Minh)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div className="w-32">
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">Khoảng cách (km)</label>
          <input
            id="distance"
            type="number"
            value={distance}
            onChange={e => setDistance(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            min="1"
          />
        </div>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </div>

      {error && <div className="text-red-600 mt-4">Lỗi: {error}</div>}
      
      {results.length === 0 && !loading && !error ? (
        <p className="text-gray-600 text-center py-4">Không tìm thấy yêu cầu nào.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {results.map((req: BloodRequest) => (
            <li key={req.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center space-x-4">
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  req.urgency ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {req.bloodType}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{req.detail}</p>
                <p className="text-sm text-gray-600">Địa điểm: {req.location}</p>
              </div>
              {req.urgency && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Khẩn cấp
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBloodRequestByDistancePage; 