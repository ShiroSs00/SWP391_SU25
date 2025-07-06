import React, { useState, useEffect } from 'react';
import { useRequestBlood } from '../hooks/useRequest-Blood';
import { getBloodCodes } from '../services/request-blood.services';
import type { BloodRequestPayload, BloodCode } from '../types/request-blood.types';
import type { AxiosError } from 'axios';

const RequestBloodPage: React.FC = () => {
  const { createRequest, loading, error } = useRequestBlood();
  const [bloodCodes, setBloodCodes] = useState<BloodCode[]>([]);
  const [loadingBloodCodes, setLoadingBloodCodes] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<BloodRequestPayload>({
    patientName: '',
    requestDate: '',
    bloodCode: '',
    volume: 0,
    isEmergency: false,
  });

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch blood codes on component mount
  useEffect(() => {
    const fetchBloodCodes = async () => {
      setLoadingBloodCodes(true);
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await getBloodCodes(token);
          console.log('API Response:', response); // Log the full API response
          const codes = response; // Access the nested data field
          if (Array.isArray(codes) && codes.length > 0) {
            setBloodCodes(codes);
          } else {
            console.warn('No blood codes available');
            setToast({ msg: 'Không có mã máu khả dụng', type: 'error' });
          }
        } else {
          console.error('Token not found in localStorage');
          setToast({ msg: 'Không tìm thấy token', type: 'error' });
        }
      } catch (err) {
        console.error('Error fetching blood codes:', err);
        setToast({ msg: 'Không thể tải danh sách mã máu', type: 'error' });
      } finally {
        setLoadingBloodCodes(false);
      }
    };

    fetchBloodCodes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!formData.patientName || !formData.requestDate || !formData.bloodCode || (formData.volume ?? 0) <= 0) {
      setToast({ msg: 'Vui lòng điền đầy đủ thông tin', type: 'error' });
      return;
    }

    // Đảm bảo định dạng ngày đúng chuẩn YYYY-MM-DD
    const formattedDate = new Date(formData.requestDate).toISOString().split('T')[0];

    const payload = {
      patientName: formData.patientName,
      requestDate: formattedDate, // Định dạng ngày
      volume: (formData.volume ?? 0) > 0 ? (formData.volume ?? 0) : null, // Đảm bảo giá trị hợp lệ
      bloodCode: formData.bloodCode || null, // Gửi null nếu không có mã máu
      isEmergency: formData.isEmergency || false, // Đúng tên thuộc tính theo interface
    };

    console.log('Payload gửi lên API:', JSON.stringify(payload, null, 2)); // Log chi tiết payload

    try {
      const response = await createRequest(payload);
      console.log('Response từ backend:', response); // Log response từ backend
      setToast({ msg: 'Tạo yêu cầu hiến máu thành công', type: 'success' });
      setFormData({
        patientName: '',
        requestDate: '',
        bloodCode: '',
        volume: 0,
        isEmergency: false,
      });
    } catch (err) {
      console.error('Error creating blood request:', err);
      if ((err as AxiosError).response) {
        console.error('Response lỗi từ backend:', (err as AxiosError).response?.data); // Log chi tiết lỗi từ backend
      }
      setToast({ msg: error || 'Có lỗi xảy ra khi tạo yêu cầu', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Yêu cầu hiến máu</h1>
          <p className="text-gray-600">Tạo yêu cầu hiến máu cho bệnh nhân</p>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mb-6 px-4 py-3 rounded-lg font-medium animate-fade-in-up ${
            toast.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {toast.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Tên bệnh nhân
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Nhập tên bệnh nhân"
            />
          </div>

          {/* Request Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8h.01M3 20h18l-2-9H5l-2 9z"/>
              </svg>
              Ngày yêu cầu
            </label>
            <input
              type="date"
              name="requestDate"
              value={formData.requestDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Blood Code */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Mã máu
            </label>
            <select
              name="bloodCode"
              value={formData.bloodCode || ''}
              onChange={handleInputChange}
              required
              disabled={loadingBloodCodes}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50"
            >
              <option value="">-- Chọn mã máu --</option>
              {bloodCodes.length > 0 ? (
                bloodCodes.map(({ bloodCode }) => (
                  <option key={bloodCode} value={bloodCode}>{bloodCode}</option>
                ))
              ) : (
                <option value="" disabled>Không có mã máu khả dụng</option>
              )}
            </select>
            {loadingBloodCodes && (
              <p className="text-sm text-gray-500">Đang tải danh sách mã máu...</p>
            )}
          </div>

          {/* Volume */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Thể tích (ml)
            </label>
            <select
              name="volume"
              value={formData.volume || ''}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="">-- Chọn thể tích máu --</option>
              <option value="250">250 ml</option>
              <option value="350">350 ml</option>
              <option value="450">450 ml</option>
            </select>
          </div>

          {/* Emergency */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isEmergency"
              id="isEmergency"
              checked={formData.isEmergency}
              onChange={handleInputChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
            />
            <label htmlFor="isEmergency" className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              Trường hợp khẩn cấp
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo yêu cầu...
                </div>
              ) : (
                'Tạo yêu cầu hiến máu'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestBloodPage;