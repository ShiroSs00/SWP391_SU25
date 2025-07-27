import React from 'react';
import { Calendar, MapPin, User, Clock, Users, Info } from 'lucide-react';
import type { EventParticipation } from '../types/dashboard.type';

interface EventCardProps {
  event: EventParticipation;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Đã hoàn thành';
      case 'Upcoming':
        return 'Sắp diễn ra';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'Donor' 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getRoleText = (role: string) => {
    return role === 'Donor' ? 'Người hiến' : 'Tình nguyện viên';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const getDaysUntilEvent = () => {
    try {
      const eventDate = new Date(event.date);
      const today = new Date();
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const daysUntil = getDaysUntilEvent();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Event Banner */}
      <div className="relative h-48 bg-gradient-to-r from-red-500 to-pink-500">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.eventName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
            {getStatusText(event.status)}
          </span>
        </div>

        {/* Role Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(event.role)}`}>
            {getRoleText(event.role)}
          </span>
        </div>

        {/* Event ID */}
        {event.eventId && (
          <div className="absolute bottom-4 left-4">
            <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
              #{event.eventId}
            </span>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{event.eventName}</h3>
        
        {/* Event Description */}
        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        )}
        
        <div className="space-y-3">
          {/* Date and Time */}
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <span className="text-gray-700 font-medium block">
                {formatDate(event.date)}
              </span>
              <span className="text-gray-500 text-sm">
                {formatTime(event.date)}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{event.location}</span>
          </div>

          {/* Role */}
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Vai trò: {getRoleText(event.role)}</span>
          </div>

          {/* Event Duration */}
          {event.startDate && event.endDate && (
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 text-sm">
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </span>
            </div>
          )}

          {/* Countdown for Upcoming Events */}
          {event.status === 'Upcoming' && daysUntil > 0 && (
            <div className="flex items-center space-x-3 text-blue-600 bg-blue-50 p-3 rounded-lg">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                {daysUntil === 1 ? 'Ngày mai' : `${daysUntil} ngày nữa`}
              </span>
            </div>
          )}

          {/* Past Event Indicator */}
          {event.status === 'Completed' && (
            <div className="flex items-center space-x-3 text-green-600 bg-green-50 p-3 rounded-lg">
              <Users className="w-5 h-5" />
              <span className="font-medium">Đã tham gia thành công</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {event.status === 'Upcoming' ? (
            <button className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2">
              <Info className="w-4 h-4" />
              <span>Xem chi tiết sự kiện</span>
            </button>
          ) : event.status === 'Completed' ? (
            <button className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Xem kết quả tham gia</span>
            </button>
          ) : (
            <button className="w-full py-3 px-4 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium">
              Sự kiện đã hủy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;