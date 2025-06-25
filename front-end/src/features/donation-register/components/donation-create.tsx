import React, { useState } from 'react';
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

const DonationCreate: React.FC<DonationCreateProps> = ({ events, accountId, onSuccess, showToast, hideStatus }) => {
  const [status, setStatus] = useState(statusOptions[0]);
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) {
      if (showToast) showToast('Vui lòng chọn sự kiện!', 'error');
      return setLoading(false);
    }
    setLoading(true);
    try {
      const payload: DonationCreatePayload = { eventId, accountId, status };
      await createDonation(eventId, payload);
      if (showToast) showToast('Tạo đăng ký thành công', 'success');
      if (onSuccess) onSuccess();
      setEventId('');
    } catch {
      if (showToast) showToast('Tạo đăng ký thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto animate-fade-in-up border border-gray-100">
      <h2 className="text-2xl font-extrabold mb-6 text-[#b71c1c] tracking-tight text-center">Tạo đăng ký hiến máu</h2>
      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">Chọn sự kiện</label>
        <select
          className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition"
          value={eventId}
          onChange={e => setEventId(e.target.value)}
        >
          <option value="">-- Không chọn sự kiện --</option>
          {events.map(ev => (
            <option key={ev.eventId} value={ev.eventId}>{ev.nameOfEvent}</option>
          ))}
        </select>
      </div>
      {!hideStatus && (
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">Trạng thái</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition">
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">Mã sự kiện</label>
        <input value={eventId} readOnly className="border border-gray-300 p-2 rounded-lg w-full bg-gray-100 text-gray-500 focus:outline-none" placeholder="Không có sự kiện" />
      </div>
      <div className="mb-8">
        <label className="block mb-2 font-semibold text-gray-700">Mã tài khoản</label>
        <input value={accountId} readOnly className="border border-gray-300 p-2 rounded-lg w-full bg-gray-100 text-gray-500 focus:outline-none" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#e53935] text-white rounded-full font-bold text-lg shadow hover:bg-[#b71c1c] transition-all duration-200 disabled:opacity-60"
      >
        {loading ? 'Đang tạo...' : 'Tạo đăng ký'}
      </button>
    </form>
  );
};

export default DonationCreate;
