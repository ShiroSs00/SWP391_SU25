import React, { useState, useEffect } from 'react';
import { getAllEvents } from '../../event/hooks/useEvents';
import type { AdminEvent } from '../../event/types/admin.types';
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
 * - Fetch danh sách events từ API
 * - Quản lý toast notifications
 * - Truyền dữ liệu xuống component con
 */
const DonationPages: React.FC = () => {
  // State quản lý danh sách sự kiện
  const [events, setEvents] = useState<AdminEvent[]>([]);
  
  // Lấy account ID từ localStorage
  const accountId = getAccountId();
  
  // State quản lý toast notification
  const [showToastMsg, setShowToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  /**
   * useEffect: Fetch danh sách events khi component mount
   */
  useEffect(() => {
    getAllEvents()
      .then(setEvents)
      .catch(error => {
        console.error('Error fetching events:', error);
        setEvents([]); // Set empty array if fetch fails
      });
  }, []);

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

      {/* Main Content */}
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