import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Tag,
  SortAsc,
  SortDesc,
  MoreVertical,
  Edit3,
  Archive
} from 'lucide-react';
import { FeedbackCategory, FeedbackStatus } from '../types/feedback.types';
import { useFeedback, useFeedbackStats } from '../hooks/useFeedback';
import { FeedbackCard } from '../components/FeedbackCard';
import   RatingStars  from '../components/RatingStars';
import type { FeedbackFilter } from '../types/feedback.types';

type SortField = 'createdAt' | 'rating' | 'status' | 'category';
type SortOrder = 'asc' | 'desc';

export const FeedbackPage: React.FC = () => {
  const { feedbacks, loading, error, loadFeedbacks, deleteMultipleFeedbacks, updateFeedback } = useFeedback();
  const { stats, loading: statsLoading, refreshStats } = useFeedbackStats();
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FeedbackFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadFeedbacks();
    refreshStats();
  }, [loadFeedbacks, refreshStats]);

  const handleFilterChange = (key: keyof FeedbackFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    loadFeedbacks(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    handleFilterChange('searchQuery', query);
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handleSelectFeedback = (feedbackId: string) => {
    setSelectedFeedbacks(prev =>
      prev.includes(feedbackId)
        ? prev.filter(id => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFeedbacks.length === feedbacks.length) {
      setSelectedFeedbacks([]);
    } else {
      setSelectedFeedbacks(feedbacks.map(f => f.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFeedbacks.length === 0) return;
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedFeedbacks.length} phản hồi đã chọn?`)) {
      try {
        await deleteMultipleFeedbacks(selectedFeedbacks);
        setSelectedFeedbacks([]);
        refreshStats();
      } catch (error) {
        console.error('Error deleting feedbacks:', error);
      }
    }
  };

  const handleBulkStatusUpdate = async (status: FeedbackStatus) => {
    if (selectedFeedbacks.length === 0) return;

    try {
      const updatePromises = selectedFeedbacks.map(id => {
        const feedback = feedbacks.find(f => f.id === id);
        if (feedback) {
          return updateFeedback(feedback.registrationId, { status });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      setSelectedFeedbacks([]);
      loadFeedbacks(filters);
      refreshStats();
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const handleExportData = () => {
    // Simulate export functionality
    const csvContent = [
      ['ID', 'Registration ID', 'Rating', 'Category', 'Status', 'Created At', 'Comment'],
      ...feedbacks.map(f => [
        f.id,
        f.registrationId,
        f.rating,
        f.category,
        f.status,
        f.createdAt,
        f.comment.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    loadFeedbacks();
  };

  const categoryLabels: Record<FeedbackCategory, string> = {
    [FeedbackCategory.STAFF_SERVICE]: 'Dịch vụ nhân viên',
    [FeedbackCategory.FACILITY_CLEANLINESS]: 'Vệ sinh cơ sở',
    [FeedbackCategory.DONATION_PROCESS]: 'Quy trình hiến máu',
    [FeedbackCategory.WAITING_TIME]: 'Thời gian chờ đợi',
    [FeedbackCategory.OVERALL_EXPERIENCE]: 'Trải nghiệm tổng thể',
    [FeedbackCategory.GENERAL_SUGGESTION]: 'Góp ý chung'
  };

  const statusLabels: Record<FeedbackStatus, string> = {
    [FeedbackStatus.PENDING]: 'Chờ xử lý',
    [FeedbackStatus.REVIEWED]: 'Đã xem',
    [FeedbackStatus.RESOLVED]: 'Đã giải quyết'
  };

  const getStatusIcon = (status: FeedbackStatus) => {
    switch (status) {
      case FeedbackStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      case FeedbackStatus.REVIEWED:
        return <Eye className="w-4 h-4" />;
      case FeedbackStatus.RESOLVED:
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortField) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'rating':
        aValue = a.rating;
        bValue = b.rating;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý phản hồi</h1>
              <p className="text-gray-600">Theo dõi và quản lý phản hồi từ người hiến máu</p>
            </div>
            <button
              onClick={() => {
                loadFeedbacks(filters);
                refreshStats();
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng phản hồi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFeedbacks}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {feedbacks.filter(f => f.status === FeedbackStatus.PENDING).length} chờ xử lý
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                    <RatingStars rating={Math.round(stats.averageRating)} readonly size="sm" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Từ {stats.totalFeedbacks} đánh giá
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ hài lòng</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.totalFeedbacks > 0 
                      ? Math.round(((stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)) / stats.totalFeedbacks * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Đánh giá 4-5 sao
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã giải quyết</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {feedbacks.filter(f => f.status === FeedbackStatus.RESOLVED).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {feedbacks.filter(f => f.status === FeedbackStatus.REVIEWED).length} đã xem
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phản hồi..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
                  showFilters 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
                {Object.keys(filters).length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>

              <button 
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </button>

              {selectedFeedbacks.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                  >
                    <MoreVertical className="w-4 h-4 mr-2" />
                    Thao tác ({selectedFeedbacks.length})
                  </button>
                  
                  {showBulkActions && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleBulkStatusUpdate(FeedbackStatus.REVIEWED)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Đánh dấu đã xem
                        </button>
                        <button
                          onClick={() => handleBulkStatusUpdate(FeedbackStatus.RESOLVED)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Đánh dấu đã giải quyết
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={handleDeleteSelected}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa đã chọn
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả danh mục</option>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá
                  </label>
                  <select
                    value={filters.rating || ''}
                    onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả đánh giá</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao</option>
                    <option value="3">3 sao</option>
                    <option value="2">2 sao</option>
                    <option value="1">1 sao</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Tất cả trạng thái</option>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort and View Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
              <div className="flex items-center space-x-2">
                {[
                  { field: 'createdAt', label: 'Ngày tạo', icon: Calendar },
                  { field: 'rating', label: 'Đánh giá', icon: Star },
                  { field: 'status', label: 'Trạng thái', icon: Tag },
                  { field: 'category', label: 'Danh mục', icon: Tag }
                ].map(({ field, label, icon: Icon }) => (
                  <button
                    key={field}
                    onClick={() => handleSort(field as SortField)}
                    className={`inline-flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                      sortField === field
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {label}
                    {sortField === field && (
                      sortOrder === 'desc' ? <SortDesc className="w-4 h-4 ml-1" /> : <SortAsc className="w-4 h-4 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Hiển thị {sortedFeedbacks.length} phản hồi
              </span>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {/* Bulk Actions */}
          {feedbacks.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFeedbacks.length === feedbacks.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Chọn tất cả ({feedbacks.length} phản hồi)
                  </span>
                </label>

                {selectedFeedbacks.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedFeedbacks.length} phản hồi
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Feedback Cards */}
          {!loading && sortedFeedbacks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có phản hồi nào
              </h3>
              <p className="text-gray-600">
                {Object.keys(filters).length > 0 
                  ? 'Không tìm thấy phản hồi phù hợp với bộ lọc.'
                  : 'Chưa có phản hồi nào từ người hiến máu.'
                }
              </p>
              {Object.keys(filters).length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedFeedbacks.map((feedback) => (
                <div key={feedback.id} className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFeedbacks.includes(feedback.id)}
                    onChange={() => handleSelectFeedback(feedback.id)}
                    className="absolute top-4 left-4 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded z-10"
                  />
                  <div className="pl-8">
                    <FeedbackCard
                      feedback={feedback}
                      showActions={true}
                      onEdit={(feedback) => {
                        // Handle edit functionality
                        console.log('Edit feedback:', feedback);
                      }}
                      onDelete={async (feedback) => {
                        if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
                          try {
                            await deleteMultipleFeedbacks([feedback.id]);
                            refreshStats();
                          } catch (error) {
                            console.error('Error deleting feedback:', error);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};