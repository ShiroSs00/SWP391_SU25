import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Edit, Trash2, Plus } from 'lucide-react';
import api from '../../api/api';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  capacity: number;
  registeredCount?: number;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/event/getall');
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Không thể tải danh sách sự kiện');
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        await api.delete(`/event/${eventId}`);
        setEvents(events.filter(event => event.id !== eventId));
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Không thể xóa sự kiện');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sự kiện hiến máu</h1>
        <Link
          to="/admin/events/create"
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus size={20} />
          Tạo sự kiện mới
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  event.status === 'active' ? 'bg-green-100 text-green-800' : 
                  event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status === 'active' ? 'Đang diễn ra' : 
                   event.status === 'pending' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-2" />
                  <span>{new Date(event.startDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-2" />
                  <span>{new Date(event.endDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-2" />
                  <span>{event.registeredCount || 0}/{event.capacity} người đăng ký</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Link
                  to={`/admin/events/edit/${event.id}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          Chưa có sự kiện nào được tạo
        </div>
      )}
    </div>
  );
};

export default EventsPage;