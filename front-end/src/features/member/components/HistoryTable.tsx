import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Droplet, MessageSquare, Star, Clock, RefreshCw } from 'lucide-react';
import type { DonationRecord } from '../types/dashboard.type';

interface HistoryTableProps {
  records: DonationRecord[];
  type: 'donation' | 'receiving';
  onFeedback: (recordId: string) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ 
  records, 
  type, 
  onFeedback, 
  loading = false,
  onRefresh 
}) => {
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-500">Đang tải lịch sử...</p>
      </div>
    );
  }

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
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Làm mới
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onRefresh && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới</span>
          </button>
        </div>
      )}

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
                <span className="text-sm text-gray-500">#{record.registrationId || record.id}</span>
                {record.event && (
                  <span className="text-sm text-blue-600">Sự kiện: {record.event}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {record.date ? formatDate(record.date) : 'Không có thông tin ngày'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{record.location || 'Không có thông tin địa điểm'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Droplet className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-700">{record.volumeToTake}ml</span>
                </div>
              </div>

              {record.bloodCode && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs text-gray-500">Mã máu:</span>
                  <span className="text-sm font-medium text-gray-700">{record.bloodCode}</span>
                </div>
              )}

              {record.healthCheck && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Kiểm tra sức khỏe:</p>
                      <p className="text-sm text-green-700">{record.healthCheck}</p>
                    </div>
                  </div>
                </div>
              )}

              {record.afterDonationBlood && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Sau hiến máu:</p>
                      <p className="text-sm text-blue-700">{record.afterDonationBlood}</p>
                    </div>
                  </div>
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
                  onClick={() => onFeedback(record.registrationId || record.id)}
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