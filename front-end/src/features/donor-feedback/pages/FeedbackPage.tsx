import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import FeedbackForm from '../components/FeedbackForm';
import { createFeedback } from '../services/feedback.service';
import type { CreateFeedbackRequest } from '../types/feedback.types';
import { validateRegistrationId, formatErrorMessage } from '../utils/validation';
import toast, { Toaster } from 'react-hot-toast';

const FeedbackPage: React.FC = () => {
  const { registrationId } = useParams<{ registrationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmitFeedback = async (data: CreateFeedbackRequest) => {
    if (!registrationId) {
      toast.error('Không tìm thấy mã đăng ký');
      return;
    }

    if (!isOnline) {
      toast.error('Không có kết nối internet. Vui lòng kiểm tra kết nối và thử lại.');
      return;
    }

    // Validate registration ID
    const validationError = validateRegistrationId(registrationId);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      // Call API with registrationId as path parameter and data as body
      await createFeedback(registrationId, data);
      toast.success('Feedback đã được gửi thành công!');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      const errorMessage = formatErrorMessage(error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        toast.error('Bạn đã gửi feedback cho lần hiến máu này rồi');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy thông tin đăng ký hiến máu');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền gửi feedback cho đăng ký này');
      } else if (error.response?.status >= 500) {
        toast.error('Lỗi server. Vui lòng thử lại sau.');
      } else {
        toast.error(errorMessage);
      }
      
      throw error; // Re-throw to let FeedbackForm handle the error display
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Validate registration ID from URL
  if (!registrationId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thiếu thông tin
            </h2>
            <p className="text-gray-600 mb-6">
              Không tìm thấy mã đăng ký hiến máu. Vui lòng kiểm tra lại đường dẫn.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
              </button>
              <button
                onClick={handleGoHome}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Validate registration ID format
  const validationError = validateRegistrationId(registrationId);
  if (validationError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Mã đăng ký không hợp lệ
            </h2>
            <p className="text-gray-600 mb-6">
              {validationError}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại
              </button>
              <button
                onClick={handleGoHome}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Header with navigation and connection status */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>

            <div className="flex items-center gap-4">
              {/* Connection status indicator */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isOnline 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span>Đã kết nối</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span>Mất kết nối</span>
                  </>
                )}
              </div>

              <button
                onClick={handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {!isOnline && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <WifiOff className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Mất kết nối internet</h3>
                <p className="text-red-700 text-sm">
                  Vui lòng kiểm tra kết nối internet để có thể gửi feedback.
                </p>
              </div>
            </div>
          </div>
        )}

        <FeedbackForm
          registrationId={registrationId}
          onSubmit={handleSubmitFeedback}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default FeedbackPage;