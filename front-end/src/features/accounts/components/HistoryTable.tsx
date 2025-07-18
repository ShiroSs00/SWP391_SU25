import React, { useState } from 'react';
import { Calendar, MapPin, Droplet, MessageSquare, Star, Clock } from 'lucide-react';
import type { DonationRecord } from '../types/dashboard.type';

interface HistoryTableProps {
  records: DonationRecord[];
  type: 'donation' | 'receiving';
  onFeedback: (recordId: string) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ records, type, onFeedback }) => {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'Hoàn thành';
      case 'Approved':
        return 'Đã duyệt';
      case 'Pending':
        return 'Đang chờ';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Rejected':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          {type === 'donation' ? 'Chưa có lịch sử hiến máu' : 'Chưa có lịch sử nhận máu'}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          {type === 'donation' 
            ? 'Hãy tham gia các sự kiện hiến máu để tạo lịch sử' 
            : 'Lịch sử nhận máu sẽ được cập nhật khi có'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                  {getStatusText(record.status)}
                </span>
                <span className="text-sm text-gray-500">#{record.registrationId}</span>
                {record.eventId && (
                  <span className="text-sm text-blue-600">Sự kiện: {record.eventId}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {formatDate(record.date)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{record.location}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Droplet className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-700">{record.volume}ml</span>
                </div>
              </div>

              {record.dateCreated && record.dateCreated !== record.date && (
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Đăng ký: {formatDate(record.dateCreated)}
                  </span>
                </div>
              )}

              {record.feedback && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <Star className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-sm text-blue-800">{record.feedback}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              {(record.status === 'Completed' || record.status === 'Approved') && (
                <button
                  onClick={() => onFeedback(record.registrationId)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{record.feedback ? 'Sửa phản hồi' : 'Phản hồi'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryTable;