import React, { useState } from 'react';
import { Search, Filter, Trash2, Reply, ChevronLeft, ChevronRight } from 'lucide-react';
import FeedbackCard from './FeedbackCard';
import ReplyModal from './ReplyModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import type {DonorFeedback, FeedbackFilters, UpdateFeedbackRequest} from '../types/feedback.types';

interface FeedbackListProps {
  feedbacks: DonorFeedback[];
  loading?: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
  onFiltersChange: (filters: FeedbackFilters) => void;
  onReply: (feedbackId: string, data: UpdateFeedbackRequest) => Promise<void>;
  onDelete: (feedbackId: string) => Promise<void>;
  onDeleteMultiple: (feedbackIds: string[]) => Promise<void>;
  replyLoading?: boolean;
  deleteLoading?: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  feedbacks,
  loading = false,
  total,
  currentPage,
  totalPages,
  onFiltersChange,
  onReply,
  onDelete,
  onDeleteMultiple,
  replyLoading = false,
  deleteLoading = false,
}) => {
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<DonorFeedback | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = <K extends keyof FeedbackFilters>(
      key: K,
      value: FeedbackFilters[K]
  ) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSelectFeedback = (feedbackId: string, selected: boolean) => {
    if (selected) {
      setSelectedFeedbacks(prev => [...prev, feedbackId]);
    } else {
      setSelectedFeedbacks(prev => prev.filter(id => id !== feedbackId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFeedbacks(feedbacks.map(f => f.feedbackId));
    } else {
      setSelectedFeedbacks([]);
    }
  };

  const handleReply = (feedback: DonorFeedback) => {
    setSelectedFeedback(feedback);
    setReplyModalOpen(true);
  };

  const handleReplySubmit = async (feedbackId: string, data: UpdateFeedbackRequest) => {
    await onReply(feedbackId, data);
    setReplyModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleDeleteSingle = (feedbackId: string) => {
    setSelectedFeedbacks([feedbackId]);
    setDeleteModalOpen(true);
  };

  const handleDeleteMultiple = () => {
    if (selectedFeedbacks.length > 0) {
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedFeedbacks.length === 1) {
      await onDelete(selectedFeedbacks[0]);
    } else {
      await onDeleteMultiple(selectedFeedbacks);
    }
    setDeleteModalOpen(false);
    setSelectedFeedbacks([]);
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ phản hồi' },
    { value: 'replied', label: 'Đã phản hồi' },
    { value: 'resolved', label: 'Đã giải quyết' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Thời gian tạo' },
    { value: 'overallSatisfaction', label: 'Đánh giá tổng thể' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quản lý Feedback ({total})
            </h2>
            <p className="text-gray-600 mt-1">
              Xem và phản hồi feedback từ người hiến máu
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedFeedbacks.length > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Xóa ({selectedFeedbacks.length})
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, mã đăng ký..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value as FeedbackFilters['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <select
                  value={filters.sortBy || 'createdAt'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as FeedbackFilters['sortBy'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Đánh giá tối thiểu:
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={filters.minRating || ''}
                  onChange={(e) => handleFilterChange('minRating', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sortOrder"
                  checked={filters.sortOrder === 'asc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.checked ? 'asc' : 'desc')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="sortOrder" className="text-sm text-gray-700">
                  Sắp xếp tăng dần
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {feedbacks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFeedbacks.length === feedbacks.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Chọn tất cả ({feedbacks.length})
                </span>
              </label>
              
              {selectedFeedbacks.length > 0 && (
                <span className="text-sm text-blue-600">
                  Đã chọn {selectedFeedbacks.length} feedback
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && feedbacks.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Reply className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có feedback nào
          </h3>
          <p className="text-gray-600">
            Feedback từ người hiến máu sẽ hiển thị tại đây
          </p>
        </div>
      )}

      {/* Feedback List */}
      {!loading && feedbacks.length > 0 && (
        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.feedbackId}
              feedback={feedback}
              onReply={handleReply}
              onDelete={handleDeleteSingle}
              selected={selectedFeedbacks.includes(feedback.feedbackId)}
              onSelect={handleSelectFeedback}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {((currentPage - 1) * (filters.limit || 10)) + 1} - {Math.min(currentPage * (filters.limit || 10), total)} trong tổng số {total} feedback
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`
                        px-3 py-2 text-sm rounded-lg transition-colors duration-200
                        ${currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedFeedback && (
        <ReplyModal
          feedback={selectedFeedback}
          isOpen={replyModalOpen}
          onClose={() => {
            setReplyModalOpen(false);
            setSelectedFeedback(null);
          }}
          onSubmit={handleReplySubmit}
          loading={replyLoading}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedFeedbacks([]);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        itemCount={selectedFeedbacks.length}
      />
    </div>
  );
};

export default FeedbackList;