import React, { useEffect, useState } from 'react';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../hooks/useEvents';
import type { AdminEvent } from '../types/admin.types';

const initialForm: Omit<AdminEvent, 'eventId' | 'creationDate'> = {
  nameOfEvent: '',
  startDate: '',
  endDate: '',
  expectedBloodVolume: 0,
  actualVolume: 0,
  location: '',
  status: '',
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

const EventTable: React.FC = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch {
      setError('Không thể tải danh sách sự kiện');
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
      await deleteEvent(id);
      fetchEvents();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateEvent(editId, form);
    } else {
      await createEvent({ ...form, accountId: getAccountId() });
    }
    setShowForm(false);
    fetchEvents();
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-[#b71c1c]">Danh sách sự kiện</h2>
      <button className="mb-4 px-4 py-2 bg-[#e53935] text-white rounded hover:bg-[#b71c1c]" onClick={handleAdd}>
        Thêm sự kiện
      </button>
      {showForm && (
        <form className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input name="nameOfEvent" value={form.nameOfEvent} onChange={handleInputChange} placeholder="Tên sự kiện" className="border p-2 rounded" required />
          <input name="location" value={form.location} onChange={handleInputChange} placeholder="Địa điểm" className="border p-2 rounded" required />
          <input name="startDate" value={form.startDate} onChange={handleInputChange} type="date" className="border p-2 rounded" required />
          <input name="endDate" value={form.endDate} onChange={handleInputChange} type="date" className="border p-2 rounded" required />
          <input name="expectedBloodVolume" value={form.expectedBloodVolume} onChange={handleInputChange} type="number" min={0} placeholder="Dự kiến (đv máu)" className="border p-2 rounded" required />
          <input name="actualVolume" value={form.actualVolume} onChange={handleInputChange} type="number" min={0} placeholder="Đã nhận" className="border p-2 rounded" />
          <input name="status" value={form.status} onChange={handleInputChange} placeholder="Trạng thái" className="border p-2 rounded" required />
          <input name="accountId" value={form.accountId} readOnly className="border p-2 rounded bg-gray-100 text-gray-500" required />
          <div className="col-span-full flex gap-2 mt-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editId ? 'Cập nhật' : 'Tạo mới'}</button>
            <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </form>
      )}
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Tên sự kiện</th>
                <th className="px-3 py-2 border">Thời gian</th>
                <th className="px-3 py-2 border">Địa điểm</th>
                <th className="px-3 py-2 border">Dự kiến (đv máu)</th>
                <th className="px-3 py-2 border">Đã nhận</th>
                <th className="px-3 py-2 border">Trạng thái</th>
                <th className="px-3 py-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.eventId} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border font-semibold">{event.nameOfEvent}</td>
                  <td className="px-3 py-2 border">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 border">{event.location}</td>
                  <td className="px-3 py-2 border text-center">{event.expectedBloodVolume}</td>
                  <td className="px-3 py-2 border text-center">{event.actualVolume}</td>
                  <td className="px-3 py-2 border">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 border text-center">
                    <button className="px-2 py-1 bg-yellow-400 text-white rounded mr-2 hover:bg-yellow-500" onClick={() => handleEdit(event)}>Sửa</button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(event.eventId)}>Xóa</button>
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
