import React, { useState } from 'react';
import { Heart, ArrowLeft, Info, AlertTriangle } from 'lucide-react';
import  BloodRequestForm  from '../components/BloodRequestForm';
import { NotificationBanner } from '../components/NotificationBanner';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';

export const RequestBloodPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useUserProfile();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleRequestSuccess = () => {
    setNotification({
      type: 'success',
      message: 'Yêu cầu hiến máu đã được gửi thành công! Hệ thống sẽ xử lý và thông báo kết quả sớm nhất.'
    });
  };

  const handleRequestError = (error: string) => {
    setNotification({
      type: 'error',
      message: error || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.'
    });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
          <span className="text-lg text-gray-600">Đang tải thông tin người dùng...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Yêu cầu đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để sử dụng tính năng yêu cầu máu.</p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
            Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <Heart className="w-6 h-6 text-red-500" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Hệ Thống Yêu Cầu Nhận Máu
              </h1>
              <p className="text-sm text-gray-600">
                Đăng ký yêu cầu nhận máu nhanh chóng và an toàn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Notification */}
        {notification && (
          <div className="mb-6">
            <NotificationBanner
              type={notification.type}
              title={notification.type === 'success' ? 'Thành công' : 'Lỗi'}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">Đăng Ký Yêu Cầu Nhận Máu</h1>
                <p className="text-red-100 text-sm mt-1">Vui lòng điền đầy đủ thông tin bên dưới</p>
              </div>
            </div>
          </div>

          {/* Patient Info Summary */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Người yêu cầu</h3>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
                <p className="font-medium">{profile.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nhóm máu</h3>
                <p className="font-medium">{profile.bloodType || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>

          {/* Blood Request Form */}
          <div className="p-6">
            <BloodRequestForm 
              onSuccess={handleRequestSuccess}
              onError={handleRequestError}
              defaultPatientName={profile.name || ''}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Thông tin quan trọng
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 list-disc pl-5">
            <li>Yêu cầu sẽ được xử lý trong vòng 24 giờ làm việc</li>
            <li>Vui lòng kiểm tra email và điện thoại thường xuyên để nhận thông báo</li>
            <li>Đối với trường hợp khẩn cấp, vui lòng liên hệ hotline 115</li>
            <li>Mọi thắc mắc xin liên hệ phòng tiếp nhận máu</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default RequestBloodPage;