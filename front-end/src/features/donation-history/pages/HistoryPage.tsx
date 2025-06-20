import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, Calendar } from 'lucide-react';
import DonationCard from '../components/DonationCard';
import StatsWidget from '../components/StatsWidget';
import NextDonationDate from '../components/NextDonationDate';
import { useDonationHistory } from '../hooks/useDonationHistory';
import { useDonationStats } from '../hooks/useDonationStats';
import { HistoryFilters } from '../types/history.types';

const HistoryPage: React.FC = () => {
  const { donations, loading, error, pagination, fetchHistory, exportHistory } = useDonationHistory();
  const { stats, nextEligibleDate } = useDonationStats();
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory(1, filters);
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<HistoryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      await exportHistory(format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const filteredDonations = donations.filter(donation =>
    donation.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lịch sử hiến máu
          </h1>
          <p className="text-gray-600">
            Theo dõi hành trình hiến máu và những đóng góp của bạn
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8">
            <StatsWidget stats={stats} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo bệnh viện, địa điểm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Lọc
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhóm máu
                    </label>
                    <select
                      value={filters.bloodType || ''}
                      onChange={(e) => handleFilterChange({ 
                        bloodType: e.target.value as any || undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Tất cả</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thành phần
                    </label>
                    <select
                      value={filters.component || ''}
                      onChange={(e) => handleFilterChange({ 
                        component: e.target.value as any || undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Tất cả</option>
                      <option value="whole_blood">Máu toàn phần</option>
                      <option value="red_cells">Hồng cầu</option>
                      <option value="plasma">Huyết tương</option>
                      <option value="platelets">Tiểu cầu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange({ 
                        status: e.target.value as any || undefined 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Tất cả</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="incomplete">Chưa hoàn thành</option>
                      <option value="adverse_reaction">Phản ứng phụ</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Donations List */}
            <div className="space-y-4">
              {loading && donations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải lịch sử...</p>
                </div>
              ) : filteredDonations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Không tìm thấy lịch sử hiến máu</p>
                </div>
              ) : (
                filteredDonations.map(donation => (
                  <DonationCard key={donation.id} donation={donation} />
                ))
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => fetchHistory(pagination.page - 1, filters)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchHistory(pagination.page + 1, filters)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <NextDonationDate 
              nextEligibleDate={nextEligibleDate}
              lastDonationDate={stats?.lastDonationDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;