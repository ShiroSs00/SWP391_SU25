import React from 'react';
import { Calendar, User, MessageSquare, Tag, MoreVertical, Trash2, Edit3 } from 'lucide-react';
import { FeedbackCategory, FeedbackStatus } from '../types/feedback.types';
import type { Feedback } from '../types/feedback.types';
import   RatingStars  from './RatingStars';

interface FeedbackCardProps {
  feedback: Feedback;
  onEdit?: (feedback: Feedback) => void;
  onDelete?: (feedback: Feedback) => void;
  showActions?: boolean;
}

const categoryLabels: Record<FeedbackCategory, string> = {
  [FeedbackCategory.STAFF_SERVICE]: 'Dịch vụ nhân viên',
  [FeedbackCategory.FACILITY_CLEANLINESS]: 'Vệ sinh cơ sở',
  [FeedbackCategory.DONATION_PROCESS]: 'Quy trình hiến máu',
  [FeedbackCategory.WAITING_TIME]: 'Thời gian chờ đợi',
  [FeedbackCategory.OVERALL_EXPERIENCE]: 'Trải nghiệm tổng thể',
  [FeedbackCategory.GENERAL_SUGGESTION]: 'Góp ý chung'
};

const categoryColors: Record<FeedbackCategory, string> = {
  [FeedbackCategory.STAFF_SERVICE]: 'bg-blue-100 text-blue-800',
  [FeedbackCategory.FACILITY_CLEANLINESS]: 'bg-green-100 text-green-800',
  [FeedbackCategory.DONATION_PROCESS]: 'bg-purple-100 text-purple-800',
  [FeedbackCategory.WAITING_TIME]: 'bg-yellow-100 text-yellow-800',
  [FeedbackCategory.OVERALL_EXPERIENCE]: 'bg-indigo-100 text-indigo-800',
  [FeedbackCategory.GENERAL_SUGGESTION]: 'bg-gray-100 text-gray-800'
};

const statusColors: Record<FeedbackStatus, string> = {
  [FeedbackStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [FeedbackStatus.REVIEWED]: 'bg-blue-100 text-blue-800',
  [FeedbackStatus.RESOLVED]: 'bg-green-100 text-green-800'
};

const statusLabels: Record<FeedbackStatus, string> = {
  [FeedbackStatus.PENDING]: 'Chờ xử lý',
  [FeedbackStatus.REVIEWED]: 'Đã xem',
  [FeedbackStatus.RESOLVED]: 'Đã giải quyết'
};

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {feedback.isAnonymous ? 'Người hiến máu ẩn danh' : feedback.donorInfo?.name || 'Người hiến máu'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(feedback.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(feedback);
                        setShowDropdown(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(feedback);
                        setShowDropdown(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-4">
        <RatingStars rating={feedback.rating} readonly size="sm" showText />
      </div>

      {/* Category */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[feedback.category]}`}>
          <Tag className="w-3 h-3 mr-1" />
          {categoryLabels[feedback.category]}
        </span>
      </div>

      {/* Comment */}
      {feedback.comment && (
        <div className="mb-4">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-sm leading-relaxed">{feedback.comment}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span>ID: {feedback.registrationId}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[feedback.status]}`}>
          {statusLabels[feedback.status]}
        </span>
      </div>
    </div>
  );
};
