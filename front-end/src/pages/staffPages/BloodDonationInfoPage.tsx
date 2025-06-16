import React, { useState, useEffect } from 'react';
import { BloodOrder } from '../../types/types';

const mockDonationInfo: BloodOrder[] = [
  {
    id: 1,
    user: "Trần Thị B",
    date: "2024-06-16",
    bloodType: "O+",
    hospital: "Bệnh viện Chợ Rẫy",
    urgency: true,
    status: "Hoàn thành",
    note: "Đã hiến 350ml",
    type: "Hiến máu",
  },
  {
    id: 2,
    user: "Nguyễn Văn A",
    date: "2024-06-15",
    bloodType: "A-",
    hospital: "Bệnh viện 115",
    urgency: false,
    status: "Hoàn thành",
    note: "Đã hiến 250ml",
    type: "Hiến máu",
  },
  {
    id: 3,
    user: "Lê Thị C",
    date: "2024-06-14",
    bloodType: "AB+",
    hospital: "Bệnh viện Đại học Y Dược",
    urgency: true,
    status: "Từ chối",
    note: "Không đủ điều kiện hiến máu",
    type: "Hiến máu",
  },
];

const BloodDonationInfoPage: React.FC = () => {
  const [donationInfo, setDonationInfo] = useState<BloodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationInfo = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setDonationInfo(mockDonationInfo);
      } catch (err) {
        setError("Không thể tải thông tin hiến máu.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonationInfo();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-700">Đang tải thông tin hiến máu...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Lỗi: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quản lý thông tin hiến máu</h2>
      <p className="text-gray-700 mb-6">Dưới đây là danh sách thông tin chi tiết về các đơn hiến máu đã hoàn thành hoặc từ chối.</p>
      
      {donationInfo.length === 0 ? (
        <p className="text-gray-600 text-center">Không có thông tin hiến máu nào để hiển thị.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Người dùng</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ngày</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nhóm máu</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Bệnh viện</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donationInfo.map((info) => (
                <tr key={info.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{info.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{info.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{info.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{info.bloodType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{info.hospital}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      info.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {info.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{info.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BloodDonationInfoPage; 