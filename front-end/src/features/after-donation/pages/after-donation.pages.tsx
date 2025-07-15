import React, { useState, useEffect } from 'react';
import { getAllHealthChecks } from '../../health-checks/services/health-check.services';
import { getAllDonations } from '../../donation-register/hooks/useBloodDonation';
import { getAdminProfileByAccountId } from '../../accounts/services/accounts.services';
import AfterDonationCreateForm from '../components/after-donation.createform';
import type { HealthCheckData } from '../../health-checks/types/health-check.types';
import type { ProfileData } from '../../accounts/types/accounts.types';
import type { DonationRegistrationDTO } from '../../donation-register/types/donations-register.types';

const AfterDonationPage: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheckData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHealthCheckId, setSelectedHealthCheckId] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Map<string, ProfileData>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHealthChecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthCheckData, donationData] = await Promise.all([
        getAllHealthChecks(),
        getAllDonations()
      ]);
      
      // Filter only health checks that are fit to donate
      const fitHealthChecks = healthCheckData.filter((check: HealthCheckData) => check.isFitToDonate);
      setHealthChecks(fitHealthChecks);

      // Create a map of registrationId to donation for quick lookup
      const donationMap = new Map<string, DonationRegistrationDTO>();
      donationData.forEach((donation: DonationRegistrationDTO) => {
        donationMap.set(donation.registrationId, donation);
      });

      // Fetch user profiles for each health check
      const profileMap = new Map<string, ProfileData>();
      
      await Promise.all(
        fitHealthChecks.map(async (healthCheck: HealthCheckData) => {
          try {
            const donation = donationMap.get(healthCheck.donationRegistrationId);
            
            if (donation?.accountId) {
              const userData = await getAdminProfileByAccountId(donation.accountId);
              const profile = userData.data || userData;
              
              if (profile) {
                profileMap.set(healthCheck.donationRegistrationId, profile);
              }
            }
          } catch (error) {
            console.error(`Failed to fetch user data for registration ${healthCheck.donationRegistrationId}:`, error);
          }
        })
      );
      
      setUserProfiles(profileMap);
    } catch (err) {
      setError((err as Error).message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthChecks();
  }, []);

  const getUserName = (registrationId: string) => {
    const user = userProfiles.get(registrationId);
    if (!user) {
      return registrationId;
    }
    return user.name || user.username || user.email || `User-${registrationId.slice(-4)}`;
  };

  const handleSelectHealthCheck = (healthCheckId: string) => {
    setSelectedHealthCheckId(healthCheckId);
    setShowCreateForm(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setSelectedHealthCheckId('');
    // Optionally refresh the health checks list
    fetchHealthChecks();
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setSelectedHealthCheckId('');
  };

  // Filter health checks based on search term
  const filteredHealthChecks = healthChecks.filter(check => {
    const userName = getUserName(check.donationRegistrationId).toLowerCase();
    const healthCheckId = check.healthCheckId?.toLowerCase() || '';
    const registrationId = check.donationRegistrationId.toLowerCase();
    
    return userName.includes(searchTerm.toLowerCase()) ||
           healthCheckId.includes(searchTerm.toLowerCase()) ||
           registrationId.includes(searchTerm.toLowerCase());
  });

  if (showCreateForm && selectedHealthCheckId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
        </div>
        
        <AfterDonationCreateForm
          healthCheckId={selectedHealthCheckId}
          onSuccess={handleCreateSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sau Hiến Máu</h1>
          <p className="text-gray-600 mt-1">Tạo bản ghi theo dõi sau khi hiến máu</p>
        </div>
        
        <button
          onClick={fetchHealthChecks}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Đạt Điều Kiện</p>
              <p className="text-2xl font-bold text-gray-900">{healthChecks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Có Thể Tạo Bản Ghi</p>
              <p className="text-2xl font-bold text-gray-900">{filteredHealthChecks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, Health Check ID, hoặc Registration ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-0 focus:ring-0 focus:outline-none text-sm"
          />
        </div>
      </div>

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

      {/* Health Checks List */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Kiểm Tra Sức Khỏe Đạt Điều Kiện
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredHealthChecks.map((check, index) => (
              <div key={check.healthCheckId} className={`p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  
                  {/* Left Section - User Info */}
                  <div className="flex items-center space-x-4 lg:flex-1">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {getUserName(check.donationRegistrationId).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{getUserName(check.donationRegistrationId)}</h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Đạt điều kiện
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800">
                          HC-{check.healthCheckId}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700">
                          RD-{check.donationRegistrationId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section - Health Stats */}
                  <div className="lg:flex-1 lg:mx-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-xs font-medium text-green-700 mb-1">Cân nặng</div>
                        <div className="text-sm font-bold text-green-800">{check.weight}kg</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="text-xs font-medium text-orange-700 mb-1">Nhiệt độ</div>
                        <div className="text-sm font-bold text-orange-800">{check.temperature}°C</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="text-xs font-medium text-red-700 mb-1">Huyết áp</div>
                        <div className="text-sm font-bold text-red-800">{check.bloodPressure}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <div className="text-xs font-medium text-purple-700 mb-1">Mạch</div>
                        <div className="text-sm font-bold text-purple-800">{check.pulse} bpm</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-xs font-medium text-blue-700 mb-1">Hemoglobin</div>
                        <div className="text-sm font-bold text-blue-800">{check.hemoglobin} g/dL</div>
                      </div>
                      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-center">
                        <div className="text-xs font-medium text-white mb-1">Lượng máu</div>
                        <div className="text-sm font-bold text-white">{check.volumeToTake}ml</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Action */}
                  <div className="lg:flex-shrink-0">
                    <button
                      onClick={() => handleSelectHealthCheck(check.healthCheckId!)}
                      className="w-full lg:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tạo Bản Ghi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredHealthChecks.length === 0 && healthChecks.length > 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy kết quả</h3>
              <p className="mt-1 text-sm text-gray-500">Không có kiểm tra sức khỏe nào phù hợp với tìm kiếm.</p>
            </div>
          )}
          
          {filteredHealthChecks.length === 0 && healthChecks.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có dữ liệu</h3>
              <p className="mt-1 text-sm text-gray-500">Hiện tại chưa có kiểm tra sức khỏe nào đạt điều kiện hiến máu.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AfterDonationPage;
