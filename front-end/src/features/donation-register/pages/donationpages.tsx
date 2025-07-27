import React, { useState, useEffect } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { getAllEvents } from '../../event/hooks/useEvents';
import { getProfile } from '../../request-blood/services/user.serviecs';
import type { AdminEvent } from '../../admin/types/admin.types';
import type { UserProfile } from '../../request-blood/types/request-blood.types';
import DonationCreate from '../components/donation-create';

/**
 * Lấy accountId từ localStorage
 * @returns {string} - Account ID của user hiện tại
 */
const getAccountId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.accountId || '';
  } catch {
    return '';
  }
};

/**
 * Component chính quản lý trang đăng ký hiến máu
 * Chức năng:
 * - Kiểm tra authentication trước khi render
 * - Fetch danh sách events từ API
 * - Quản lý toast notifications
 * - Truyền dữ liệu xuống component con
 */
const DonationPages: React.FC = () => {
  // State quản lý authentication
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // State quản lý danh sách sự kiện
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy account ID từ localStorage
  const accountId = getAccountId();
  
  // State quản lý toast notification
  const [showToastMsg, setShowToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  /**
   * useEffect: Kiểm tra authentication khi component mount
   */
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Kiểm tra token hợp lệ bằng cách gọi API profile
        const profile = await getProfile(token);
        setUserProfile(profile);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading user profile:', err);
        // Nếu token không hợp lệ, xóa token và chuyển về trạng thái chưa đăng nhập
        localStorage.removeItem('authToken');
        localStorage.removeItem('user'); // Xóa cả user info
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  /**
   * useEffect: Fetch danh sách events khi đã authenticate
   */
  useEffect(() => {
    if (!isAuthenticated) return;
    
    console.log('Fetching events...');
    setLoading(true);
    getAllEvents()
      .then(data => {
        console.log('Events fetched successfully:', data);
        console.log('Events count:', data.length);
        setEvents(data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setEvents([]); // Set empty array if fetch fails
        showToast('❌ Không thể tải danh sách sự kiện', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated]);

  /**
   * Hàm hiển thị toast notification
   * @param {string} msg - Nội dung thông báo
   * @param {'success' | 'error'} type - Loại thông báo
   */
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setShowToastMsg(msg);
    setToastType(type);
    // Tự động ẩn toast sau 3 giây
    setTimeout(() => setShowToastMsg(null), 3000);
  };

  /**
   * Xử lý đăng nhập
   */
  const handleLogin = () => {
    window.location.href = '/login';
  };

  /**
   * Xử lý về trang chủ
   */
  const handleGoHome = () => {
    window.location.href = '/';
  };

  // Hiển thị loading khi đang kiểm tra authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Đang kiểm tra...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Hiển thị màn hình yêu cầu đăng nhập nếu chưa authenticate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Cần đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để đăng ký hiến máu.</p>
          <div className="space-y-3">
            <button 
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Đăng nhập ngay
            </button>
            <button 
              onClick={handleGoHome}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render trang chính khi đã đăng nhập
  return (
    <div className="min-h-screen">
      {/* Toast Notification */}
      {showToastMsg && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg text-white font-semibold max-w-md ${
            toastType === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gradient-to-r from-red-500 to-pink-500'
          }`}>
            <div className="flex items-center">
              {toastType === 'success' ? (
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{showToastMsg}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - chỉ render khi đã đăng nhập */}
      <DonationCreate 
        events={events} 
        accountId={accountId} 
        showToast={showToast} 
        hideStatus 
      />

      {/* Custom CSS for toast animation */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DonationPages;