import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import type { DonorFeedback, UpdateFeedbackRequest } from '../types/feedback.types';
import { validateStaffReply, type ValidationError } from '../utils/validation';
import RatingStars from './RatingStars';
import { formatDateTime } from '../utils/formatters';

interface ReplyModalProps {
  feedback: DonorFeedback;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedbackId: string, data: UpdateFeedbackRequest) => Promise<void>;
  loading?: boolean;
}

const ReplyModal: React.FC<ReplyModalProps> = ({
  feedback,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [reply, setReply] = useState(feedback.staffReply || '');
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateStaffReply(reply);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    try {
      await onSubmit(feedback.feedbackId, { staffReply: reply });
      onClose();
    } catch (error) {
      // Error handled by parent component
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const averageRating = (
    feedback.process +
    feedback.bloodTest +
    feedback.postDonationCare +
    feedback.comfortable +
    feedback.overallSatisfaction
  ) / 5;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Phản hồi feedback
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Feedback Summary */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin người hiến</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Tên:</span>
                    <span className="ml-2 font-medium">{feedback.donorName || 'Không có'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{feedback.donorEmail || 'Không có'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mã đăng ký:</span>
                    <span className="ml-2 font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                      {feedback.registrationId}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="ml-2">{formatDateTime(feedback.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Đánh giá tổng quan</h3>
                <div className="flex items-center gap-3 mb-3">
                  <RatingStars rating={averageRating} readonly />
                  <span className="font-medium text-gray-700">
                    {averageRating.toFixed(1)}/5
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quy trình:</span>
                    <div className="flex items-center gap-1">
                      <RatingStars rating={feedback.process} readonly size="sm" />
                      <span className="text-xs">{feedback.process}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Xét nghiệm:</span>
                    <div className="flex items-center gap-1">
                      <RatingStars rating={feedback.bloodTest} readonly size="sm" />
                      <span className="text-xs">{feedback.bloodTest}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chăm sóc:</span>
                    <div className="flex items-center gap-1">
                      <RatingStars rating={feedback.postDonationCare} readonly size="sm" />
                      <span className="text-xs">{feedback.postDonationCare}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thoải mái:</span>
                    <div className="flex items-center gap-1">
                      <RatingStars rating={feedback.comfortable} readonly size="sm" />
                      <span className="text-xs">{feedback.comfortable}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng thể:</span>
                    <div className="flex items-center gap-1">
                      <RatingStars rating={feedback.overallSatisfaction} readonly size="sm" />
                      <span className="text-xs">{feedback.overallSatisfaction}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Original Feedback */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Nội dung feedback</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {feedback.description}
              </p>
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label htmlFor="staffReply" className="block text-sm font-medium text-gray-900 mb-2">
                Phản hồi của nhân viên
              </label>
              <textarea
                id="staffReply"
                rows={6}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Nhập phản hồi cho người hiến máu..."
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none
                  ${getFieldError('staffReply') ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {getFieldError('staffReply') && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{getFieldError('staffReply')}</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {reply.length}/500
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="
                  flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg 
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                "
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gửi phản hồi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;