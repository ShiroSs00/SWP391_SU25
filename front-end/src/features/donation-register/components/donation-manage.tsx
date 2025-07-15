import React, { useEffect, useState } from 'react';
import {
  getAllDonations,
  getDonationsByEvent,
  deleteMultipleDonations
} from '../hooks/useBloodDonation';
import { getAllEvents } from '../../admin/hooks/useEvents';
import type { AdminEvent } from '../../admin/types/admin.types';
import { getAdminProfileByAccountId } from '../../accounts/services/accounts.services';
import type { ProfileData } from '../../accounts/types/accounts.types';
import type {
  DonationRegistrationDTO,
  DonationFilterParams,
} from '../types/donations-register.types';
import HealthCheckModal from '../../health-checks/components/HealthCheckModal';

// Quản lý đơn hiến máu: danh sách, tìm kiếm, cập nhật, xóa
const DonationManage: React.FC = () => {
  const [donations, setDonations] = useState<DonationRegistrationDTO[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [users, setUsers] = useState<Map<string, ProfileData>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<DonationFilterParams>({ eventId: '' });
  const [statusFilter, setStatusFilter] = useState<string>(''); // Thêm filter theo status
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [role, setRole] = useState<string>('');
  
  // Health Check Modal states
  const [isHealthCheckModalOpen, setIsHealthCheckModalOpen] = useState(false);
  const [selectedDonationForHealthCheck, setSelectedDonationForHealthCheck] = useState<DonationRegistrationDTO | null>(null);

  // Lấy role từ localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setRole(parsed.role || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    fetchAll();
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Lấy tất cả đơn hiến máu
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [donationData, eventData] = await Promise.all([
        getAllDonations(),
        getAllEvents()
      ]);
      setDonations(donationData);
      setEvents(eventData);

      // Lấy thông tin người dùng cho tất cả các donation
      const uniqueAccountIds = [...new Set(donationData.map(d => d.accountId))];
      const userMap = new Map<string, ProfileData>();
      
      await Promise.all(
        uniqueAccountIds.map(async (accountId) => {
          try {
            const userData = await getAdminProfileByAccountId(accountId);
            // Xử lý cả trường hợp response có hoặc không có nested data
            userMap.set(accountId, userData.data || userData);
          } catch (error) {
            console.error(`Failed to fetch user data for ${accountId}:`, error);
          }
        })
      );
      
      setUsers(userMap);
    } catch {
      setError('Không thể tải danh sách đơn hiến máu');
    } finally {
      setLoading(false);
    }
  };

  // Lấy tên sự kiện từ ID
  const getEventName = (eventId: string) => {
    const event = events.find(e => e.eventId === eventId);
    return event ? event.nameOfEvent : eventId;
  };

  // Lấy tên người dùng từ ID
  const getUserName = (accountId: string) => {
    const user = users.get(accountId);
    return user ? user.name || user.username || accountId : accountId;
  };

  // Lọc đơn hiến máu theo sự kiện
  const handleFilter = async (params: DonationFilterParams) => {
    setLoading(true);
    setError('');
    try {
      let data: DonationRegistrationDTO[];
      
      if (params.eventId && params.eventId.trim() !== '') {
        // Lọc theo eventId cụ thể
        data = await getDonationsByEvent(params.eventId);
      } else {
        // Lấy tất cả nếu không có eventId
        data = await getAllDonations();
      }
      
      setDonations(data);

      // Lấy thông tin người dùng cho các donation đã lọc
      const uniqueAccountIds = [...new Set(data.map(d => d.accountId))];
      const userMap = new Map(users); // Giữ lại dữ liệu cũ
      
      await Promise.all(
        uniqueAccountIds.map(async (accountId) => {
          if (!userMap.has(accountId)) {
            try {
              const userData = await getAdminProfileByAccountId(accountId);
              // Xử lý cả trường hợp response có hoặc không có nested data
              userMap.set(accountId, userData.data || userData);
            } catch (error) {
              console.error(`Failed to fetch user data for ${accountId}:`, error);
            }
          }
        })
      );
      
      setUsers(userMap);
    } catch {
      setError('Lọc đơn thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Lấy màu sắc cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500 text-white';
      case 'PASSED':
        return 'bg-emerald-500 text-white';
      case 'CANCELLED':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  // Xóa nhiều đơn
  const handleDeleteMultiple = async (ids: string[]) => {
    setLoading(true);
    setError('');
    try {
      await deleteMultipleDonations(ids);
      setToast({ msg: 'Xóa đơn thành công', type: 'success' });
      fetchAll();
    } catch {
      setError('Xóa đơn thất bại');
      setToast({ msg: 'Xóa đơn thất bại', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Tính toán số liệu thống kê
  const getStatistics = () => {
    const total = donations.length;
    const pending = donations.filter(d => d.status === 'PENDING').length;
    const passed = donations.filter(d => d.status === 'PASSED').length;
    const cancelled = donations.filter(d => d.status === 'CANCELLED').length;
    
    return { total, pending, passed, cancelled };
  };

  // Lọc donations hiển thị theo statusFilter
  const getDisplayedDonations = () => {
    return statusFilter ? donations.filter(d => d.status === statusFilter) : donations;
  };

  const stats = getStatistics();
  const displayedDonations = getDisplayedDonations();

  // Hàm xử lý click vào card để filter theo status
  const handleStatusCardClick = (status: string) => {
    if (statusFilter === status) {
      setStatusFilter(''); // Bỏ filter nếu click vào card đang active
    } else {
      setStatusFilter(status); // Set filter theo status
    }
  };

  // Hàm mở modal health check
  const handleOpenHealthCheckModal = (donation: DonationRegistrationDTO) => {
    setSelectedDonationForHealthCheck(donation);
    setIsHealthCheckModalOpen(true);
  };

  // Hàm đóng modal health check
  const handleCloseHealthCheckModal = () => {
    setIsHealthCheckModalOpen(false);
    setSelectedDonationForHealthCheck(null);
  };

  // Hàm xử lý khi tạo health check thành công
  const handleHealthCheckSuccess = () => {
    setToast({ msg: 'Tạo kiểm tra sức khỏe thành công', type: 'success' });
    fetchAll(); // Refresh danh sách donations
  };

  // UI quản lý đơn hiến máu
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 animate-fade-in">
      <h2 className="text-2xl font-extrabold mb-6 text-[#b71c1c] tracking-tight animate-fade-in-down">Quản lý đơn hiến máu</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className={`rounded-xl shadow-sm border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            statusFilter === '' 
              ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 ring-2 ring-blue-300' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300'
          }`}
          onClick={() => handleStatusCardClick('')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng Đơn</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div 
          className={`rounded-xl shadow-sm border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            statusFilter === 'PENDING' 
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 ring-2 ring-yellow-300' 
              : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300'
          }`}
          onClick={() => handleStatusCardClick('PENDING')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div 
          className={`rounded-xl shadow-sm border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            statusFilter === 'PASSED' 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 ring-2 ring-green-300' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
          }`}
          onClick={() => handleStatusCardClick('PASSED')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.passed}</p>
            </div>
          </div>
        </div>

        <div 
          className={`rounded-xl shadow-sm border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            statusFilter === 'CANCELLED' 
              ? 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300 ring-2 ring-gray-300' 
              : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleStatusCardClick('CANCELLED')}
        >
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded shadow text-white font-semibold animate-fade-in-up ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>{toast.msg}</div>
      )}
      {/* Filter */}
      <form
        className="flex flex-col md:flex-row gap-4 mb-6 items-end"
        onSubmit={e => {
          e.preventDefault();
          handleFilter(filter);
        }}
      >
        <select
          className="border p-2 rounded w-full md:w-64"
          value={filter.eventId || ''}
          onChange={e => setFilter(f => ({ ...f, eventId: e.target.value }))}
        >
          <option value="">Tất cả sự kiện</option>
          {events.map(event => (
            <option key={event.eventId} value={event.eventId}>
              {event.nameOfEvent}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200"
        >
          Lọc
        </button>
        <button
          type="button"
          className="px-5 py-2 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-700 transition-all duration-200"
          onClick={() => {
            setFilter({ eventId: '' });
            setStatusFilter(''); // Reset status filter too
            fetchAll();
          }}
        >
          Làm mới
        </button>
      </form>

      {/* Active Status Filter Indicator */}
      {statusFilter && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Đang lọc theo:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusFilter === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            statusFilter === 'PASSED' ? 'bg-green-100 text-green-800' :
            statusFilter === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {statusFilter === 'PENDING' ? 'Pending' :
             statusFilter === 'PASSED' ? 'Passed' :
             statusFilter === 'CANCELLED' ? 'Cancelled' : statusFilter}
          </span>
          <button
            onClick={() => setStatusFilter('')}
            className="text-gray-400 hover:text-gray-600 ml-1"
            title="Xóa bộ lọc"
          >
            ✕
          </button>
        </div>
      )}
      {error && <div className="text-red-600 mb-4 animate-fade-in">{error}</div>}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2 items-center">
          <span className="text-sm text-gray-700">Đã chọn {selectedIds.length} đơn</span>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-all duration-200"
            onClick={() => {
              if (role === 'ADMIN' || role === 'STAFF') {
                if (window.confirm('Bạn chắc chắn muốn xóa các đơn đã chọn?')) {
                  handleDeleteMultiple(selectedIds);
                  setSelectedIds([]);
                }
              } else {
                setToast({ msg: 'Bạn không có quyền xóa nhiều đơn!', type: 'error' });
              }
            }}
            disabled={role !== 'ADMIN' && role !== 'STAFF'}
          >
            Xóa các đơn đã chọn
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded-full font-medium hover:bg-gray-400 transition-all duration-200"
            onClick={() => setSelectedIds([])}
          >
            Bỏ chọn
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 font-medium">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Danh Sách Đơn Hiến Máu ({displayedDonations.length})</h3>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === displayedDonations.length && displayedDonations.length > 0}
                  onChange={e => {
                    if (e.target.checked) setSelectedIds(displayedDonations.map(d => d.registrationId));
                    else setSelectedIds([]);
                  }}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Chọn tất cả</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {Array.isArray(displayedDonations) && displayedDonations.map((d, index) => (
              <div key={d.registrationId} className={`p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  
                  {/* Left Section - User Info */}
                  <div className="flex items-center space-x-4 lg:flex-1">
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(d.registrationId)}
                        onChange={e => {
                          if (e.target.checked) setSelectedIds(ids => [...ids, d.registrationId]);
                          else setSelectedIds(ids => ids.filter(id => id !== d.registrationId));
                        }}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {getUserName(d.accountId).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{getUserName(d.accountId)}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(d.status)}`}>
                          {d.status === 'PENDING' ? '⏳ Pending' : 
                           d.status === 'PASSED' ? '✓ Passed' : 
                           d.status === 'CANCELLED' ? '✗ Cancelled' : d.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800">
                          ID: {d.registrationId}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800">
                          {getEventName(d.eventId)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section - Donation Info */}
                  <div className="lg:flex-1 lg:mx-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-blue-700">Ngày tạo</span>
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-sm font-bold text-blue-800 mt-1">
                          {new Date(d.dateCreated).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-700">Ngày hiến máu</span>
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div className="text-sm font-bold text-green-800 mt-1">
                          {d.donationDate ? new Date(d.donationDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex justify-center lg:flex-shrink-0">
                    {/* Health Check Button */}
                    {(d.status === 'PENDING' || d.status === 'CANCELLED') && (role === 'ADMIN' || role === 'STAFF') && (
                      <button
                        onClick={() => handleOpenHealthCheckModal(d)}
                        className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        title="Tạo đơn khám sức khỏe"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Khám Sức Khỏe
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {displayedDonations.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có dữ liệu</h3>
              <p className="mt-1 text-sm text-gray-500">Hiện tại chưa có đơn hiến máu nào trong hệ thống.</p>
            </div>
          )}
        </div>
      )}

      {/* Health Check Modal */}
      {isHealthCheckModalOpen && selectedDonationForHealthCheck && (
        <HealthCheckModal
          isOpen={isHealthCheckModalOpen}
          onClose={handleCloseHealthCheckModal}
          donation={selectedDonationForHealthCheck}
          onSuccess={handleHealthCheckSuccess}
        />
      )}
    </div>
  );
};

export default DonationManage;
