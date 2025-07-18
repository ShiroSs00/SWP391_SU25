import React, { useEffect, useState } from 'react';
import {
  getAllHealthChecks,
  deleteHealthCheck,
} from '../services/health-check.services';
import { getAllDonations } from '../../donation-register/hooks/useBloodDonation';
import { getAdminProfileByAccountId } from '../../accounts/services/accounts.services';
import { getAfterDonation as getAllAfterDonationData } from '../../after-donation/services/after-donation.services';
import type { HealthCheckData } from '../types/health-check.types';
import type { ProfileData } from '../../accounts/types/accounts.types';
import type { DonationRegistrationDTO } from '../../donation-register/types/donations-register.types';
import type { AfterDonationData } from '../../after-donation/types/after-donation.types';
import UpdateHealthCheckModal from './UpdateHealthCheckModal';
import AfterDonationModal from '../../after-donation/components/after-donation.modal';

const HealthCheckManage: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheckData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedHealthCheck, setSelectedHealthCheck] = useState<HealthCheckData | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [userProfiles, setUserProfiles] = useState<Map<string, ProfileData>>(new Map());
  const [statusFilter, setStatusFilter] = useState<'all' | 'fit' | 'unfit'>('all');
  const [isAfterDonationModalOpen, setIsAfterDonationModalOpen] = useState(false);
  const [selectedHealthCheckForAnalysis, setSelectedHealthCheckForAnalysis] = useState<HealthCheckData | null>(null);
  const [afterDonationData, setAfterDonationData] = useState<AfterDonationData[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 items per page

  // Check if health check already has after donation record
  const hasAfterDonationRecord = (healthCheckId: string) => {
    return afterDonationData.some((ad) => ad.healthCheckId === healthCheckId);
  };

  const fetchHealthChecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthCheckData, donationData, afterDonationList] = await Promise.all([
        getAllHealthChecks(),
        getAllDonations(),
        getAllAfterDonationData()
      ]);
      
      setHealthChecks(healthCheckData);
      setAfterDonationData(afterDonationList);

      // Create a map of healthCheckId to donation for quick lookup
      const donationMap = new Map<string, DonationRegistrationDTO>();
      donationData.forEach((donation: DonationRegistrationDTO) => {
        if (donation.healthCheckId) {
          donationMap.set(donation.healthCheckId, donation);
        }
      });

      // Fetch user profiles for each health check
      const profileMap = new Map<string, ProfileData>();
      
      await Promise.all(
        healthCheckData.map(async (healthCheck: HealthCheckData) => {
          try {
            // Check if healthCheckId exists
            if (!healthCheck.healthCheckId) {
              console.log(`Health check has no healthCheckId`);
              return;
            }

            // Find donation by healthCheckId
            const donation = donationMap.get(healthCheck.healthCheckId);
            
            if (donation?.accountId) {
              // Fetch user profile from donation
              const userData = await getAdminProfileByAccountId(donation.accountId);
              
              // Handle both nested and direct response structures
              const profile = userData.data || userData;
              
              if (profile) {
                // Store profile with multiple keys for easier lookup
                // 1. Store by registrationId (primary key)
                profileMap.set(donation.registrationId, profile);
                // 2. Store by healthCheckId for direct lookup
                profileMap.set(healthCheck.healthCheckId, profile);
                // 3. Store by donationRegistrationId if it exists for backward compatibility
                if (healthCheck.donationRegistrationId) {
                  profileMap.set(healthCheck.donationRegistrationId, profile);
                }
                
                console.log(`Loaded profile for health check ${healthCheck.healthCheckId}: ${profile.name || profile.username}`);
              }
            } else {
              // If no donation found, create a fallback profile based on health check ID
              console.log(`No donation found for health check ID: ${healthCheck.healthCheckId}`);
              
              // Create a minimal profile from the health check ID for display purposes
              const fallbackProfile: ProfileData = {
                profileId: `fallback-profile-${healthCheck.healthCheckId}`,
                accountId: `fallback-${healthCheck.healthCheckId}`,
                name: `Người dùng HC-${healthCheck.healthCheckId.slice(-3)}`,
                email: '',
                username: `user-${healthCheck.healthCheckId?.slice(-6) || 'unknown'}`,
                gender: true, // default value
                isActive: true, // default value
              };
              
              // Use a fallback key for profiles without donation
              profileMap.set(`fallback-${healthCheck.healthCheckId}`, fallbackProfile);
            }
          } catch (error) {
            console.error(`Failed to fetch user data for health check ${healthCheck.healthCheckId}:`, error);
            
            // Create fallback profile even on error
            if (healthCheck.healthCheckId) {
              const fallbackProfile: ProfileData = {
                profileId: `error-profile-${healthCheck.healthCheckId}`,
                accountId: `error-${healthCheck.healthCheckId}`,
                name: `Người dùng HC-${healthCheck.healthCheckId.slice(-3)}`,
                email: '',
                username: `user-${healthCheck.healthCheckId?.slice(-6) || 'unknown'}`,
                gender: true, // default value
                isActive: true, // default value
              };
              
              // Use error fallback key
              profileMap.set(`error-${healthCheck.healthCheckId}`, fallbackProfile);
            }
          }
        })
      );
      
      setUserProfiles(profileMap);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while fetching health checks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthChecks();
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleEdit = (healthCheck: HealthCheckData) => {
    setSelectedHealthCheck(healthCheck);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedHealthCheck(null);
  };

  const handleUpdateSuccess = () => {
    setToast({ msg: 'Cập nhật kiểm tra sức khỏe thành công', type: 'success' });
    fetchHealthChecks(); // Refresh the list
  };

  const handleBloodAnalysis = (healthCheck: HealthCheckData) => {
    setSelectedHealthCheckForAnalysis(healthCheck);
    setIsAfterDonationModalOpen(true);
  };

  const handleCloseAfterDonationModal = () => {
    setIsAfterDonationModalOpen(false);
    setSelectedHealthCheckForAnalysis(null);
  };

  const handleAfterDonationSuccess = () => {
    setToast({ msg: 'Tạo bản ghi phân tích máu thành công', type: 'success' });
    fetchHealthChecks(); // Refresh the list
  };

  // Get user name from health check with priority for full name
  const getUserName = (healthCheck: HealthCheckData) => {
    // Handle undefined or null healthCheck
    if (!healthCheck?.healthCheckId) {
      return 'Người dùng chưa xác định';
    }

    // Try to find user profile by different strategies (in order of preference)
    let user = null;
    
    // Strategy 1: Try to find by healthCheckId (direct lookup)
    user = userProfiles.get(healthCheck.healthCheckId);
    
    // Strategy 2: Try to find by donationRegistrationId if available
    if (!user && healthCheck.donationRegistrationId) {
      user = userProfiles.get(healthCheck.donationRegistrationId);
    }
    
    // Strategy 3: Try to find by fallback keys
    if (!user) {
      user = userProfiles.get(`fallback-${healthCheck.healthCheckId}`) || 
             userProfiles.get(`error-${healthCheck.healthCheckId}`);
    }

    if (!user) {
      // If no user profile found, create display name from health check ID
      if (healthCheck.healthCheckId) {
        return `Người dùng HC-${healthCheck.healthCheckId.slice(-3)}`;
      }
      return 'Người dùng chưa xác định';
    }
    
    // Check if this is a fallback profile (created when donation not found)
    if (user.accountId.startsWith('fallback-') || user.accountId.startsWith('error-')) {
      // For fallback profiles, return the name as is (it already contains meaningful info)
      return user.name || `Người dùng HC-${healthCheck.healthCheckId.slice(-3)}`;
    }
    
    // For real profiles: Priority: name (which contains full name) > username > email > fallback
    const displayName = user.name || user.username || user.email || `Người dùng ${healthCheck.healthCheckId?.slice(-4) || 'Unknown'}`;
    
    return displayName || 'Người dùng chưa xác định';
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kiểm tra sức khỏe này?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteHealthCheck(id);
      setHealthChecks((prev) => prev.filter((check) => check.healthCheckId !== id));
      setToast({ msg: 'Xóa kiểm tra sức khỏe thành công', type: 'success' });
    } catch (err) {
      setError((err as Error).message || 'An error occurred while deleting the health check.');
      setToast({ msg: 'Xóa kiểm tra sức khỏe thất bại', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Filter health checks based on status
  const filteredHealthChecks = healthChecks.filter(check => {
    if (statusFilter === 'fit') return check.isFitToDonate;
    if (statusFilter === 'unfit') return !check.isFitToDonate;
    return true; // 'all'
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHealthChecks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHealthChecks = filteredHealthChecks.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý kiểm tra sức khỏe</h2>
        
        <div className="flex items-center space-x-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Lọc:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'fit' | 'unfit')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả ({healthChecks.length})</option>
              <option value="fit">Đạt điều kiện ({healthChecks.filter(h => h.isFitToDonate).length})</option>
              <option value="unfit">Không đạt ({healthChecks.filter(h => !h.isFitToDonate).length})</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              fetchHealthChecks();
            }}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng Kiểm Tra</p>
              <p className="text-2xl font-bold text-gray-900">{healthChecks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Đạt Điều Kiện</p>
              <p className="text-2xl font-bold text-gray-900">{healthChecks.filter(h => h.isFitToDonate).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="bg-orange-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Chưa Đạt</p>
              <p className="text-2xl font-bold text-gray-900">{healthChecks.filter(h => !h.isFitToDonate).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Hiển thị</p>
              <p className="text-2xl font-bold text-gray-900">{currentHealthChecks.length}</p>
              <p className="text-xs text-gray-500">Trang {currentPage}/{totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mb-6 px-6 py-4 rounded-xl shadow-lg text-white font-medium animate-bounce ${
          toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {toast.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {toast.msg}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 font-medium">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Danh Sách Kiểm Tra Sức Khỏe
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {currentHealthChecks.map((check, index) => (
              <div key={check.healthCheckId} className={`p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  
                  {/* Left Section - User Info */}
                  <div className="flex items-center space-x-4 lg:flex-1">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {getUserName(check)?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{getUserName(check) || 'Unknown User'}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          check.isFitToDonate 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {check.isFitToDonate ? '✓ Đạt' : '✗ Không đạt'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800">
                          ID: {check.healthCheckId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section - Health Stats */}
                  <div className="lg:flex-1 lg:mx-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-xs font-medium text-green-700 mb-1">Cân nặng</div>
                        <div className="text-sm font-bold text-green-800">{check.weight || '--'}kg</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="text-xs font-medium text-orange-700 mb-1">Nhiệt độ</div>
                        <div className="text-sm font-bold text-orange-800">{check.temperature || '--'}°C</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="text-xs font-medium text-red-700 mb-1">Huyết áp</div>
                        <div className="text-sm font-bold text-red-800">{check.bloodPressure || '--'}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <div className="text-xs font-medium text-purple-700 mb-1">Mạch</div>
                        <div className="text-sm font-bold text-purple-800">{check.pulse || '--'} bpm</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-xs font-medium text-blue-700 mb-1">Hemoglobin</div>
                        <div className="text-sm font-bold text-blue-800">{check.hemoglobin || '--'} g/dL</div>
                      </div>
                      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-center">
                        <div className="text-xs font-medium text-white mb-1">Lượng máu</div>
                        <div className="text-sm font-bold text-white">{check.volumeToTake}ml</div>
                      </div>
                    </div>
                    
                    {/* Note */}
                    {check.note && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-2 border border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-1">Ghi chú:</div>
                        <div className="text-xs text-gray-700" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>{check.note}</div>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-row lg:flex-col space-x-3 lg:space-x-0 lg:space-y-2 lg:flex-shrink-0">
                    <button
                      onClick={() => handleEdit(check)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="hidden lg:inline">Chỉnh Sửa</span>
                    </button>
                    
                    {/* Nút Phân tích máu - chỉ hiển thị cho những đạt điều kiện và chưa có after-donation */}
                    {check.isFitToDonate && !hasAfterDonationRecord(check.healthCheckId!) && (
                      <button
                        onClick={() => handleBloodAnalysis(check)}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="hidden lg:inline">Phân tích máu</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(check.healthCheckId!)}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden lg:inline">Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {filteredHealthChecks.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredHealthChecks.length)} 
                  trong tổng số {filteredHealthChecks.length} kết quả
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {filteredHealthChecks.length === 0 && healthChecks.length > 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy kết quả</h3>
              <p className="mt-1 text-sm text-gray-500">
                Không có kiểm tra sức khỏe nào phù hợp với bộ lọc hiện tại.
              </p>
              <button
                onClick={() => setStatusFilter('all')}
                className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Xem tất cả
              </button>
            </div>
          )}
          
          {filteredHealthChecks.length === 0 && healthChecks.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có dữ liệu</h3>
              <p className="mt-1 text-sm text-gray-500">Hiện tại chưa có bản kiểm tra sức khỏe nào trong hệ thống.</p>
            </div>
          )}
        </div>
      )}

      {/* Update Health Check Modal */}
      {isUpdateModalOpen && selectedHealthCheck && (
        <UpdateHealthCheckModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          healthCheck={selectedHealthCheck}
          onSuccess={handleUpdateSuccess}
          userProfile={
            (selectedHealthCheck.healthCheckId ? userProfiles.get(selectedHealthCheck.healthCheckId) : undefined) ||
            userProfiles.get(selectedHealthCheck.donationRegistrationId || '') || 
            (selectedHealthCheck.healthCheckId ? userProfiles.get(`fallback-${selectedHealthCheck.healthCheckId}`) : undefined) ||
            (selectedHealthCheck.healthCheckId ? userProfiles.get(`error-${selectedHealthCheck.healthCheckId}`) : undefined)
          }
        />
      )}

      {/* After Donation Modal */}
      {isAfterDonationModalOpen && selectedHealthCheckForAnalysis && (
        <AfterDonationModal
          isOpen={isAfterDonationModalOpen}
          onClose={handleCloseAfterDonationModal}
          healthCheckId={selectedHealthCheckForAnalysis.healthCheckId!}
          onSuccess={handleAfterDonationSuccess}
        />
      )}
    </div>
  );
};

export default HealthCheckManage;