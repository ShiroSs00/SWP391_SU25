import React, { useState, useEffect } from 'react';
import { useProfile } from '../../accounts/hooks/useProfile';
import type { DonationCreatePayload } from '../types/donations-register.types';
import { createDonation } from '../hooks/useBloodDonation';
import type { AdminEvent } from '../../admin/types/admin.types';

interface DonationCreateProps {
  events: AdminEvent[];
  accountId: string;
  onSuccess?: () => void;
  showToast?: (msg: string, type?: 'success' | 'error') => void;
  hideStatus?: boolean;
}

const statusOptions = [
  'Đăng ký mới',
  'Đã xác nhận',
  'Đã hiến',
  'Đã huỷ',
];

const DonationCreate: React.FC<DonationCreateProps> = ({ events, accountId: propAccountId, onSuccess, showToast, hideStatus }) => {
  const { profile } = useProfile();
  const [status, setStatus] = useState(statusOptions[0]);
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState('');
  const [donationDate, setDonationDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [accountId, setAccountId] = useState(propAccountId || profile?.accountId);

  useEffect(() => {
    if (!propAccountId && profile?.accountId) {
      setAccountId(profile.accountId);
    }
  }, [propAccountId, profile]);

  const handleEventChange = (eventId: string) => {
    setEventId(eventId);
    const event = events.find(ev => ev.eventId === eventId) || null;
    setSelectedEvent(event);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: DonationCreatePayload = {
        eventId: eventId || null,
        accountId: accountId || null,
        status,
        donationDate,
        registrationId: null,
        dateCreated: new Date().toISOString(),
        componentId: null,
        healthCheckId: null,
        donorFeedbackId: null,
      };
      console.log('Payload gửi đến backend:', payload);
      if (!accountId) {
        console.error('Thiếu accountId trong payload!');
        if (showToast) showToast('Lỗi: Thiếu mã tài khoản', 'error');
        setLoading(false);
        return;
      }
      await createDonation(eventId || null, payload);
      if (showToast) showToast('Tạo đăng ký thành công', 'success');
      if (onSuccess) onSuccess();
      setEventId('');
      setDonationDate('');
    } catch (error) {
      console.error('Error response từ backend:', error);
      if (showToast) {
        let errorMessage = 'Tạo đăng ký thất bại';
        if (
          error &&
          typeof error === 'object' &&
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response &&
          error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data
        ) {
          errorMessage = (error.response.data as { message?: string }).message || errorMessage;
        }
        showToast(`Lỗi: ${errorMessage}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto animate-fade-in-up border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký hiến máu</h2>
        <p className="text-gray-600">Tạo đăng ký hiến máu mới cho người hiến</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8h.01M3 20h18l-2-9H5l-2 9z"/>
            </svg>
            Ngày hiến máu
          </label>
          <input
            type="date"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            value={donationDate}
            onChange={e => setDonationDate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Chọn sự kiện
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            value={eventId}
            onChange={e => handleEventChange(e.target.value)}
          >
            <option value="">-- Không chọn sự kiện --</option>
            {events.map(ev => (
              <option key={ev.eventId} value={ev.eventId}>{ev.nameOfEvent}</option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <div className="space-y-1 bg-blue-50 p-4 rounded-xl border border-blue-200">
            <label className="text-sm font-medium text-blue-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 8h.01M3 20h18l-2-9H5l-2 9z"/>
              </svg>
              Thời gian diễn ra sự kiện
            </label>
            <div className="text-blue-800 font-medium">
              {selectedEvent.startDate?.split('T')[0]} - {selectedEvent.endDate?.split('T')[0]}
            </div>
          </div>
        )}

        {!hideStatus && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Trạng thái
            </label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {eventId && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Mã sự kiện
            </label>
            <input 
              value={eventId} 
              readOnly 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-600 focus:outline-none" 
              placeholder="Không có sự kiện" 
            />
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !donationDate}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo đăng ký...
              </div>
            ) : (
              'Tạo đăng ký hiến máu'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationCreate;
