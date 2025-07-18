import React, { useState, useEffect } from 'react';
import { updateHealthCheck } from '../services/health-check.services';
import type { HealthCheckData } from '../types/health-check.types';
import type { ProfileData } from '../../accounts/types/accounts.types';

interface UpdateHealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthCheck: HealthCheckData;
  onSuccess: () => void;
  userProfile?: ProfileData; // Add user profile prop
}

const UpdateHealthCheckModal: React.FC<UpdateHealthCheckModalProps> = ({ 
  isOpen, 
  onClose, 
  healthCheck, 
  onSuccess,
  userProfile 
}) => {
  const [formData, setFormData] = useState<HealthCheckData>(healthCheck);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blood volume options
  const bloodVolumeOptions = [
    { value: 250, label: '250ml' },
    { value: 350, label: '350ml' },
    { value: 450, label: '450ml' },
  ];

  // Get user display name
  const getUserDisplayName = () => {
    if (!userProfile) return healthCheck.donationRegistrationId;
    return userProfile.name || userProfile.username || userProfile.email || healthCheck.donationRegistrationId;
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(healthCheck);
      setError(null);
    }
  }, [isOpen, healthCheck]);

  const handleInputChange = (field: keyof HealthCheckData, value: string | number | boolean | undefined) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Handle volumeToTake based on isFitToDonate status
      if (field === 'isFitToDonate') {
        if (!value) {
          // Set volumeToTake to null when isFitToDonate is unchecked
          newData.volumeToTake = null;
          console.log('Setting volumeToTake to null because not fit to donate');
        } else {
          // Reset volumeToTake to undefined when isFitToDonate is checked (force user to select)
          newData.volumeToTake = undefined;
          console.log('Resetting volumeToTake to undefined - user must select');
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!healthCheck.healthCheckId) {
      setError('Không tìm thấy ID kiểm tra sức khỏe');
      return;
    }

    // Validate that if fit to donate, volume must be selected
    if (formData.isFitToDonate && !formData.volumeToTake) {
      setError('Vui lòng chọn lượng máu lấy khi đủ điều kiện hiến máu');
      return;
    }

    setLoading(true);
    setError(null);

    console.log('Form data before update:', formData);
    console.log('volumeToTake value:', formData.volumeToTake);
    console.log('isFitToDonate value:', formData.isFitToDonate);

    try {
      await updateHealthCheck(healthCheck.healthCheckId, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Cập nhật kiểm tra sức khỏe thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-2 mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Cập Nhật Kiểm Tra Sức Khỏe</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Mã: {healthCheck.healthCheckId} | Người dùng: {getUserDisplayName()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cân nặng (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhiệt độ (°C) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="42"
                value={formData.temperature || ''}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Blood Pressure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Huyết áp (mmHg) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="120/80"
                value={formData.bloodPressure || ''}
                onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Pulse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mạch (bpm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="40"
                max="200"
                value={formData.pulse || ''}
                onChange={(e) => handleInputChange('pulse', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Hemoglobin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hemoglobin (g/dL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="8"
                max="20"
                value={formData.hemoglobin || ''}
                onChange={(e) => handleInputChange('hemoglobin', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Volume to Take - Only show if fit to donate */}
            {formData.isFitToDonate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lượng máu lấy (ml) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.volumeToTake || ''}
                  onChange={(e) => handleInputChange('volumeToTake', parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Chọn lượng máu</option>
                  {bloodVolumeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Fit to Donate */}
          <div className="mt-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.isFitToDonate || false}
                onChange={(e) => handleInputChange('isFitToDonate', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Đủ điều kiện hiến máu
              </span>
            </label>
          </div>

          {/* Note */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              rows={3}
              value={formData.note || ''}
              onChange={(e) => handleInputChange('note', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập ghi chú thêm (nếu có)..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateHealthCheckModal;
