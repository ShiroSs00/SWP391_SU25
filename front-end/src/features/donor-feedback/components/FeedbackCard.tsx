import React from 'react';
import { Calendar, User, MessageSquare, Reply, Trash2, AlertCircle } from 'lucide-react';
import RatingStars from './RatingStars';
import type { DonorFeedback } from '../types/feedback.types';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';

interface FeedbackCardProps {
  feedback: DonorFeedback;
  onReply?: (feedback: DonorFeedback) => void;
  onDelete?: (feedbackId: string) => void;
  showActions?: boolean;
  selected?: boolean;
  onSelect?: (feedbackId: string, selected: boolean) => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  onReply,
  onDelete,
  showActions = true,
  selected = false,
  onSelect,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ phản hồi';
      case 'replied':
        return 'Đã phản hồi';
      case 'resolved':
        return 'Đã giải quyết';
      default:
        return 'Không xác định';
    }
  };

  const averageRating = (
    feedback.process +
    feedback.bloodTest +
    feedback.postDonationCare +
    feedback.comfortable +
    feedback.overallSatisfaction
  ) / 5;

  const ratingCategories = [
    { label: 'Quy trình', value: feedback.process },
    { label: 'Xét nghiệm', value: feedback.bloodTest },
    { label: 'Chăm sóc', value: feedback.postDonationCare },
    { label: 'Thoải mái', value: feedback.comfortable },
    { label: 'Tổng thể', value: feedback.overallSatisfaction },
  ];

  return (
    <div className={`
      bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden
      ${selected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
    `}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {showActions && onSelect && (
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onSelect(feedback.feedbackId, e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">
                    {feedback.donorName || 'Người hiến máu'}
                  </span>
                </div>
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full border
                  ${getStatusColor(feedback.status)}
                `}>
                  {getStatusText(feedback.status)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(feedback.createdAt)}</span>
                </div>
                <span>•</span>
                <span>{formatRelativeTime(feedback.createdAt)}</span>
                <span>•</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {feedback.registrationId}
                </span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-2">
              {onReply && (
                <button
                  onClick={() => onReply(feedback)}
                  className="
                    flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 
                    hover:bg-blue-50 rounded-lg transition-colors duration-200
                  "
                >
                  <Reply className="w-4 h-4" />
                  Phản hồi
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(feedback.feedbackId)}
                  className="
                    flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 
                    hover:bg-red-50 rounded-lg transition-colors duration-200
                  "
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <RatingStars rating={feedback.rating} readonly size="sm" showText />
      </div>

      {/* Description */}
      <div className="p-6">
        <div className="flex items-start gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <h4 className="font-semibold text-gray-900">Mô tả chi tiết</h4>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {feedback.description}
        </p>
      </div>

      {/* Staff Reply */}
      {feedback.staffReply && (
        <div className="p-6 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start gap-2 mb-3">
            <Reply className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <h4 className="font-semibold text-blue-900">Phản hồi từ nhân viên</h4>
          </div>
          <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">
            {feedback.staffReply}
          </p>
          {feedback.updatedAt && (
            <div className="mt-3 text-xs text-blue-600">
              Phản hồi lúc: {formatDateTime(feedback.updatedAt)}
            </div>
          )}
        </div>
      )}

      {/* Warning for pending feedback */}
      {feedback.status === 'pending' && showActions && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-100">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              Feedback này đang chờ phản hồi từ nhân viên
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;