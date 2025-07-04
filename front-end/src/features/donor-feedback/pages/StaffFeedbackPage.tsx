import React, { useEffect, useState } from 'react';
import { BarChart3, MessageSquare, Star, TrendingUp, Calendar, Activity, Clock } from 'lucide-react';
import FeedbackList from '../components/FeedbackList';
import { useFeedback, useFeedbackStats } from '../hooks/useFeedback';
import type { FeedbackFilters, UpdateFeedbackRequest } from '../types/feedback.types';
import { formatNumber } from '../utils/formatters';

const StaffFeedbackPage: React.FC = () => {
  const {
    feedbacks,
    loading,
    total,
    currentPage,
    totalPages,
    getAllFeedbacks,
    updateFeedback,
    deleteFeedback,
    deleteMultipleFeedbacks,
    error,
    setError,
  } = useFeedback();

  const { stats, loading: statsLoading, refetch: refetchStats } = useFeedbackStats();

  const [replyLoading, setReplyLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    getAllFeedbacks();
  }, [getAllFeedbacks]);

  const handleFiltersChange = async (filters: FeedbackFilters) => {
    try {
      await getAllFeedbacks(filters);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleReply = async (feedbackId: string, data: UpdateFeedbackRequest) => {
    try {
      setReplyLoading(true);
      setError(null);
      await updateFeedback(feedbackId, data);
      // Refresh stats after reply
      refetchStats();
    } catch (error) {
      console.error('Error replying to feedback:', error);
      throw error;
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    try {
      setDeleteLoading(true);
      setError(null);
      await deleteFeedback(feedbackId);
      // Refresh stats after delete
      refetchStats();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteMultiple = async (feedbackIds: string[]) => {
    try {
      setDeleteLoading(true);
      setError(null);
      await deleteMultipleFeedbacks(feedbackIds);
      // Refresh stats after delete
      refetchStats();
    } catch (error) {
      console.error('Error deleting multiple feedbacks:', error);
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
    trend?: { value: number; isPositive: boolean };
  }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    };

    const bgColorClasses = {
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      yellow: 'bg-yellow-50',
      red: 'bg-red-50',
      purple: 'bg-purple-50',
      indigo: 'bg-indigo-50',
    };

    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${bgColorClasses[color]} bg-opacity-30`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
                <span>{Math.abs(trend.value)}% so với tháng trước</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Feedback Hiến máu
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Xem, phản hồi và quản lý feedback từ người hiến máu
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">Có lỗi xảy ra</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 underline font-medium"
                >
                  Đóng thông báo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={MessageSquare}
            title="Tổng Feedback"
            value={statsLoading ? '...' : formatNumber(stats?.totalFeedbacks || 0)}
            subtitle="Tất cả feedback"
            color="blue"
          />
          <StatCard
            icon={Star}
            title="Đánh giá trung bình"
            value={statsLoading ? '...' : `${stats?.averageRating?.toFixed(1) || '0.0'}/5`}
            subtitle="Mức độ hài lòng"
            color="yellow"
          />
          <StatCard
            icon={Clock}
            title="Chờ phản hồi"
            value={statsLoading ? '...' : formatNumber(stats?.pendingCount || 0)}
            subtitle="Cần xử lý"
            color="red"
          />
          <StatCard
            icon={TrendingUp}
            title="Đã phản hồi"
            value={statsLoading ? '...' : formatNumber(stats?.repliedCount || 0)}
            subtitle="Đã xử lý"
            color="green"
          />
        </div>

        {/* Category Averages */}
        {stats && stats.categoryAverages && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Đánh giá trung bình theo danh mục
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { key: 'process', label: 'Quy trình', icon: '🩺' },
                { key: 'bloodTest', label: 'Xét nghiệm', icon: '🔬' },
                { key: 'postDonationCare', label: 'Chăm sóc', icon: '💊' },
                { key: 'comfortable', label: 'Thoải mái', icon: '🏥' },
                { key: 'overallSatisfaction', label: 'Tổng thể', icon: '⭐' },
              ].map((category) => {
                const rating = stats.categoryAverages[category.key as keyof typeof stats.categoryAverages] || 0;
                const percentage = (rating / 5) * 100;
                
                return (
                  <div key={category.key} className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium text-gray-700 mb-2">{category.label}</div>
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-yellow-400"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${percentage}, 100`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {rating.toFixed(1)}/5
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rating Distribution */}
        {stats && stats.ratingDistribution && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Phân bố đánh giá
              </h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage = stats.totalFeedbacks > 0 
                  ? (count / stats.totalFeedbacks) * 100 
                  : 0;
                
                return (
                  <div key={rating} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <span className="text-lg font-bold text-gray-900">{rating}</span>
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-500">
                        ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback List */}
        <FeedbackList
          feedbacks={feedbacks}
          loading={loading}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          onFiltersChange={handleFiltersChange}
          onReply={handleReply}
          onDelete={handleDelete}
          onDeleteMultiple={handleDeleteMultiple}
          replyLoading={replyLoading}
          deleteLoading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default StaffFeedbackPage;