import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createHealthCheck } from '../services/health-check.services';
import { getAllDonations } from '../../donation-register/hooks/useBloodDonation';
import { getAdminProfileByAccountId } from '../../accounts/services/accounts.services';
import type { HealthCheckData } from '../types/health-check.types';
import type { DonationRegistrationDTO } from '../../donation-register/types/donations-register.types';

const HealthCheckCreateForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const registrationIdFromUrl = searchParams.get('registrationId');

  const [formData, setFormData] = useState<HealthCheckData>({
    donationRegistrationId: registrationIdFromUrl || '',
    weight: undefined,
    temperature: undefined,
    bloodPressure: undefined,
    pulse: undefined,
    hemoglobin: undefined,
    volumeToTake: undefined,
    isFitToDonate: false,
    note: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [donationRegistrations, setDonationRegistrations] = useState<DonationRegistrationDTO[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: { fullName?: string; username?: string } }>({});

  useEffect(() => {
    const fetchDonationRegistrations = async () => {
      try {
        const data = await getAllDonations();
        // Chỉ hiển thị các đơn có trạng thái PASSED và chưa có health check
        const passedDonations = data.filter(donation =>
          donation.status === 'PASSED' && 
          (!donation.healthCheckId || donation.healthCheckId === '' || donation.healthCheckId === null)
        );
        setDonationRegistrations(passedDonations);

        // Lấy thông tin profile cho từng user
        const profiles: { [key: string]: { fullName?: string; username?: string } } = {};
        for (const donation of passedDonations) {
          if (donation.accountId && !profiles[donation.accountId]) {
            try {
              const profile = await getAdminProfileByAccountId(donation.accountId);
              
              // Thử nhiều field name có thể có
              const possibleNames = [
                profile.data?.fullName,
                profile.data?.name,
                profile.data?.firstName + ' ' + profile.data?.lastName,
                profile.fullName,
                profile.name,
                profile.firstName + ' ' + profile.lastName
              ].filter(Boolean);
              
              const displayName = possibleNames[0] || `Người hiến máu ${donation.accountId.slice(-3)}`;
              
              profiles[donation.accountId] = {
                fullName: displayName,
                username: profile.data?.username || profile.username
              };
            } catch (err) {
              console.error(`Error fetching profile for ${donation.accountId}:`, err);
              profiles[donation.accountId] = {
                fullName: `Người hiến máu ${donation.accountId.slice(-3)}`,
                username: donation.accountId
              };
            }
          }
        }
        setUserProfiles(profiles);
      } catch (err) {
        console.error('Error fetching donation registrations:', err);
      }
    };

    fetchDonationRegistrations();
  }, []);

  // Cập nhật formData khi có registrationId từ URL
  useEffect(() => {
    if (registrationIdFromUrl) {
      setFormData(prev => ({
        ...prev,
        donationRegistrationId: registrationIdFromUrl
      }));
    }
  }, [registrationIdFromUrl]);

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
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-4">
        Tạo Kiểm Tra Sức Khỏe
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Thông Tin Đăng Ký
          </h3>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Mã Đăng Ký Hiến Máu <span className="text-red-500">*</span>
            </label>
            <select
              name="donationRegistrationId"
              value={formData.donationRegistrationId}
              onChange={handleChange}
              disabled={!!registrationIdFromUrl}
              required
              className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 font-medium ${
                registrationIdFromUrl ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
            >
              <option value="">Chọn mã đăng ký hiến máu</option>
              {donationRegistrations.map((donation) => {
                const userProfile = userProfiles[donation.accountId];
                const displayName = userProfile?.fullName || `Người hiến máu ${donation.accountId.slice(-3)}`;
                return (
                  <option key={donation.registrationId} value={donation.registrationId}>
                    {donation.registrationId} - {displayName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            Chỉ Số Sinh Hiệu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Huyết Áp (mmHg)
              </label>
              <input
                type="number"
                name="bloodPressure"
                value={formData.bloodPressure || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                placeholder="120"
                step="0.1"
                min="0"
                max="300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Mạch (bpm)
              </label>
              <input
                type="number"
                name="pulse"
                value={formData.pulse}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                placeholder="60-100"
                min="0"
                max="300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nhiệt Độ (°C)
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                placeholder="36.5"
                step="0.1"
                min="35"
                max="42"
              />
            </div>
          </div>
        </div>

        {/* Physical Measurements */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Thông Số Cơ Thể
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Cân Nặng (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                placeholder="50-150"
                min="0"
                max="300"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Lượng Máu Lấy (ml)
              </label>
              <select
                name="volumeToTake"
                value={formData.volumeToTake || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 font-medium"
              >
                <option value="">Chọn lượng máu lấy</option>
                <option value="250">250 ml</option>
                <option value="350">350 ml</option>
                <option value="450">450 ml</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Hemoglobin (g/dL)
              </label>
              <input
                type="number"
                name="hemoglobin"
                value={formData.hemoglobin || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                placeholder="12-18"
                step="0.1"
                min="0"
                max="25"
              />
            </div>
          </div>
        </div>

        {/* Status and Notes */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Kết Quả & Ghi Chú
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Đủ Điều Kiện Hiến Máu
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer p-3 rounded-lg border-2 border-green-200 hover:bg-green-50 transition-all duration-200">
                  <input
                    type="radio"
                    name="isFitToDonate"
                    value="true"
                    checked={formData.isFitToDonate === true}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFitToDonate: e.target.value === 'true' }))}
                    className="mr-3 w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="font-medium text-green-700">Đạt</span>
                </label>
                <label className="flex items-center cursor-pointer p-3 rounded-lg border-2 border-red-200 hover:bg-red-50 transition-all duration-200">
                  <input
                    type="radio"
                    name="isFitToDonate"
                    value="false"
                    checked={formData.isFitToDonate === false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFitToDonate: e.target.value === 'true' }))}
                    className="mr-3 w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="font-medium text-red-700">Không đạt</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Ghi Chú
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white text-gray-900 resize-none"
                placeholder="Nhập ghi chú về kết quả kiểm tra..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-xl shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6 shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800">Có lỗi xảy ra</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-6 shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-green-800">Thành công</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default HealthCheckCreateForm;