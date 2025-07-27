import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { FeedbackItem } from '../types/dashboard.type';

interface FeedbackPageProps {
  feedback: FeedbackItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({
  feedback,
  loading,
  error,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  const averageRating = feedback.length > 0 
    ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedback.filter(f => f.rating === rating).length,
    percentage: feedback.length > 0 ? (feedback.filter(f => f.rating === rating).length / feedback.length) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Phản hồi</h1>
          <p className="text-gray-600">Xem lại các phản hồi bạn đã gửi về trải nghiệm hiến máu</p>
        </div>
      </div>

      {/* Feedback Stats */}
      {feedback.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Đánh giá trung bình</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-yellow-600">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= averageRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-yellow-600 text-sm mt-1">
                  Từ {feedback.length} phản hồi
                </p>
              </div>
              <Star className="w-16 h-16 text-yellow-300" />
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố đánh giá</h3>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback List
      <div className="bg-white rounded-xl shadow-lg p-6">
        <FeedbackList feedbacks={feedback} />
      </div> */}

      {/* Feedback Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Mẹo viết phản hồi hiệu quả
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-blue-500 mt-0.5" />
            <span className="text-blue-700">Chia sẻ cảm nhận thật về trải nghiệm</span>
          </div>
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5" />
            <span className="text-blue-700">Đề xuất cải thiện dịch vụ nếu có</span>
          </div>
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-blue-500 mt-0.5" />
            <span className="text-blue-700">Ghi nhận điểm tích cực của nhân viên</span>
          </div>
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-500 mt-0.5" />
            <span className="text-blue-700">Phản hồi giúp cải thiện chất lượng dịch vụ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;