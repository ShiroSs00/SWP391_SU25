import React, { useState, useEffect } from 'react';
import { createHealthCheck } from '../services/health-check.services';
import { getAllDonations } from '../../donation-register/hooks/useBloodDonation';
import type { HealthCheckData } from '../types/health-check.types';
import type { DonationRegistrationDTO } from '../../donation-register/types/donations-register.types';

const HealthCheckCreateForm: React.FC = () => {
  const [formData, setFormData] = useState<HealthCheckData>({
    donationRegistrationId: '',
    weight: 0,
    temperature: 0,
    bloodPressure: 0,
    pulse: 0,
    hemoglobin: 0,
    volumeToTake: 0,
    isFitToDonate: false,
    note: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [donationRegistrations, setDonationRegistrations] = useState<DonationRegistrationDTO[]>([]);

  useEffect(() => {
    const fetchDonationRegistrations = async () => {
      try {
        const data = await getAllDonations();
        setDonationRegistrations(data);
      } catch (err) {
        console.error('Error fetching donation registrations:', err);
      }
    };

    fetchDonationRegistrations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' 
        ? checked 
        : (name === 'weight' || name === 'temperature' || name === 'bloodPressure' || name === 'pulse' || name === 'hemoglobin' || name === 'volumeToTake') 
          ? Number(value) 
          : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createHealthCheck(formData.donationRegistrationId, formData);
      setSuccess('Health check created successfully!');
      setFormData({
        donationRegistrationId: '',
        weight: 0,
        temperature: 0,
        bloodPressure: 0,
        pulse: 0,
        hemoglobin: 0,
        volumeToTake: 0,
        isFitToDonate: false,
        note: '',
      });
    } catch (err) {
      setError((err as Error).message || 'An error occurred while creating the health check.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Tạo Kiểm Tra Sức Khỏe
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mã Đăng Ký Hiến Máu <span className="text-red-500">*</span>
            </label>
            <select
              name="donationRegistrationId"
              value={formData.donationRegistrationId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Chọn mã đăng ký hiến máu</option>
              {donationRegistrations.map((donation) => (
                <option key={donation.registrationId} value={donation.registrationId}>
                  {donation.registrationId} - {donation.accountId} - {donation.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Chỉ Số Sinh Hiệu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Huyết Áp (mmHg)
              </label>
              <input
                type="number"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="120"
                step="0.1"
                min="0"
                max="300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mạch (bpm)
              </label>
              <input
                type="number"
                name="pulse"
                value={formData.pulse}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="60-100"
                min="0"
                max="300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nhiệt Độ (°C)
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="36.5"
                step="0.1"
                min="35"
                max="42"
              />
            </div>
          </div>
        </div>

        {/* Physical Measurements */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Số Cơ Thể</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cân Nặng (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="50-150"
                min="0"
                max="300"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Lượng Máu Lấy (ml)
              </label>
              <input
                type="number"
                name="volumeToTake"
                value={formData.volumeToTake}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="350-450"
                min="0"
                max="1000"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hemoglobin (g/dL)
              </label>
              <input
                type="number"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="12-18"
                step="0.1"
                min="0"
                max="25"
              />
            </div>
          </div>
        </div>

        {/* Status and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Đủ Điều Kiện Hiến Máu
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isFitToDonate"
                  value="true"
                  checked={formData.isFitToDonate === true}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFitToDonate: e.target.value === 'true' }))}
                  className="mr-2"
                />
                Đạt
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isFitToDonate"
                  value="false"
                  checked={formData.isFitToDonate === false}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFitToDonate: e.target.value === 'true' }))}
                  className="mr-2"
                />
                Không đạt
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ghi Chú
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Nhập ghi chú về kết quả kiểm tra..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo...
              </div>
            ) : (
              'Tạo Kiểm Tra Sức Khỏe'
            )}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default HealthCheckCreateForm;