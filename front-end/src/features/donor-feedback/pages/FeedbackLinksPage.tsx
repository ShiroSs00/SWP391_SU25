import React, { useEffect, useState } from 'react';
import { Search, Filter, Calendar, Users, Copy, ExternalLink, ChevronLeft, ChevronRight, Heart, Check, Mail } from 'lucide-react';
import { useDonation } from '../hooks/useDonation';
import type { DonationFilters } from '../types/donation.types';
import { formatDateTime } from '../utils/formatters';
import type {FeedbackFilters} from "../types/feedback.types.ts";

const FeedbackLinksPage: React.FC = () => {
  const {
    donations,
    loading,
    total,
    currentPage,
    totalPages,
    getAllDonations,
    generateFeedbackLink,
    error,
    setError,
  } = useDonation();

  const [filters, setFilters] = useState<DonationFilters>({
    search: '',
    status: 'completed', // Chỉ hiển thị những đăng ký đã hoàn thành
    sortBy: 'donationDate',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [selectedDonations, setSelectedDonations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState<Set<string>>(new Set());

  useEffect(() => {
    getAllDonations(filters);
  }, [getAllDonations]);

  const handleFilterChange = <K extends keyof FeedbackFilters>(
    key: K,
    value: FeedbackFilters[K],
    ) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    getAllDonations(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    getAllDonations(newFilters);
  };

  const handleSelectDonation = (registrationId: string, selected: boolean) => {
    if (selected) {
      setSelectedDonations(prev => [...prev, registrationId]);
    } else {
      setSelectedDonations(prev => prev.filter(id => id !== registrationId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedDonations(donations.map(d => d.registrationId));
    } else {
      setSelectedDonations([]);
    }
  };

  const handleCopyLink = async (registrationId: string) => {
    const link = generateFeedbackLink(registrationId);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinks(prev => new Set([...prev, registrationId]));
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(registrationId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCopyMultipleLinks = async () => {
    const links = selectedDonations.map(id => {
      const donation = donations.find(d => d.registrationId === id);
      const link = generateFeedbackLink(id);
      return `${donation?.donorName} (${donation?.donorEmail}): ${link}`;
    }).join('\n\n');

    try {
      await navigator.clipboard.writeText(links);
      selectedDonations.forEach(id => {
        setCopiedLinks(prev => new Set([...prev, id]));
      });
      setTimeout(() => {
        setCopiedLinks(new Set());
      }, 3000);
    } catch (err) {
      console.error('Failed to copy links:', err);
    }
  };

  const handleOpenLink = (registrationId: string) => {
    const link = generateFeedbackLink(registrationId);
    window.open(link, '_blank');
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const sortOptions = [
    { value: 'donationDate', label: 'Ngày hiến máu' },
    { value: 'registrationDate', label: 'Ngày đăng ký' },
    { value: 'donorName', label: 'Tên người hiến' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const completedDonations = donations.filter(d => d.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tạo Link Feedback
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Tạo và chia sẻ link feedback cho người hiến máu đã hoàn thành
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
                <ExternalLink className="w-6 h-6 text-red-600" />
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

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Danh sách đăng ký hiến máu ({total})
              </h2>
              <p className="text-gray-600 mt-1">
                Chọn những đăng ký đã hoàn thành để tạo link feedback
              </p>
            </div>

            <div className="flex items-center gap-3">
              {selectedDonations.length > 0 && (
                <button
                  onClick={handleCopyMultipleLinks}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                  Sao chép link ({selectedDonations.length})
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
          <div className="mb-4">
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
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={filters.status || 'completed'}
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
                    value={filters.sortBy || 'donationDate'}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng đăng ký</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{completedDonations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Có thể tạo link</p>
                <p className="text-2xl font-bold text-gray-900">{completedDonations.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Copy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã chọn</p>
                <p className="text-2xl font-bold text-gray-900">{selectedDonations.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {completedDonations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDonations.length === completedDonations.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Chọn tất cả đã hoàn thành ({completedDonations.length})
                  </span>
                </label>
                
                {selectedDonations.length > 0 && (
                  <span className="text-sm text-blue-600">
                    Đã chọn {selectedDonations.length} đăng ký
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
        {!loading && donations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có đăng ký nào
            </h3>
            <p className="text-gray-600">
              Danh sách đăng ký hiến máu sẽ hiển thị tại đây
            </p>
          </div>
        )}

        {/* Donation List */}
        {!loading && donations.length > 0 && (
          <div className="space-y-6">
            {donations.map((donation) => (
              <div
                key={donation.registrationId}
                className={`
                  bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border
                  ${selectedDonations.includes(donation.registrationId) ? 'ring-2 ring-blue-500 ring-opacity-50 border-blue-200' : 'border-gray-200'}
                `}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {donation.status === 'completed' && (
                        <input
                          type="checkbox"
                          checked={selectedDonations.includes(donation.registrationId)}
                          onChange={(e) => handleSelectDonation(donation.registrationId, e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900">{donation.donorName}</h3>
                          <span className={`
                            px-3 py-1 text-xs font-medium rounded-full border
                            ${getStatusColor(donation.status)}
                          `}>
                            {getStatusText(donation.status)}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{donation.donorEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Đăng ký: {formatDateTime(donation.registrationDate)}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Mã đăng ký:</span>
                              <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {donation.registrationId}
                              </span>
                            </div>
                            {donation.donationDate && (
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                <span>Hiến máu: {formatDateTime(donation.donationDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions for completed donations */}
                  {donation.status === 'completed' && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Link Feedback</h4>
                          <p className="text-sm text-gray-600">
                            Gửi link này cho người hiến máu để họ có thể đánh giá
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(donation.registrationId)}
                            className="
                              flex items-center gap-2 px-4 py-2 text-sm text-blue-600 
                              hover:bg-blue-50 rounded-lg transition-colors duration-200
                              border border-blue-200 hover:border-blue-300
                            "
                          >
                            {copiedLinks.has(donation.registrationId) ? (
                              <>
                                <Check className="w-4 h-4" />
                                Đã sao chép
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Sao chép link
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleOpenLink(donation.registrationId)}
                            className="
                              flex items-center gap-2 px-4 py-2 text-sm text-green-600 
                              hover:bg-green-50 rounded-lg transition-colors duration-200
                              border border-green-200 hover:border-green-300
                            "
                          >
                            <ExternalLink className="w-4 h-4" />
                            Mở link
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <code className="text-xs text-gray-700 break-all">
                          {generateFeedbackLink(donation.registrationId)}
                        </code>
                      </div>
                    </div>
                  )}

                  {/* Warning for non-completed donations */}
                  {donation.status !== 'completed' && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Chỉ có thể tạo link feedback cho những đăng ký đã hoàn thành
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {((currentPage - 1) * (filters.limit || 10)) + 1} - {Math.min(currentPage * (filters.limit || 10), total)} trong tổng số {total} đăng ký
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
      </div>
    </div>
  );
};

export default FeedbackLinksPage;