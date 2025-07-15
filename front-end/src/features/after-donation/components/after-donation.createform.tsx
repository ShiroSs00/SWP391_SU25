import React, { useState } from 'react';
import { useAfterDonation } from '../hooks/after-donation.hooks';
import type { AfterDonationData } from '../types/after-donation.types';

interface AfterDonationCreateFormProps {
  healthCheckId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean; // Thêm prop để xác định có phải modal không
}

const AfterDonationCreateForm: React.FC<AfterDonationCreateFormProps> = ({
  healthCheckId,
  onSuccess,
  onCancel,
  isModal = false
}) => {
  const { addAfterDonation, loading, error } = useAfterDonation();
  const [formData, setFormData] = useState<Partial<AfterDonationData>>({
    infectiousDiseasesChecked: false,
    isBloodUsable: true,
    note: '',
    status: 'PENDING',
    bloodId: ''
  });

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Toast auto-hide
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bloodId?.trim()) {
      setToast({ msg: 'Blood ID là bắt buộc', type: 'error' });
      return;
    }

    try {
      await addAfterDonation(healthCheckId, formData as AfterDonationData);
      setToast({ msg: 'Tạo bản ghi sau hiến máu thành công!', type: 'success' });
      
      // Reset form
      setFormData({
        infectiousDiseasesChecked: false,
        isBloodUsable: true,
        note: '',
        status: 'PENDING',
        bloodId: ''
      });

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch {
      setToast({ 
        msg: error || 'Có lỗi xảy ra khi tạo bản ghi sau hiến máu', 
        type: 'error' 
      });
    }
  };

  return (
    <div className={`${isModal ? '' : 'bg-white rounded-xl shadow-sm border border-gray-200 p-6'}`}>
      {/* Header - chỉ hiển thị khi không phải modal */}
      {!isModal && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Tạo Bản Ghi Sau Hiến Máu
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Health Check ID: <span className="font-medium text-blue-600">{healthCheckId}</span>
          </p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-white font-medium ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {toast.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {toast.msg}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blood ID */}
        <div>
          <label htmlFor="bloodId" className="block text-sm font-medium text-gray-700 mb-2">
            Blood ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="bloodId"
            name="bloodId"
            value={formData.bloodId || ''}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập Blood ID"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Trạng Thái
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'PENDING'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PENDING">Chờ Xử Lý</option>
            <option value="COMPLETED">Hoàn Thành</option>
            <option value="CANCELLED">Đã Hủy</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="infectiousDiseasesChecked"
              name="infectiousDiseasesChecked"
              checked={formData.infectiousDiseasesChecked || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="infectiousDiseasesChecked" className="ml-2 block text-sm text-gray-700">
              Đã kiểm tra bệnh truyền nhiễm
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isBloodUsable"
              name="isBloodUsable"
              checked={formData.isBloodUsable || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isBloodUsable" className="ml-2 block text-sm text-gray-700">
              Máu có thể sử dụng
            </label>
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Ghi Chú
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập ghi chú (tùy chọn)"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </div>
            ) : (
              'Tạo Bản Ghi'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AfterDonationCreateForm;
