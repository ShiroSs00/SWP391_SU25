import React, { useCallback, useEffect, useState } from 'react';
import { getAllEvents, createEvent, updateEvent, deleteEvent, deleteMultipleEvents, filterEventsByEndDateRange } from '../hooks/useEvents';
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
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const fetchEvents = useCallback(async () => {
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
  }, [showToast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
      const data = await filterEventsByEndDateRange(dateFilter.start, dateFilter.end);
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

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedEvents.length === 0) {
      if (showToast) showToast('Vui lòng chọn ít nhất một sự kiện để xóa', 'error');
      return;
    }
    if (window.confirm('Bạn chắc chắn muốn xóa các sự kiện đã chọn?')) {
      try {
        await deleteMultipleEvents(selectedEvents);
        if (showToast) showToast('Xóa các sự kiện thành công', 'success');
        fetchEvents();
        setSelectedEvents([]);
      } catch {
        if (showToast) showToast('Xóa các sự kiện thất bại', 'error');
      }
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-3xl font-bold mb-4 text-red-600">Quản lý sự kiện</h2>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <button className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-medium" onClick={handleAdd}>
          <FaPlus className="w-5 h-5" /> Thêm sự kiện
        </button>
        <div className="flex gap-2 items-center bg-white px-4 py-3 rounded-lg border border-gray-300">
          <span className="text-gray-500"><FaCalendarAlt className="w-5 h-5" /></span>
          <input type="date" name="start" value={dateFilter.start} onChange={handleDateFilterChange} className="border-none outline-none bg-transparent p-1 text-sm" />
          <span className="mx-2 text-gray-400">-</span>
          <input type="date" name="end" value={dateFilter.end} onChange={handleDateFilterChange} className="border-none outline-none bg-transparent p-1 text-sm" />
          <button type="button" className="ml-3 px-5 py-2 bg-blue-500 text-white rounded-lg font-medium" onClick={handleDateSearch}>Tìm kiếm</button>
        </div>
      </div>
      {showForm && (
        <form className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
          <input name="nameOfEvent" value={form.nameOfEvent} onChange={handleInputChange} placeholder="Tên sự kiện" className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" required />
          <input name="location" value={form.location} onChange={handleInputChange} placeholder="Địa điểm" className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" required />
          <input name="startDate" value={form.startDate} onChange={handleInputChange} type="date" className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" />
          <input name="endDate" value={form.endDate} onChange={handleInputChange} type="date" className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" />
          <input name="expectedBloodVolume" value={form.expectedBloodVolume} onChange={handleInputChange} type="number" min={0} placeholder="Dự kiến (đv máu)" className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" />
          {editId && (
            <input name="actualVolume" value={form.actualVolume} onChange={handleInputChange} type="number" min={0} placeholder="Máu đã nhận (đv máu)" className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" />
          )}
          <select name="status" value={form.status} onChange={handleInputChange} className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500" required>
            {EVENT_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="col-span-full flex gap-4 mt-4 justify-end">
            <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium">{editId ? 'Cập nhật' : 'Tạo mới'}</button>
            <button type="button" className="px-6 py-3 bg-gray-400 text-white rounded-lg font-medium" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </form>
      )}
      <div className="flex justify-end mb-4">
        <button
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium"
          onClick={handleDeleteSelected}
        >
          Xóa các sự kiện đã chọn
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="bg-gray-200 text-lg text-red-600">
                <th className="px-6 py-3 border-b font-bold">Chọn</th>
                <th className="px-6 py-3 border-b font-bold">Tên sự kiện</th>
                <th className="px-6 py-3 border-b font-bold">Thời gian</th>
                <th className="px-6 py-3 border-b font-bold">Địa điểm</th>
                <th className="px-6 py-3 border-b font-bold">Dự kiến (đv máu)</th>
                <th className="px-6 py-3 border-b font-bold">Máu đã nhận</th>
                <th className="px-6 py-3 border-b font-bold">Trạng thái</th>
                <th className="px-6 py-3 border-b font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.eventId}>
                  <td className="px-6 py-3 border-b text-center">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.eventId)}
                      onChange={() => toggleEventSelection(event.eventId)}
                    />
                  </td>
                  <td className="px-6 py-3 border-b font-medium text-gray-700">{event.nameOfEvent}</td>
                  <td className="px-6 py-3 border-b text-gray-700">{
                    event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Chưa xác định'
                  } - {
                    event.endDate ? new Date(event.endDate).toLocaleDateString() : 'Chưa xác định'
                  }</td>
                  <td className="px-6 py-3 border-b text-gray-700">{event.location}</td>
                  <td className="px-6 py-3 border-b text-center text-gray-700">{event.expectedBloodVolume}</td>
                  <td className="px-6 py-3 border-b text-center text-gray-700">{event.actualVolume}</td>
                  <td className="px-6 py-3 border-b">
                    {event.status === 'Sắp diễn ra' && (
                      <span className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">{event.status}</span>
                    )}
                    {event.status === 'Đang diễn ra' && (
                      <span className="px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">{event.status}</span>
                    )}
                    {event.status === 'Đã kết thúc' && (
                      <span className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 text-sm font-medium">{event.status}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 border-b text-center flex gap-3 justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-lg" onClick={() => handleEdit(event)}>
                      <FaRegEdit className="w-5 h-5" /> Sửa
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => handleDelete(event.eventId)}>
                      <FaTrashAlt className="w-5 h-5" /> Xóa
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
