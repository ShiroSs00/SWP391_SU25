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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý sự kiện</h2>
            <p className="text-gray-600 mt-1">Quản lý các sự kiện hiến máu của tổ chức</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button 
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={handleAdd}
            >
              <FaPlus className="w-4 h-4" /> Thêm sự kiện
            </button>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            <FaCalendarAlt className="w-4 h-4 text-gray-500" />
            <input 
              type="date" 
              name="start" 
              value={dateFilter.start} 
              onChange={handleDateFilterChange} 
              className="border-none outline-none bg-transparent text-sm text-gray-700"
              placeholder="mm/dd/yyyy"
            />
            <span className="mx-2 text-gray-400">đến</span>
            <input 
              type="date" 
              name="end" 
              value={dateFilter.end} 
              onChange={handleDateFilterChange} 
              className="border-none outline-none bg-transparent text-sm text-gray-700"
              placeholder="mm/dd/yyyy"
            />
            <button 
              type="button" 
              className="ml-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
              onClick={handleDateSearch}
            >
              Tìm kiếm
            </button>
          </div>
          
          {/* Delete Selected Button */}
          {selectedEvents.length > 0 && (
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={handleDeleteSelected}
            >
              <FaTrashAlt className="w-4 h-4" />
              Xóa các sự kiện đã chọn ({selectedEvents.length})
            </button>
          )}
        </div>
      </div>
      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {editId ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên sự kiện</label>
              <input 
                name="nameOfEvent" 
                value={form.nameOfEvent} 
                onChange={handleInputChange} 
                placeholder="Nhập tên sự kiện" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Địa điểm</label>
              <input 
                name="location" 
                value={form.location} 
                onChange={handleInputChange} 
                placeholder="Nhập địa điểm tổ chức" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngày bắt đầu</label>
              <input 
                name="startDate" 
                value={form.startDate} 
                onChange={handleInputChange} 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
              <input 
                name="endDate" 
                value={form.endDate} 
                onChange={handleInputChange} 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dự kiến (đơn vị máu)</label>
              <input 
                name="expectedBloodVolume" 
                value={form.expectedBloodVolume} 
                onChange={handleInputChange} 
                type="number" 
                min={0} 
                placeholder="Nhập số đơn vị máu dự kiến" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
              />
            </div>
            
            {editId && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Máu đã nhận (đơn vị)</label>
                <input 
                  name="actualVolume" 
                  value={form.actualVolume} 
                  onChange={handleInputChange} 
                  type="number" 
                  min={0} 
                  placeholder="Nhập số đơn vị máu thực tế" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <select 
                name="status" 
                value={form.status} 
                onChange={handleInputChange} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" 
                required
              >
                {EVENT_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-full flex gap-3 mt-6 justify-end">
              <button 
                type="button" 
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors" 
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                {editId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 bg-red-50 rounded-lg p-6 mx-6">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-red-800">{error}</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium text-gray-600">Chưa có sự kiện nào</p>
              <p className="text-gray-500 mt-2">Hãy thêm sự kiện đầu tiên của bạn</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedEvents.length === events.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents(events.map(event => event.eventId));
                        } else {
                          setSelectedEvents([]);
                        }
                      }}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên sự kiện
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dự kiến (đv máu)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Máu đã nhận
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr key={event.eventId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.eventId)}
                        onChange={() => toggleEventSelection(event.eventId)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.nameOfEvent}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{event.startDate ? new Date(event.startDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}</div>
                        <div className="text-xs text-gray-500">đến {event.endDate ? new Date(event.endDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{event.expectedBloodVolume}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{event.actualVolume}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        event.status === 'Sắp diễn ra' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'Đang diễn ra' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-500 transition-colors"
                          onClick={() => handleEdit(event)}
                        >
                          <FaRegEdit className="w-3 h-3 mr-1" /> Sửa
                        </button>
                        <button 
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 focus:ring-2 focus:ring-red-500 transition-colors"
                          onClick={() => handleDelete(event.eventId)}
                        >
                          <FaTrashAlt className="w-3 h-3 mr-1" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTable;
