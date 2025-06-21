import React, { useEffect, useState } from 'react';
import { getAllEvents, createEvent, updateEvent, deleteEvent, filterEventsByDate } from '../hooks/useEvents';
import type { AdminEvent } from '../types/admin.types';
import { FaRegEdit, FaTrashAlt, FaPlus, FaCalendarAlt } from 'react-icons/fa';

const EVENT_STATUSES = [
  'Sắp diễn ra',
  'Đang diễn ra',
  'Đã kết thúc',
];

const initialForm: Omit<AdminEvent, 'eventId' | 'creationDate'> = {
  nameOfEvent: '',
  startDate: '',
  endDate: '',
  expectedBloodVolume: 0,
  actualVolume: 0,
  location: '',
  status: EVENT_STATUSES[0],
  accountId: '',
};

const getAccountId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.accountId || '';
  } catch {
    return '';
  }
};

const EventTable: React.FC<{ showToast?: (msg: string, type?: 'success' | 'error') => void }> = ({ showToast }) => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch {
      setError('Không thể tải danh sách sự kiện');
      if (showToast) showToast('Không thể tải danh sách sự kiện', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setForm({ ...initialForm, accountId: getAccountId() });
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (event: AdminEvent) => {
    setForm({ ...event });
    setEditId(event.eventId);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn chắc chắn muốn xóa sự kiện này?')) {
      try {
        await deleteEvent(id);
        if (showToast) showToast('Xóa sự kiện thành công', 'success');
        fetchEvents();
      } catch {
        if (showToast) showToast('Xóa sự kiện thất bại', 'error');
      }
    }
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSearch = async () => {
    if (!dateFilter.start || !dateFilter.end) {
      if (showToast) showToast('Vui lòng chọn đủ ngày bắt đầu và kết thúc', 'error');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await filterEventsByDate(dateFilter.start, dateFilter.end);
      setEvents(data);
      if (showToast) showToast('Lọc sự kiện thành công', 'success');
    } catch {
      setError('Không thể lọc sự kiện');
      if (showToast) showToast('Không thể lọc sự kiện', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateEvent(editId, form);
        if (showToast) showToast('Cập nhật sự kiện thành công', 'success');
      } else {
        await createEvent({ ...form, accountId: getAccountId() });
        if (showToast) showToast('Tạo sự kiện thành công', 'success');
      }
      setShowForm(false);
      fetchEvents();
    } catch {
      if (showToast) showToast('Thao tác thất bại', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 animate-fade-in">
      <h2 className="text-2xl font-extrabold mb-6 text-[#b71c1c] tracking-tight animate-fade-in-down">Quản lý sự kiện</h2>
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6 animate-fade-in-up">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#e53935] text-white rounded-full font-semibold shadow hover:bg-[#b71c1c] transition-all duration-200 animate-bounce hover:scale-105" onClick={handleAdd}>
          <FaPlus className="w-5 h-5" /> Thêm sự kiện
        </button>
        <div className="flex gap-2 items-center bg-gray-50 px-3 py-2 rounded-full border border-gray-200 animate-fade-in">
          <span className="text-gray-500"><FaCalendarAlt className="w-5 h-5" /></span>
          <input type="date" name="start" value={dateFilter.start} onChange={handleDateFilterChange} className="border-none outline-none bg-transparent p-1 text-sm" />
          <span className="mx-1 text-gray-400">-</span>
          <input type="date" name="end" value={dateFilter.end} onChange={handleDateFilterChange} className="border-none outline-none bg-transparent p-1 text-sm" />
          <button type="button" className="ml-2 px-4 py-1.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200 animate-pulse" onClick={handleDateSearch}>Tìm kiếm</button>
        </div>
      </div>
      {showForm && (
        <form className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl shadow animate-fade-in-up" onSubmit={handleSubmit}>
          <input name="nameOfEvent" value={form.nameOfEvent} onChange={handleInputChange} placeholder="Tên sự kiện" className="border p-2 rounded focus:ring-2 focus:ring-[#e53935]" required />
          <input name="location" value={form.location} onChange={handleInputChange} placeholder="Địa điểm" className="border p-2 rounded focus:ring-2 focus:ring-[#e53935]" required />
          <input name="startDate" value={form.startDate} onChange={handleInputChange} type="date" className="border p-2 rounded focus:ring-2 focus:ring-[#e53935]" required />
          <input name="endDate" value={form.endDate} onChange={handleInputChange} type="date" className="border p-2 rounded focus:ring-2 focus:ring-[#e53935]" required />
          <input name="expectedBloodVolume" value={form.expectedBloodVolume} onChange={handleInputChange} type="number" min={0} placeholder="Dự kiến (đv máu)" className="border p-2 rounded focus:ring-2 focus:ring-[#e53935]" required />
          <input name="actualVolume" value={form.actualVolume} onChange={handleInputChange} type="number" min={0} placeholder="Đã nhận" className="border p-2 rounded focus:ring-2 focus:ring-[#e53935]" />
          <select name="status" value={form.status} onChange={handleInputChange} className="border p-2 rounded focus:ring-2 focus:ring-[#e53935]" required>
            {EVENT_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <input name="accountId" value={form.accountId} readOnly className="border p-2 rounded bg-gray-100 text-gray-500" required />
          <div className="col-span-full flex gap-3 mt-2 justify-end">
            <button type="submit" className="flex items-center gap-1 px-5 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all duration-200 animate-fade-in-up">{editId ? 'Cập nhật' : 'Tạo mới'}</button>
            <button type="button" className="px-5 py-2 bg-gray-300 rounded-full font-semibold hover:bg-gray-400 transition-all duration-200 animate-fade-in-up" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </form>
      )}
      {loading ? (
        <div className="animate-pulse">Đang tải...</div>
      ) : error ? (
        <div className="text-red-600 animate-fade-in-down">{error}</div>
      ) : (
        <div className="overflow-x-auto animate-fade-in">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-100 text-base text-[#b71c1c]">
                <th className="px-4 py-2 border-b font-bold">Tên sự kiện</th>
                <th className="px-4 py-2 border-b font-bold">Thời gian</th>
                <th className="px-4 py-2 border-b font-bold">Địa điểm</th>
                <th className="px-4 py-2 border-b font-bold">Dự kiến (đv máu)</th>
                <th className="px-4 py-2 border-b font-bold">Đã nhận</th>
                <th className="px-4 py-2 border-b font-bold">Trạng thái</th>
                <th className="px-4 py-2 border-b font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.eventId} className="hover:bg-[#fff3f3] transition-all animate-fade-in-up">
                  <td className="px-4 py-2 border-b font-semibold">{event.nameOfEvent}</td>
                  <td className="px-4 py-2 border-b">{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">{event.location}</td>
                  <td className="px-4 py-2 border-b text-center">{event.expectedBloodVolume}</td>
                  <td className="px-4 py-2 border-b text-center">{event.actualVolume}</td>
                  <td className="px-4 py-2 border-b">
                    {event.status === 'Sắp diễn ra' && (
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold animate-fade-in">{event.status}</span>
                    )}
                    {event.status === 'Đang diễn ra' && (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold animate-fade-in">{event.status}</span>
                    )}
                    {event.status === 'Đã kết thúc' && (
                      <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold animate-fade-in">{event.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-center flex gap-2 justify-center">
                    <button className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-all animate-fade-in-up hover:scale-105" onClick={() => handleEdit(event)}>
                      <FaRegEdit className="w-4 h-4" /> Sửa
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all animate-fade-in-up hover:scale-105" onClick={() => handleDelete(event.eventId)}>
                      <FaTrashAlt className="w-4 h-4" /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventTable;
