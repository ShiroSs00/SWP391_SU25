import React, { useEffect, useState } from 'react';
import {
  getAllHealthChecks,
  deleteHealthCheck,
} from '../services/health-check.services';
import type { HealthCheckData } from '../types/health-check.types';

const HealthCheckManage: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheckData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthChecks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllHealthChecks();
        setHealthChecks(data);
      } catch (err) {
        setError((err as Error).message || 'An error occurred while fetching health checks.');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthChecks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kiểm tra sức khỏe này?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteHealthCheck(id);
      setHealthChecks((prev) => prev.filter((check) => check.healthCheckId !== id));
    } catch (err) {
      setError((err as Error).message || 'An error occurred while deleting the health check.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quản Lý Kiểm Tra Sức Khỏe</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Mã Kiểm Tra</th>
            <th className="border border-gray-300 px-4 py-2">Mã Đăng Ký</th>
            <th className="border border-gray-300 px-4 py-2">Cân Nặng</th>
            <th className="border border-gray-300 px-4 py-2">Nhiệt Độ</th>
            <th className="border border-gray-300 px-4 py-2">Huyết Áp</th>
            <th className="border border-gray-300 px-4 py-2">Mạch</th>
            <th className="border border-gray-300 px-4 py-2">Hemoglobin</th>
            <th className="border border-gray-300 px-4 py-2">Lượng Máu Lấy</th>
            <th className="border border-gray-300 px-4 py-2">Đủ Điều Kiện</th>
            <th className="border border-gray-300 px-4 py-2">Ghi Chú</th>
            <th className="border border-gray-300 px-4 py-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {healthChecks.map((check) => (
            <tr key={check.healthCheckId} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{check.healthCheckId}</td>
              <td className="border border-gray-300 px-4 py-2">{check.donationRegistrationId}</td>
              <td className="border border-gray-300 px-4 py-2">{check.weight}</td>
              <td className="border border-gray-300 px-4 py-2">{check.temperature}</td>
              <td className="border border-gray-300 px-4 py-2">{check.bloodPressure}</td>
              <td className="border border-gray-300 px-4 py-2">{check.pulse}</td>
              <td className="border border-gray-300 px-4 py-2">{check.hemoglobin}</td>
              <td className="border border-gray-300 px-4 py-2">{check.volumeToTake}</td>
              <td className="border border-gray-300 px-4 py-2">{check.isFitToDonate ? 'Đạt' : 'Không đạt'}</td>
              <td className="border border-gray-300 px-4 py-2">{check.note}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(check.healthCheckId!)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthCheckManage;