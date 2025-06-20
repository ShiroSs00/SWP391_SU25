import React from 'react';
import { MessageSquare, Calendar, User, Shield } from 'lucide-react';
import RatingStars from './RatingStars';
import { Feedback } from '../types/feedback.types';
import { formatDateTime } from '../../../utils/helpers';

interface FeedbackCardProps {
  feedback: Feedback;
  showResponse?: boolean;
}

const categoryLabels = {
  overall_experience: 'Trải nghiệm tổng thể',
  service_quality: 'Chất lượng dịch vụ',
  staff_behavior: 'Thái độ nhân viên',
  facility_cleanliness: 'Vệ sinh cơ sở',
  waiting_time: 'Thời gian chờ đợi',
  suggestion: 'Góp ý',
  complaint: 'Khiếu nại'
};

const statusLabels = {
  pending: 'Chờ xử lý',
  reviewed: 'Đã xem',
  responded: 'Đã phản hồi',
  resolved: 'Đã giải quyết'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  responded: 'bg-green-100 text-green-800',
  resolved: 'bg-gray-100 text-gray-800'
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  showResponse = true
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{feedback.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {categoryLabels[feedback.category]}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[feedback.status]}`}>
                {statusLabels[feedback.status]}
              </span>
            </div>
          </div>
        </div>
        <RatingStars rating={feedback.rating} readonly size="sm" />
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
      </div>

      {/* Response */}
      {showResponse && feedback.response && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Phản hồi từ bệnh viện</span>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">{feedback.response}</p>
          {feedback.respondedAt && (
            <p className="text-blue-600 text-xs mt-2">
              Phản hồi lúc: {formatDateTime(feedback.respondedAt)}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {feedback.isAnonymous ? (
              <>
                <Shield className="w-4 h-4" />
                <span>Ẩn danh</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Người dùng đã xác thực</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDateTime(feedback.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;