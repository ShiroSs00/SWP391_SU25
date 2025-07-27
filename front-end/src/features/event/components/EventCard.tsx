import React from 'react';
import { Calendar, MapPin, Droplets, Clock, Users, Star, TrendingUp } from 'lucide-react';
import type { AdminEvent } from '../types/admin.types';

interface EventCardProps {
  event: AdminEvent;
  onRegister?: (eventId: string, eventStatus: string) => void;
}

/**
 * COMPONENT EVENTCARD - HIỂN THỊ THÔNG TIN CHI TIẾT MỘT SỰ KIỆN
 * 
 * Chức năng:
 * - Hiển thị thông tin cơ bản: tên, địa điểm, thời gian, mục tiêu máu
 * - Highlight đặc biệt cho sự kiện đang diễn ra
 * - Phân biệt màu sắc theo trạng thái
 * - Responsive design cho mọi thiết bị
 * - Hình ảnh minh họa động
 * 
 * Props:
 * - event: AdminEvent - Thông tin sự kiện cần hiển thị
 */
const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  /**
   * HÀM FORMAT NGÀY THÁNG
   * Chuyển đổi ISO date string thành định dạng dd/mm/yyyy
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  /**
   * HÀM FORMAT THỜI GIAN
   * Chuyển đổi ISO date string thành định dạng giờ:phút
   */
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * HÀM XÁC ĐỊNH MÀU SẮC THEO TRẠNG THÁI
   * Trả về class CSS tương ứng với từng trạng thái
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sắp diễn ra':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Đang diễn ra':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Đã kết thúc':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * HÀM LẤY HÌNH ẢNH MINH HỌA THEO LOẠI SỰ KIỆN
   */
  const getEventImage = (eventName: string, location: string) => {
    if (eventName.toLowerCase().includes('đại học') || location.toLowerCase().includes('đại học')) {
      return 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    if (eventName.toLowerCase().includes('bệnh viện') || location.toLowerCase().includes('bệnh viện')) {
      return 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    if (eventName.toLowerCase().includes('công ty') || location.toLowerCase().includes('công ty')) {
      return 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    if (eventName.toLowerCase().includes('trường') || location.toLowerCase().includes('trường')) {
      return 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    // Default blood donation image
    return 'https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  /**
   * HÀM TÍNH TIẾN ĐỘ HIẾN MÁU
   */
  const getProgress = () => {
    if (!event.expectedBloodVolume || event.expectedBloodVolume === 0) return 0;
    return Math.min((event.actualVolume || 0) / event.expectedBloodVolume * 100, 100);
  };

  const isOngoing = event.status === 'ONGOING';
  const isUpcoming = event.status === 'UPCOMING';
  const isCompleted = event.status === 'COMPLETED';
  const progress = getProgress();

  return (
    <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 transform hover:-translate-y-2 ${
      isOngoing ? 'border-green-300 ring-4 ring-green-100' : 
      isUpcoming ? 'border-blue-200' : 
      'border-gray-100'
    }`}>
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getEventImage(event.nameOfEvent, event.location)}
          alt={event.nameOfEvent}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${
            isOngoing ? 'bg-green-500/90 text-white border-green-400' :
            isUpcoming ? 'bg-blue-500/90 text-white border-blue-400' :
            'bg-gray-500/90 text-white border-gray-400'
          }`}>
            {event.status}
          </span>
        </div>

        {/* Live Indicator for Ongoing Events */}
        {isOngoing && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs font-bold">LIVE</span>
          </div>
        )}

        {/* Event Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
            {event.nameOfEvent}
          </h3>
        </div>
      </div>
      
      <div className="p-6">
        {/* Location & Time */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{event.location}</span>
          </div>

          <div className="flex items-start gap-3 text-gray-600">
            <Calendar className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </div>
              {event.startDate && (
                <div className="text-gray-500 text-xs mt-1">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </div>
              )}
            </div>
          </div>

          {event.expectedBloodVolume && (
            <div className="flex items-center gap-3 text-gray-600">
              <Droplets className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">Mục tiêu: {event.expectedBloodVolume} đơn vị</span>
                  <span className="text-gray-500">{Math.round(progress)}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      progress >= 100 ? 'bg-green-500' : 
                      progress >= 75 ? 'bg-blue-500' : 
                      progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {(event.actualVolume ?? 0) > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Đã nhận: {event.actualVolume ?? 0} đơn vị
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Special Highlights */}
        {isOngoing && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-green-800">Đang diễn ra ngay bây giờ!</div>
                <div className="text-green-600 text-sm">Hãy tham gia để cứu sống những người cần giúp đỡ</div>
              </div>
            </div>
          </div>
        )}

        {isUpcoming && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-blue-800">Sự kiện sắp diễn ra</div>
                <div className="text-blue-600 text-sm">Đăng ký tham gia để không bỏ lỡ cơ hội</div>
              </div>
            </div>
          </div>
        )}

        {isCompleted && progress >= 100 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-green-800">Hoàn thành xuất sắc!</div>
                <div className="text-green-600 text-sm">Đã đạt được mục tiêu hiến máu</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100">
          {isOngoing ? (
            <button 
              onClick={() => onRegister?.(event.eventId, event.status)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🩸 Tham gia ngay
            </button>
          ) : isUpcoming ? (
            <button 
              onClick={() => onRegister?.(event.eventId, event.status)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              📅 Đăng ký tham gia
            </button>
          ) : (
            <button 
              disabled
              className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-4 rounded-xl font-semibold cursor-not-allowed opacity-75"
            >
              ✅ Đã kết thúc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;