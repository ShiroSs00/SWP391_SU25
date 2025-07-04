import React, { useState, useEffect } from 'react';
import { useHealthCheck } from '../../health-checks/hooks/useHealthCheck';
import { getAllDonations } from '../../donation-register/hooks/useBloodDonation';
import type { DonationRegistrationDTO } from '../../donation-register/types/donations-register.types';
import type { HealthCheckData } from '../../health-checks/types/health-check.types';

const DonationHealthManagement: React.FC = () => {
  const [donationRegistrations, setDonationRegistrations] = useState<DonationRegistrationDTO[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [showHealthCheckForm, setShowHealthCheckForm] = useState(false);
  const [healthCheckData, setHealthCheckData] = useState<Partial<HealthCheckData>>({});
  const [loadingDonations, setLoadingDonations] = useState(true);

  const {
    healthCheck,
    loading: healthCheckLoading,
    error,
    fetchHealthCheckForRegistration,
    createNewHealthCheck,
    updateExistingHealthCheck
  } = useHealthCheck();

  // Load donation registrations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoadingDonations(true);
        const data = await getAllDonations();
        setDonationRegistrations(data);
      } catch (err) {
        console.error('Error fetching donations:', err);
      } finally {
        setLoadingDonations(false);
      }
    };
    fetchDonations();
  }, []);

  // Load health check khi chọn donation registration
  useEffect(() => {
    if (selectedRegistration) {
      fetchHealthCheckForRegistration(selectedRegistration);
    }
  }, [selectedRegistration, fetchHealthCheckForRegistration]);

  const handleCreateOrUpdateHealthCheck = async () => {
    if (!selectedRegistration) return;

    const data: HealthCheckData = {
      donationRegistrationId: selectedRegistration,
      bloodPressure: healthCheckData.bloodPressure || '',
      heartRate: healthCheckData.heartRate || 0,
      weight: healthCheckData.weight || 0,
      height: healthCheckData.height || 0,
      temperature: healthCheckData.temperature || 0,
      hemoglobin: healthCheckData.hemoglobin || 0,
      notes: healthCheckData.notes || '',
      status: healthCheckData.status || 'PENDING',
      checkDate: new Date().toISOString()
    };

    try {
      if (healthCheck) {
        await updateExistingHealthCheck(selectedRegistration, data);
        alert('Cập nhật health check thành công!');
      } else {
        await createNewHealthCheck(selectedRegistration, data);
        alert('Tạo health check thành công!');
      }
      setShowHealthCheckForm(false);
      setHealthCheckData({});
    } catch (err) {
      console.error('Error saving health check:', err);
      alert('Có lỗi xảy ra khi lưu health check');
    }
  };

  const openHealthCheckForm = (registrationId: string) => {
    setSelectedRegistration(registrationId);
    setShowHealthCheckForm(true);
    if (healthCheck) {
      setHealthCheckData(healthCheck);
    } else {
      setHealthCheckData({});
    }
  };

  if (loadingDonations) {
    return <div className="p-6">Đang tải danh sách đơn hiến máu...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#b71c1c]">Quản lý Health Check - Đơn hiến máu</h2>
      
      {/* Danh sách donation registrations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã sự kiện
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health Check
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donationRegistrations.map((registration) => (
              <tr key={registration.registrationId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {registration.registrationId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registration.eventId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registration.accountId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    registration.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    registration.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {registration.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(registration.dateCreated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openHealthCheckForm(registration.registrationId)}
                    className="bg-[#b71c1c] text-white px-3 py-1 rounded hover:bg-[#8b0000] transition text-sm"
                  >
                    {healthCheck && selectedRegistration === registration.registrationId ? 'Cập nhật' : 'Thêm'} Health Check
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Health Check */}
      {showHealthCheckForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-[#b71c1c]">
              {healthCheck ? 'Cập nhật' : 'Thêm'} Health Check
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Huyết áp
                </label>
                <input
                  type="text"
                  value={healthCheckData.bloodPressure || ''}
                  onChange={(e) => setHealthCheckData({...healthCheckData, bloodPressure: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="120/80"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhịp tim (bpm)
                </label>
                <input
                  type="number"
                  value={healthCheckData.heartRate || ''}
                  onChange={(e) => setHealthCheckData({...healthCheckData, heartRate: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="72"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cân nặng (kg)
                </label>
                <input
                  type="number"
                  value={healthCheckData.weight || ''}
                  onChange={(e) => setHealthCheckData({...healthCheckData, weight: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="60"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  value={healthCheckData.height || ''}
                  onChange={(e) => setHealthCheckData({...healthCheckData, height: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="170"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhiệt độ (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={healthCheckData.temperature || ''}
                  onChange={(e) => setHealthCheckData({...healthCheckData, temperature: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="36.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hemoglobin (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={healthCheckData.hemoglobin || ''}
                  onChange={(e) => setHealthCheckData({...healthCheckData, hemoglobin: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="12.5"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={healthCheckData.status || 'PENDING'}
                  onChange={(e) => setHealthCheckData({...healthCheckData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="APPROVED">Đạt yêu cầu</option>
                  <option value="REJECTED">Không đạt yêu cầu</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={healthCheckData.notes || ''}
                  onChange={(e) => setHealthCheckData({...healthCheckData, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                  placeholder="Ghi chú thêm về tình trạng sức khỏe..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowHealthCheckForm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateOrUpdateHealthCheck}
                disabled={healthCheckLoading}
                className="px-4 py-2 bg-[#b71c1c] text-white rounded hover:bg-[#8b0000] transition disabled:opacity-50"
              >
                {healthCheckLoading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default DonationHealthManagement;
