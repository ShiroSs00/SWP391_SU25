import React, { useState, useEffect } from 'react';
import { bloodBagsService } from '../../admin/services/blood-bags.services';
import type { BloodBag } from '../../admin/types/blood-bags.types';

interface BloodInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestedBloodType?: string;
  requestedVolume?: number;
}

const BloodInventoryModal: React.FC<BloodInventoryModalProps> = ({ 
  isOpen, 
  onClose, 
  requestedBloodType = '', 
  requestedVolume = 0 
}) => {
  const [bloodBags, setBloodBags] = useState<BloodBag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('available');

  // Fetch blood bags when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBloodBags();
    }
  }, [isOpen]);

  const fetchBloodBags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bloodBagsService.getAllBloodBags();
      if (response.success) {
        setBloodBags(response.data);
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải danh sách túi máu');
      }
    } catch (err: unknown) {
      let errorMessage = 'Có lỗi xảy ra khi tải danh sách túi máu';
      
      if (err && typeof err === 'object') {
        if ('response' in err && err.response && 
            typeof err.response === 'object' && 'data' in err.response &&
            err.response.data && typeof err.response.data === 'object' &&
            'message' in err.response.data) {
          errorMessage = String(err.response.data.message);
        } else if ('message' in err) {
          errorMessage = String(err.message);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter blood bags
  const filteredBloodBags = bloodBags.filter((bag) => {
    const matchesSearch = 
      bag.bagId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.bloodCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.componentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || bag.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate compatibility
  const compatibleBags = filteredBloodBags.filter(bag => 
    requestedBloodType && bag.bloodCode?.toLowerCase().includes(requestedBloodType.toLowerCase())
  );

  const availableVolume = compatibleBags
    .filter(bag => bag.status === 'available')
    .reduce((total, bag) => total + bag.volume, 0);

  const isEnoughVolume = availableVolume >= requestedVolume;

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      available: 'bg-green-100 text-green-800 border-green-200',
      used: 'bg-gray-100 text-gray-800 border-gray-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      available: 'Có sẵn',
      used: 'Đã sử dụng',
      expired: 'Hết hạn',
      reserved: 'Đã đặt trước'
    };
    
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  // Check if bag is compatible with requested blood type
  const isCompatible = (bag: BloodBag) => {
    if (!requestedBloodType) return false;
    return bag.bloodCode?.toLowerCase().includes(requestedBloodType.toLowerCase());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Kiểm tra kho máu</h2>
              <p className="text-red-100 mt-1">Xem danh sách túi máu có sẵn để quyết định duyệt đơn</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Request Info */}
          {requestedBloodType && (
            <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-red-100 text-sm">Nhóm máu yêu cầu</p>
                  <p className="text-white font-bold text-lg">{requestedBloodType}</p>
                </div>
                <div>
                  <p className="text-red-100 text-sm">Thể tích cần</p>
                  <p className="text-white font-bold text-lg">{requestedVolume} ml</p>
                </div>
                <div>
                  <p className="text-red-100 text-sm">Thể tích có sẵn</p>
                  <p className={`font-bold text-lg ${isEnoughVolume ? 'text-green-200' : 'text-yellow-200'}`}>
                    {availableVolume} ml
                  </p>
                </div>
              </div>
              
              {/* Availability Status */}
              <div className="mt-3 text-center">
                {isEnoughVolume ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Đủ máu để duyệt đơn
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    Không đủ máu - cần thêm {requestedVolume - availableVolume} ml
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Filters */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm theo ID túi máu, mã máu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="available">Có sẵn</option>
                  <option value="used">Đã sử dụng</option>
                  <option value="expired">Hết hạn</option>
                  <option value="reserved">Đã đặt trước</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 text-red-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 mt-2">Đang tải danh sách túi máu...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Blood Bags Table */}
          {!loading && !error && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Túi máu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã máu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thể tích
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày hết hạn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tương thích
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBloodBags.length > 0 ? (
                      filteredBloodBags.map((bag, index) => {
                        const compatible = isCompatible(bag);
                        return (
                          <tr 
                            key={bag.bagId || index} 
                            className={`hover:bg-gray-50 ${compatible ? 'bg-green-50' : ''}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${compatible ? 'bg-green-100' : 'bg-red-100'}`}>
                                  <svg className={`w-4 h-4 ${compatible ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{bag.bagId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${compatible ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {bag.bloodCode}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {bag.volume} ml
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(bag.expirationDate).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(bag.status)}`}>
                                {getStatusText(bag.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {compatible ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                  </svg>
                                  Tương thích
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Không tương thích
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                            </svg>
                            <p className="text-gray-500 text-lg">Không tìm thấy túi máu nào</p>
                            <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc tìm kiếm</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BloodInventoryModal;
