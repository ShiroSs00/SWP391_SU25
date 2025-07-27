import React, { useState, useEffect } from "react";
import { useAfterDonation } from "../hooks/after-donation.hooks";
import { getAllHealthChecks } from "../../health-checks/services/health-check.services";
import { getAllDonations } from "../../donation-register/hooks/useBloodDonation";
import { getAdminProfileByAccountId } from "../../accounts/services/accounts.services";
import { importBloodBagsExcel } from "../services/after-donation.services";
import AfterDonationModal from "./after-donation.modal";
import ManualSeparateModal from "./ManualSeparateModal";
import type { HealthCheckData } from "../../health-checks/types/health-check.types";
import type { ProfileData } from "../../accounts/types/accounts.types";
import type { DonationRegistrationDTO } from "../../donation-register/types/donations-register.types";
import type { AfterDonationData } from "../types/after-donation.types";

const AfterDonationManage: React.FC = () => {
  const {
    afterDonationData,
    loading,
    error,
    deleteAfterDonationData,
    fetchAfterDonationData,
  } = useAfterDonation();

  const [healthChecks, setHealthChecks] = useState<HealthCheckData[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<string, ProfileData>>(
    new Map()
  );
  const [loadingHealthChecks, setLoadingHealthChecks] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHealthCheckId, setSelectedHealthCheckId] =
    useState<string>("");
  const [isManualSeparateModalOpen, setIsManualSeparateModalOpen] = useState(false);
  const [selectedAfterDonationForSeparate, setSelectedAfterDonationForSeparate] = useState<AfterDonationData | null>(null);
  const [isImportingExcel, setIsImportingExcel] = useState(false);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch health checks and user profiles
  const fetchHealthChecks = async () => {
    setLoadingHealthChecks(true);
    try {
      const [healthCheckData, donationData] = await Promise.all([
        getAllHealthChecks(),
        getAllDonations(),
      ]);

      // Filter only health checks that are fit to donate
      const fitHealthChecks = healthCheckData.filter(
        (check: HealthCheckData) => check.isFitToDonate
      );
      setHealthChecks(fitHealthChecks);

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
        fitHealthChecks.map(async (healthCheck: HealthCheckData) => {
          try {
            // Check if healthCheckId exists
            if (!healthCheck.healthCheckId) {
              console.log(`Health check has no healthCheckId`);
              return;
            }

            const donation = donationMap.get(healthCheck.healthCheckId);

            if (donation?.accountId) {
              const userData = await getAdminProfileByAccountId(
                donation.accountId
              );
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
              // If no donation found, create a fallback profile
              console.log(`No donation found for health check ID: ${healthCheck.healthCheckId}`);
              
              const fallbackProfile: ProfileData = {
                profileId: `fallback-profile-${healthCheck.healthCheckId}`,
                accountId: `fallback-${healthCheck.healthCheckId}`,
                name: `Người dùng HC-${healthCheck.healthCheckId.slice(-3)}`,
                email: '',
                username: `user-${healthCheck.healthCheckId?.slice(-6) || 'unknown'}`,
                gender: true,
                isActive: true,
              };
              
              // Use a fallback key for profiles without donation
              profileMap.set(`fallback-${healthCheck.healthCheckId}`, fallbackProfile);
            }
          } catch (error) {
            console.error(
              `Failed to fetch user data for health check ${healthCheck.healthCheckId}:`,
              error
            );
            
            // Create fallback profile even on error
            if (healthCheck.healthCheckId) {
              const fallbackProfile: ProfileData = {
                profileId: `error-profile-${healthCheck.healthCheckId}`,
                accountId: `error-${healthCheck.healthCheckId}`,
                name: `Người dùng HC-${healthCheck.healthCheckId.slice(-3)}`,
                email: '',
                username: `user-${healthCheck.healthCheckId?.slice(-6) || 'unknown'}`,
                gender: true,
                isActive: true,
              };
              
              // Use error fallback key
              profileMap.set(`error-${healthCheck.healthCheckId}`, fallbackProfile);
            }
          }
        })
      );

      setUserProfiles(profileMap);
    } catch {
      setToast({
        msg: "Có lỗi xảy ra khi tải dữ liệu health check",
        type: "error",
      });
    } finally {
      setLoadingHealthChecks(false);
    }
  };

  useEffect(() => {
    fetchHealthChecks();
  }, []);

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

  // Get health check from ID
  const getHealthCheckByIdForUser = (healthCheckId: string) => {
    return healthChecks.find((hc) => hc.healthCheckId === healthCheckId);
  };

  // Check if health check already has after donation record
  const hasAfterDonationRecord = (healthCheckId: string) => {
    return afterDonationData.some((ad) => ad.healthCheckId === healthCheckId);
  };

  // Get available health checks (not yet have after donation record)
  const availableHealthChecks = healthChecks.filter(
    (hc) => !hasAfterDonationRecord(hc.healthCheckId!)
  );

  // Handle create new record
  const handleCreateNew = (healthCheckId: string) => {
    setSelectedHealthCheckId(healthCheckId);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedHealthCheckId("");
  };

  const handleCreateSuccess = () => {
    setToast({ msg: "Tạo bản ghi phân tích máu thành công", type: "success" });
    fetchAfterDonationData(); // Refresh after donation data
    fetchHealthChecks(); // Refresh health checks
  };

  // Handle manual separate
  const handleManualSeparate = (afterDonation: AfterDonationData) => {
    setSelectedAfterDonationForSeparate(afterDonation);
    setIsManualSeparateModalOpen(true);
  };

  const handleCloseManualSeparateModal = () => {
    setIsManualSeparateModalOpen(false);
    setSelectedAfterDonationForSeparate(null);
  };

  const handleManualSeparateSuccess = () => {
    setToast({ msg: "Tách máu thủ công thành công", type: "success" });
    fetchAfterDonationData(); // Refresh the list
  };

  // Handle Excel import
  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type)) {
      setToast({ 
        msg: "Vui lòng chọn file Excel (.xlsx hoặc .xls)", 
        type: "error" 
      });
      return;
    }

    setIsImportingExcel(true);
    try {
      await importBloodBagsExcel(file);
      setToast({ 
        msg: "Import dữ liệu từ Excel thành công", 
        type: "success" 
      });
      fetchAfterDonationData(); // Refresh the list
    } catch (error: unknown) {
      console.error('Excel import error:', error);
      
      let errorMessage = "Import dữ liệu từ Excel thất bại";
      
      if (error && typeof error === 'object') {
        if ('response' in error && error.response && 
            typeof error.response === 'object' && 'data' in error.response &&
            error.response.data && typeof error.response.data === 'object' &&
            'message' in error.response.data) {
          errorMessage = String(error.response.data.message);
        } else if ('message' in error) {
          errorMessage = String(error.message);
        }
      }
      setToast({ 
        msg: errorMessage, 
        type: "error" 
      });
    } finally {
      setIsImportingExcel(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) return;

    try {
      await deleteAfterDonationData(id);
      setToast({ msg: "Xóa bản ghi thành công", type: "success" });
    } catch {
      setToast({ msg: "Xóa bản ghi thất bại", type: "error" });
    }
  };

  // Filter after donation data
  const filteredAfterDonationData = afterDonationData.filter((record) => {
    const healthCheck = getHealthCheckByIdForUser(record.healthCheckId);
    const userName = healthCheck
      ? getUserName(healthCheck)
      : "";

    const matchesSearch =
      record.idAfterDonation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.healthCheckId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.bloodId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAfterDonationData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredAfterDonationData.slice(startIndex, endIndex);

  // Get unique statuses from data - filter out null/undefined values
  const uniqueStatuses = [...new Set(afterDonationData.map(record => record.status).filter(status => status != null && status !== ''))];

  // Statistics - Dynamic based on actual data
  const totalRecords = afterDonationData.length;
  const statusCounts = uniqueStatuses.reduce((acc, status) => {
    acc[status] = afterDonationData.filter(r => r.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản Lý Bản Ghi Sau Hiến Máu
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi kết quả phân tích máu
          </p>
        </div>
      </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
          onClick={() => {
            fetchAfterDonationData();
            fetchHealthChecks();
          }}
          disabled={loading || loadingHealthChecks}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Làm mới
        </button>

        {/* Import Excel Button */}
        <div className="relative">
          <input
            type="file"
            id="excel-import"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />
          <label
            htmlFor="excel-import"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer ${
              isImportingExcel ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isImportingExcel ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Import Excel
              </>
            )}
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3 mr-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng Bản Ghi</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRecords}
              </p>
            </div>
          </div>
        </div>

        {uniqueStatuses.slice(0, 3).map((status) => {
          const getStatusInfo = (status: string) => {
            if (!status) {
              return {
                label: 'Không xác định',
                color: 'from-gray-50 to-gray-100',
                borderColor: 'border-gray-200',
                iconBg: 'bg-gray-100',
                iconColor: 'text-gray-600',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                )
              };
            }
            
            switch (status.toLowerCase()) {
              case 'passed':
                return {
                  label: 'Đã Qua',
                  color: 'from-green-50 to-emerald-50',
                  borderColor: 'border-green-200',
                  iconBg: 'bg-green-100',
                  iconColor: 'text-green-600',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )
                };
              case 'failed':
                return {
                  label: 'Thất Bại',
                  color: 'from-red-50 to-pink-50',
                  borderColor: 'border-red-200',
                  iconBg: 'bg-red-100',
                  iconColor: 'text-red-600',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )
                };
              case 'separated':
                return {
                  label: 'Đã Tách',
                  color: 'from-purple-50 to-pink-50',
                  borderColor: 'border-purple-200',
                  iconBg: 'bg-purple-100',
                  iconColor: 'text-purple-600',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  )
                };
              default:
                return {
                  label: status,
                  color: 'from-gray-50 to-gray-100',
                  borderColor: 'border-gray-200',
                  iconBg: 'bg-gray-100',
                  iconColor: 'text-gray-600',
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  )
                };
            }
          };

          const statusInfo = getStatusInfo(status);
          
          return (
            <div key={status} className={`bg-gradient-to-r ${statusInfo.color} rounded-xl p-6 border ${statusInfo.borderColor}`}>
              <div className="flex items-center">
                <div className={`${statusInfo.iconBg} rounded-lg p-3 mr-4`}>
                  <svg
                    className={`w-6 h-6 ${statusInfo.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {statusInfo.icon}
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{statusInfo.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts[status] || 0}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, Health Check ID, tên người dùng, Blood ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-0 focus:ring-0 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              {uniqueStatuses.map((status) => (
                <option key={status || 'unknown'} value={status || ''}>
                  {status === 'passed' ? 'Đã Qua' : 
                   status === 'failed' ? 'Thất Bại' : 
                   status === 'separated' ? 'Đã Tách' : 
                   status || 'Không xác định'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`px-6 py-4 rounded-xl shadow-lg text-white font-medium ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-red-500 to-pink-500"
          }`}
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {toast.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            {toast.msg}
          </div>
        </div>
      )}

      {/* Available Health Checks for Creating New Records */}
      {availableHealthChecks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Có Thể Tạo Bản Ghi Mới ({availableHealthChecks.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {availableHealthChecks.slice(0, 5).map((healthCheck, index) => (
              <div
                key={healthCheck.healthCheckId}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {getUserName(healthCheck)
                          ?.charAt(0)
                          ?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {getUserName(healthCheck) || 'Unknown User'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {healthCheck.healthCheckId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCreateNew(healthCheck.healthCheckId!)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Tạo
                  </button>
                </div>
              </div>
            ))}
            {availableHealthChecks.length > 5 && (
              <div className="p-4 text-center text-sm text-gray-500 bg-gray-50">
                Và {availableHealthChecks.length - 5} health check khác...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loading || loadingHealthChecks) && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 font-medium">
            Đang tải dữ liệu...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* After Donation Records List */}
      {!loading && !loadingHealthChecks && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Danh Sách Bản Ghi Sau Hiến Máu ({filteredAfterDonationData.length} bản ghi - Trang {currentPage}/{totalPages})
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {currentRecords.map((record, index) => {
              const healthCheck = getHealthCheckByIdForUser(
                record.healthCheckId
              );
              const userName = healthCheck
                ? getUserName(healthCheck)
                : "Unknown User";

              return (
                <div
                  key={record.idAfterDonation}
                  className={`p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Left Section - User & Record Info */}
                    <div className="flex items-center space-x-4 lg:flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {userName?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-bold text-gray-900 truncate">
                            {userName}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === "passed"
                                ? "bg-green-100 text-green-800"
                                : record.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : record.status === "separated"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {record.status === "passed"
                              ? "Đã qua"
                              : record.status === "failed"
                              ? "Thất bại"
                              : record.status === "separated"
                              ? "Đã tách"
                              : record.status || "Không xác định"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800">
                            {record.idAfterDonation}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700">
                            {record.healthCheckId}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800">
                            {record.bloodId}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section - Status Info */}
                    <div className="lg:flex-1 lg:mx-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`rounded-lg p-3 border ${
                            record.infectiousDiseasesChecked
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div
                            className={`text-xs font-medium mb-1 ${
                              record.infectiousDiseasesChecked
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            Kiểm tra bệnh
                          </div>
                          <div
                            className={`text-sm font-bold ${
                              record.infectiousDiseasesChecked
                                ? "text-green-800"
                                : "text-red-800"
                            }`}
                          >
                            {record.infectiousDiseasesChecked
                              ? "✓ Đã kiểm tra"
                              : "✗ Chưa kiểm tra"}
                          </div>
                        </div>
                        <div
                          className={`rounded-lg p-3 border ${
                            record.isBloodUsable
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div
                            className={`text-xs font-medium mb-1 ${
                              record.isBloodUsable
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            Máu sử dụng được
                          </div>
                          <div
                            className={`text-sm font-bold ${
                              record.isBloodUsable
                                ? "text-green-800"
                                : "text-red-800"
                            }`}
                          >
                            {record.isBloodUsable
                              ? "✓ Có thể dùng"
                              : "✗ Không dùng được"}
                          </div>
                        </div>
                      </div>

                      {/* Note */}
                      {record.note && (
                        <div className="mt-3 bg-gray-50 rounded-lg p-2 border border-gray-200">
                          <div className="text-xs font-medium text-gray-600 mb-1">
                            Ghi chú:
                          </div>
                          <div
                            className="text-xs text-gray-700"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {record.note}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="lg:flex-shrink-0">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleManualSeparate(record)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                          Tách máu
                        </button>
                        <button
                          onClick={() => handleDelete(record.idAfterDonation)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination - Always show if there are records */}
          {filteredAfterDonationData.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredAfterDonationData.length)}</span> trong{' '}
                    <span className="font-medium">{filteredAfterDonationData.length}</span> kết quả
                    {filteredAfterDonationData.length > 10 && (
                      <span className="text-gray-500"> (Trang {currentPage}/{totalPages})</span>
                    )}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    {totalPages === 1 && (
                      <button
                        className="relative inline-flex items-center px-4 py-2 border border-blue-500 text-sm font-medium z-10 bg-blue-50 text-blue-600"
                        disabled
                      >
                        1
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredAfterDonationData.length === 0 &&
            afterDonationData.length > 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không tìm thấy kết quả
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Không có bản ghi nào phù hợp với tìm kiếm.
                </p>
              </div>
            )}

          {filteredAfterDonationData.length === 0 &&
            afterDonationData.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Chưa có dữ liệu
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Hiện tại chưa có bản ghi sau hiến máu nào trong hệ thống.
                </p>
              </div>
            )}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && selectedHealthCheckId && (
        <AfterDonationModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          healthCheckId={selectedHealthCheckId}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Manual Separate Modal */}
      {isManualSeparateModalOpen && selectedAfterDonationForSeparate && (
        <ManualSeparateModal
          isOpen={isManualSeparateModalOpen}
          onClose={handleCloseManualSeparateModal}
          afterDonation={selectedAfterDonationForSeparate}
          onSuccess={handleManualSeparateSuccess}
          refreshedAfterDonationData={afterDonationData}
        />
      )}
    </div>
  );
}

export default AfterDonationManage;
