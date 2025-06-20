import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import RatingStars from './RatingStars';
import { FeedbackCategory, FeedbackForm as FeedbackFormType } from '../types/feedback.types';
import { cn } from '../../../utils/helpers';

interface FeedbackFormProps {
  onSubmit: (feedback: FeedbackFormType) => Promise<void>;
  donationId?: string;
  loading?: boolean;
}

const categoryOptions: { value: FeedbackCategory; label: string }[] = [
  { value: 'overall_experience', label: 'Trải nghiệm tổng thể' },
  { value: 'service_quality', label: 'Chất lượng dịch vụ' },
  { value: 'staff_behavior', label: 'Thái độ nhân viên' },
  { value: 'facility_cleanliness', label: 'Vệ sinh cơ sở' },
  { value: 'waiting_time', label: 'Thời gian chờ đợi' },
  { value: 'suggestion', label: 'Góp ý' },
  { value: 'complaint', label: 'Khiếu nại' }
];

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  donationId,
  loading = false
}) => {
  const [formData, setFormData] = useState<FeedbackFormType>({
    rating: 0,
    category: 'overall_experience',
    title: '',
    message: '',
    isAnonymous: false,
    donationId
  });

  const [errors, setErrors] = useState<Partial<FeedbackFormType>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackFormType> = {};

    if (formData.rating === 0) {
      newErrors.rating = 0;
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung phản hồi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        rating: 0,
        category: 'overall_experience',
        title: '',
        message: '',
        isAnonymous: false,
        donationId
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Gửi phản hồi của bạn
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá tổng thể *
          </label>
          <RatingStars
            rating={formData.rating}
            onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
            size="lg"
            showLabel
          />
          {errors.rating !== undefined && (
            <p className="text-red-500 text-sm mt-1">Vui lòng chọn đánh giá</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              category: e.target.value as FeedbackCategory 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={cn(
              "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
              errors.title ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Nhập tiêu đề phản hồi"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung phản hồi *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={4}
            className={cn(
              "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none",
              errors.message ? "border-red-500" : "border-gray-300"
            )}
            placeholder="Chia sẻ trải nghiệm của bạn..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        {/* Anonymous option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.isAnonymous}
            onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
            Gửi phản hồi ẩn danh
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md font-medium transition-colors duration-200",
            loading 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          )}
        >
          <Send className="w-4 h-4" />
          {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;