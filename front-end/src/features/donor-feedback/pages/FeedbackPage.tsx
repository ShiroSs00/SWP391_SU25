import React, { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp, Users, Clock } from 'lucide-react';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackCard from '../components/FeedbackCard';
import { useFeedback } from '../hooks/useFeedback';
import { FeedbackForm as FeedbackFormType } from '../types/feedback.types';

const FeedbackPage: React.FC = () => {
  const { feedbacks, stats, loading, error, submitFeedback, fetchFeedbacks, fetchStats } = useFeedback();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, []);

  const handleSubmitFeedback = async (feedback: FeedbackFormType) => {
    await submitFeedback(feedback);
    setShowForm(false);
    // Refresh data
    fetchFeedbacks();
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Phản hồi từ người hiến máu
          </h1>
          <p className="text-gray-600">
            Chia sẻ trải nghiệm và góp ý để chúng tôi cải thiện dịch vụ
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng phản hồi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFeedbacks}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}/5
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tỷ lệ phản hồi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Người tham gia</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-1">
            {showForm ? (
              <FeedbackForm
                onSubmit={handleSubmitFeedback}
                loading={loading}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chia sẻ trải nghiệm của bạn
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Phản hồi của bạn giúp chúng tôi cải thiện chất lượng dịch vụ hiến máu
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Gửi phản hồi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feedback List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Phản hồi gần đây
                </h2>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="highest_rating">Đánh giá cao nhất</option>
                  <option value="lowest_rating">Đánh giá thấp nhất</option>
                </select>
              </div>

              {loading && feedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải phản hồi...</p>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Chưa có phản hồi nào</p>
                </div>
              ) : (
                feedbacks.map(feedback => (
                  <FeedbackCard key={feedback.id} feedback={feedback} />
                ))
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;