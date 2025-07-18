import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, Droplets, Star, TrendingUp } from 'lucide-react';
import EventCard from './EventCard';
import LoadingSpinner from '../../accounts/components/LoadingSpinner'
import EmptyState from '../components/EmptyState';
import { getAllEvents } from '../hooks/useEvents';
import type { AdminEvent } from '../types/admin.types';


const EventsList: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, searchTerm, statusFilter, locationFilter, dateFilter, sortBy]);


  /**
   * HÀM TÍCH HỢP API THẬT - LẤY TẤT CẢ SỰ KIỆN
   * API Endpoint: GET /api/event/getall
   * Mô tả: Lấy danh sách tất cả sự kiện từ server
   * Response: AdminEvent[]
   * 
   * Validation:
   * - Kiểm tra response có phải là array không
   * - Validate từng event có đủ field bắt buộc
   * - Handle các trường hợp lỗi network, server
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await getAllEvents();
      
      // VALIDATION: Kiểm tra response
      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu trả về không đúng định dạng');
      }
      
      // VALIDATION: Kiểm tra từng event
      const validatedEvents = data.filter(event => {
        return (
          event &&
          typeof event.eventId === 'string' &&
          typeof event.nameOfEvent === 'string' &&
          typeof event.location === 'string' &&
          typeof event.status === 'string' &&
          event.nameOfEvent.trim() !== '' &&
          event.location.trim() !== ''
        );
      });
      
      if (validatedEvents.length === 0 && data.length > 0) {
        throw new Error('Không có sự kiện hợp lệ');
      }
      
      setEvents(validatedEvents);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      
      // HANDLE DIFFERENT ERROR TYPES
      if (err.response?.status === 404) {
        setError('Không tìm thấy dữ liệu sự kiện');
      } else if (err.response?.status === 500) {
        setError('Lỗi server. Vui lòng thử lại sau');
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Lỗi kết nối mạng. Kiểm tra internet của bạn');
      } else {
        setError(err.message || 'Không thể tải danh sách sự kiện. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * HÀM LỌC VÀ SẮP XẾP SỰ KIỆN NÂNG CAO
   * Chức năng:
   * - Lọc theo từ khóa tìm kiếm (tên sự kiện, địa điểm)
   * - Lọc theo trạng thái sự kiện
   * - Lọc theo địa điểm cụ thể
   * - Lọc theo khoảng thời gian
   * - Sắp xếp theo nhiều tiêu chí
   */
  const filterAndSortEvents = () => {
    let filtered = events;

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.nameOfEvent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Lọc theo địa điểm
    if (locationFilter) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Lọc theo thời gian
    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date(dateFilter);
      
      filtered = filtered.filter(event => {
        const eventStart = new Date(event.startDate || '');
        const eventEnd = new Date(event.endDate || '');
        return eventStart <= filterDate && eventEnd >= filterDate;
      });
    }

    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime();
        case 'name':
          return a.nameOfEvent.localeCompare(b.nameOfEvent);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'volume':
          return (b.expectedBloodVolume || 0) - (a.expectedBloodVolume || 0);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  /**
   * HÀM LẤY DANH SÁCH ĐỊA ĐIỂM DUY NHẤT
   * Sử dụng cho dropdown filter địa điểm
   */
  const getUniqueLocations = () => {
    const locations = events.map(event => event.location);
    return [...new Set(locations)];
  };

  /**
   * HÀM TÍNH THỐNG KÊ
   */
  const getStatistics = () => {
    const total = events.length;
    const ongoing = events.filter(e => e.status === 'ONGOING').length;
    const upcoming = events.filter(e => e.status === 'Sắp diễn ra').length;
    const totalBloodGoal = events.reduce((sum, e) => sum + (e.expectedBloodVolume || 0), 0);
    
    return { total, ongoing, upcoming, totalBloodGoal };
  };

  const stats = getStatistics();

  // PHÂN LOẠI SỰ KIỆN THEO TRẠNG THÁI
  const ongoingEvents = filteredEvents.filter(event => event.status === 'ONGOING');
  const upcomingEvents = filteredEvents.filter(event => event.status === 'UPCOMING');
  const completedEvents = filteredEvents.filter(event => event.status === 'COMPLETED');

  /**
   * HÀM XỬ LÝ NAVIGATION ĐẾN FORM ĐĂNG KÝ
   * Chuyển hướng người dùng đến trang đăng ký với eventId được chọn
   */
  const handleEventRegistration = (eventId: string, eventStatus: string) => {
    // VALIDATION: Chỉ cho phép đăng ký sự kiện đang diễn ra hoặc sắp diễn ra
    if (eventStatus === 'Đã kết thúc') {
      alert('Sự kiện này đã kết thúc, không thể đăng ký');
      return;
    }
    
    // VALIDATION: Kiểm tra eventId hợp lệ
    if (!eventId || eventId.trim() === '') {
      alert('Có lỗi xảy ra. Vui lòng thử lại');
      return;
    }
    
    // Navigate to registration page with eventId
    navigate(`/donation`);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Đang tải danh sách sự kiện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-red-500 text-lg font-medium mb-2">Có lỗi xảy ra</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchEvents}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Thử lại
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Hero Header với hình ảnh nền */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Droplets className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Sự kiện hiến máu
              <span className="block text-3xl font-normal text-red-100 mt-2">
                Cứu sống - Chia sẻ - Yêu thương
              </span>
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Tham gia các sự kiện hiến máu để mang lại hy vọng và sự sống cho những người cần được giúp đỡ. 
              Mỗi giọt máu của bạn là một món quà vô giá.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-red-100 text-sm">Tổng sự kiện</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.ongoing}</div>
              <div className="text-red-100 text-sm">Đang diễn ra</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.upcoming}</div>
              <div className="text-red-100 text-sm">Sắp diễn ra</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalBloodGoal}</div>
              <div className="text-red-100 text-sm">Đơn vị máu mục tiêu</div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-current text-gray-50">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Filter className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full"></div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-all"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ONGOING">🟢 Đang diễn ra</option>
                <option value="UPCOMING">🔵 Sắp diễn ra</option>
                <option value="COMPLETED">⚫ Đã kết thúc</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-all"
              >
                <option value="">Tất cả địa điểm</option>
                {getUniqueLocations().map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-all"
              >
                <option value="date">Sắp xếp theo ngày</option>
                <option value="name">Sắp xếp theo tên</option>
                <option value="location">Sắp xếp theo địa điểm</option>
                <option value="volume">Sắp xếp theo mục tiêu máu</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => {
                setStatusFilter('ONGOING');
                setSearchTerm('');
                setLocationFilter('');
                setDateFilter('');
              }}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
            >
              🟢 Đang diễn ra
            </button>
            <button
              onClick={() => {
                setStatusFilter('UPCOMING');
                setSearchTerm('');
                setLocationFilter('');
                setDateFilter('');
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              🔵 Sắp diễn ra
            </button>
            <button
              onClick={() => {
                setSearchTerm('Đại học');
                setStatusFilter('all');
                setLocationFilter('');
                setDateFilter('');
              }}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              🎓 Tại trường học
            </button>
            <button
              onClick={() => {
                setSearchTerm('Bệnh viện');
                setStatusFilter('all');
                setLocationFilter('');
                setDateFilter('');
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
            >
              🏥 Tại bệnh viện
            </button>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setLocationFilter('');
                setDateFilter('');
                setSortBy('date');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              🔄 Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-red-600">{filteredEvents.length}</span> sự kiện
              {searchTerm && (
                <span> cho từ khóa "<span className="font-medium">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
        </div>

        {/* Events Sections */}
        {filteredEvents.length === 0 ? (
          <EmptyState
            title="Không tìm thấy sự kiện"
            description="Không có sự kiện nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh bộ lọc hoặc quay lại sau."
          />
        ) : (
          <div className="space-y-12">
            {/* Ongoing Events */}
            {ongoingEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      ONGOING
                    </h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {ongoingEvents.length} sự kiện
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ongoingEvents.map(event => (
                    <EventCard 
                      key={event.eventId} 
                      event={event} 
                      onRegister={handleEventRegistration}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <h2 className="text-3xl font-bold text-gray-900">
                     UPCOMING
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {upcomingEvents.length} sự kiện
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map(event => (
                    <EventCard 
                      key={event.eventId} 
                      event={event} 
                      onRegister={handleEventRegistration}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      COMPLETED
                    </h2>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {completedEvents.length} sự kiện
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {completedEvents.map(event => (
                    <EventCard 
                      key={event.eventId} 
                      event={event} 
                      onRegister={handleEventRegistration}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <Droplets className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">Bạn muốn tổ chức sự kiện hiến máu?</h3>
            <p className="text-red-100 mb-6">
              Liên hệ với chúng tôi để được hỗ trợ tổ chức sự kiện hiến máu tại địa phương của bạn.
            </p>
            <button className="px-8 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
              Liên hệ ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;