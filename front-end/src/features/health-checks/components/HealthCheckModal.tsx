import React, { useState, useEffect } from 'react';
import { createHealthCheck } from '../services/health-check.services';
import { getAdminProfileByAccountId } from '../../accounts/services/accounts.services';
import type { HealthCheckData } from '../types/health-check.types';
import type { DonationRegistrationDTO } from '../../donation-register/types/donations-register.types';

// Interface for API error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Array<{ message?: string } | string>;
}

interface HealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: DonationRegistrationDTO | null;
  onSuccess: () => void;
}

const HealthCheckModal: React.FC<HealthCheckModalProps> = ({ isOpen, onClose, donation, onSuccess }) => {
  const [formData, setFormData] = useState<HealthCheckData>({
    donationRegistrationId: '',
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
  const [userProfile, setUserProfile] = useState<{ fullName?: string; username?: string }>({});

  useEffect(() => {
    if (donation) {
      setFormData(prev => ({
        ...prev,
        donationRegistrationId: donation.registrationId
      }));

      // Lấy thông tin người dùng
      const fetchUserProfile = async () => {
        try {
          const profile = await getAdminProfileByAccountId(donation.accountId);
          const possibleNames = [
            profile.data?.fullName,
            profile.data?.name,
            profile.data?.firstName + ' ' + profile.data?.lastName,
            profile.fullName,
            profile.name,
            profile.firstName + ' ' + profile.lastName
          ].filter(Boolean);
          
          const displayName = possibleNames[0] || `Người hiến máu ${donation.accountId.slice(-3)}`;
          
          setUserProfile({
            fullName: displayName,
            username: profile.data?.username || profile.username
          });
        } catch (err) {
          console.error(`Error fetching profile for ${donation.accountId}:`, err);
          
          // Extract error message from API response for logging
          let errorMessage = 'Unknown error';
          if (
            err &&
            typeof err === 'object' &&
            'response' in err &&
            err.response &&
            typeof err.response === 'object' &&
            'data' in err.response &&
            err.response.data &&
            typeof err.response.data === 'object'
          ) {
            const responseData = err.response.data as ApiErrorResponse;
            errorMessage = responseData.message || responseData.error || errorMessage;
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          
          console.error('Profile fetch error details:', errorMessage);
          
          setUserProfile({
            fullName: `Người hiến máu ${donation.accountId.slice(-3)}`,
            username: donation.accountId
          });
        }
      };

      fetchUserProfile();
    }
  }, [donation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    console.log('=== FORM FIELD CHANGED ===');
    console.log('Field name:', name);
    console.log('Field value:', value);
    console.log('Field type:', type);
    console.log('Field checked:', checked);
    
    setFormData((prev) => {
      const newData = { 
        ...prev, 
        [name]: type === 'checkbox' 
          ? checked 
          : (name === 'weight' || name === 'temperature' || name === 'bloodPressure' || name === 'pulse' || name === 'hemoglobin' || name === 'volumeToTake') 
            ? Number(value) 
            : value 
      };
      
      // Set volumeToTake to 0 when isFitToDonate is unchecked
      if (name === 'isFitToDonate' && !checked) {
        newData.volumeToTake = 0;
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    

    try {
      await createHealthCheck(formData.donationRegistrationId, formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        donationRegistrationId: '',
        weight: undefined,
        temperature: undefined,
        bloodPressure: undefined,
        pulse: undefined,
        hemoglobin: undefined,
        volumeToTake: undefined,
        isFitToDonate: false,
        note: '',
      });
    } catch (err: unknown) {
      // Extract error message from API response
      let errorMessage = 'Có lỗi xảy ra khi tạo kiểm tra sức khỏe';
      
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object'
      ) {
        const responseData = err.response.data as ApiErrorResponse;
        
        // Try to extract message from different possible response structures
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
          const firstError = responseData.errors[0];
          errorMessage = typeof firstError === 'object' ? firstError.message || 'Validation error' : firstError;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error creating health check:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            Tạo Kiểm Tra Sức Khỏe
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông Tin Đăng Ký</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Mã đăng ký:</span>
                  <span className="ml-2 text-gray-900">{donation?.registrationId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Người hiến máu:</span>
                  <span className="ml-2 text-gray-900">{userProfile.fullName}</span>
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Chỉ Số Sinh Hiệu</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Huyết Áp (mmHg)
                  </label>
                  <input
                    type="number"
                    name="bloodPressure"
                    value={formData.bloodPressure || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="120"
                    step="0.1"
                    min="0"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Mạch (bpm)
                  </label>
                  <input
                    type="number"
                    name="pulse"
                    value={formData.pulse || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="60-100"
                    min="0"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nhiệt Độ (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="36.5"
                    step="0.1"
                    min="35"
                    max="42"
                  />
                </div>
              </div>
            </div>

            {/* Physical Measurements */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Số Cơ Thể</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cân Nặng (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="50-150"
                    min="0"
                    max="300"
                    step="0.1"
                  />
                </div>

                {/* Volume to Take - Only show if fit to donate */}
                {formData.isFitToDonate && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Lượng Máu Lấy (ml)
                    </label>
                    <select
                      name="volumeToTake"
                      value={formData.volumeToTake || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Chọn lượng máu lấy</option>
                      <option value="250">250 ml</option>
                      <option value="350">350 ml</option>
                      <option value="450">450 ml</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Hemoglobin (g/dL)
                  </label>
                  <input
                    type="number"
                    name="hemoglobin"
                    value={formData.hemoglobin || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="12-18"
                    step="0.1"
                    min="0"
                    max="25"
                  />
                </div>
              </div>
            </div>

            {/* Status and Notes */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết Quả & Ghi Chú</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Đủ Điều Kiện Hiến Máu
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer p-2 rounded-lg border-2 border-green-200 hover:bg-green-50">
                      <input
                        type="radio"
                        name="isFitToDonate"
                        value="true"
                        checked={formData.isFitToDonate === true}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFitToDonate: e.target.value === 'true' }))}
                        className="mr-2"
                      />
                      <span className="font-medium text-green-700">Đạt</span>
                    </label>
                    <label className="flex items-center cursor-pointer p-2 rounded-lg border-2 border-red-200 hover:bg-red-50">
                      <input
                        type="radio"
                        name="isFitToDonate"
                        value="false"
                        checked={formData.isFitToDonate === false}
                        onChange={(e) => setFormData(prev => {
                          const newData = { ...prev, isFitToDonate: e.target.value === 'true' };
                          // Set volumeToTake to 0 when not fit to donate
                          if (e.target.value === 'false') {
                            newData.volumeToTake = 0;
                          }
                          return newData;
                        })}
                        className="mr-2"
                      />
                      <span className="font-medium text-red-700">Không đạt</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ghi Chú
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Nhập ghi chú về kết quả kiểm tra..."
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Đang tạo...' : 'Tạo Kiểm Tra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckModal;
