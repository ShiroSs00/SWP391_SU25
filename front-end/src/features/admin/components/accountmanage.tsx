import React, { useState } from 'react';
import { useAccountsManage, useAccountOperations, useAccountFilters } from '../hooks/useAccountsManage';
import { AccountRole } from '../types/accounts-manage.types';
import { FaSearch, FaFilter, FaSort, FaEye, FaEyeSlash, FaToggleOn, FaToggleOff, FaUserCog } from 'react-icons/fa';

const AccountManage: React.FC<{ showToast?: (msg: string, type?: 'success' | 'error') => void }> = ({ showToast }) => {
  const { accounts, loading, error, refreshAccounts } = useAccountsManage();
  const { activateAccount, deactivateAccount, changeRole, loading: operationLoading } = useAccountOperations();
  const { 
    filteredAccounts, 
    searchTerm, 
    setSearchTerm, 
    roleFilter, 
    setRoleFilter, 
    sortBy, 
    setSortBy, 
    sortDirection, 
    setSortDirection, 
    clearFilters 
  } = useAccountFilters(accounts);

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<{ username: string; currentRole: string } | null>(null);
  const [newRole, setNewRole] = useState('');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedAccountForAction, setSelectedAccountForAction] = useState<{ accountId: string; userName: string } | null>(null);
  const itemsPerPage = 10;

  const handleActivate = (accountId: string, userName: string) => {
    setSelectedAccountForAction({ accountId, userName });
    setShowActivateModal(true);
  };

  const handleDeactivate = (accountId: string, userName: string) => {
    setSelectedAccountForAction({ accountId, userName });
    setShowDeactivateModal(true);
  };

  const handleActivateConfirm = async () => {
    if (!selectedAccountForAction) return;

    const success = await activateAccount(selectedAccountForAction.accountId);
    if (success) {
      if (showToast) showToast('Kích hoạt tài khoản thành công', 'success');
      refreshAccounts();
    } else if (showToast) {
      showToast('Kích hoạt tài khoản thất bại', 'error');
    }
    
    setShowActivateModal(false);
    setSelectedAccountForAction(null);
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedAccountForAction) return;

    const success = await deactivateAccount(selectedAccountForAction.accountId);
    if (success) {
      if (showToast) showToast('Vô hiệu hóa tài khoản thành công', 'success');
      refreshAccounts();
    } else if (showToast) {
      showToast('Vô hiệu hóa tài khoản thất bại', 'error');
    }
    
    setShowDeactivateModal(false);
    setSelectedAccountForAction(null);
  };

  const handleActivateCancel = () => {
    setShowActivateModal(false);
    setSelectedAccountForAction(null);
  };

  const handleDeactivateCancel = () => {
    setShowDeactivateModal(false);
    setSelectedAccountForAction(null);
  };

  const handleChangeRole = (username: string, currentRole: string) => {
    setSelectedUserForRole({ username, currentRole });
    setNewRole(currentRole);
    setShowRoleModal(true);
  };

  const handleRoleSubmit = async () => {
    if (!selectedUserForRole || !newRole) return;

    const success = await changeRole(selectedUserForRole.username, newRole);
    if (success) {
      if (showToast) showToast('Thay đổi vai trò thành công', 'success');
      refreshAccounts();
      setShowRoleModal(false);
      setSelectedUserForRole(null);
      setNewRole('');
    } else if (showToast) {
      showToast('Thay đổi vai trò thất bại', 'error');
    }
  };

  const handleRoleCancel = () => {
    setShowRoleModal(false);
    setSelectedUserForRole(null);
    setNewRole('');
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && paginatedAccounts.length > 0) {
      setSelectedAccounts(paginatedAccounts.map(account => account.accountId));
    } else {
      setSelectedAccounts([]);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedAccounts([]); // Clear selections when changing page
  };

  const getPaginationPages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case AccountRole.ADMIN: return 'bg-red-100 text-red-800';
      case AccountRole.STAFF: return 'bg-blue-100 text-blue-800';
      case AccountRole.MEMBER: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý tài khoản</h2>
            <p className="text-gray-600 mt-1">Quản lý trạng thái tài khoản người dùng trong hệ thống</p>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FaFilter className="w-4 h-4 text-gray-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Tất cả vai trò</option>
              <option value={AccountRole.ADMIN}>Admin</option>
              <option value={AccountRole.STAFF}>Staff</option>
              <option value={AccountRole.MEMBER}>Member</option>
            </select>
          </div>
          
          {(searchTerm || roleFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <span className="text-gray-600 font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 bg-red-50 rounded-lg p-6 mx-6">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-red-800">{error}</p>
            </div>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-600">
                {searchTerm || roleFilter ? 'Không tìm thấy tài khoản nào' : 'Chưa có tài khoản nào'}
              </p>
              <p className="text-gray-500 mt-2">
                {searchTerm || roleFilter ? 'Thử thay đổi bộ lọc' : 'Hãy thêm tài khoản đầu tiên'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={paginatedAccounts.length > 0 && selectedAccounts.length === paginatedAccounts.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('userName')}
                  >
                    <div className="flex items-center gap-1">
                      Tên người dùng
                      <FaSort className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      <FaSort className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mật khẩu
                  </th>
                  <th 
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Vai trò
                      <FaSort className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('creationDate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Ngày tạo
                      <FaSort className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAccounts.map((account) => (
                  <tr key={account.accountId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAccounts.includes(account.accountId)}
                        onChange={() => toggleAccountSelection(account.accountId)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-red-600 font-medium text-sm">
                              {account.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{account.userName}</div>
                          <div className="text-sm text-gray-500">ID: {account.accountId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{account.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-600">
                          {showPasswords[account.accountId] ? account.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(account.accountId)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords[account.accountId] ? (
                            <FaEyeSlash className="w-4 h-4" />
                          ) : (
                            <FaEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(account.role)}`}>
                        {account.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{formatDate(account.creationDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 transition-colors"
                          onClick={() => handleChangeRole(account.userName, account.role)}
                          disabled={operationLoading}
                        >
                          <FaUserCog className="w-3 h-3 mr-1" /> Phân quyền
                        </button>
                        <button 
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 focus:ring-2 focus:ring-green-500 transition-colors"
                          onClick={() => handleActivate(account.accountId, account.userName)}
                          disabled={operationLoading}
                        >
                          <FaToggleOn className="w-3 h-3 mr-1" /> Kích hoạt
                        </button>
                        <button 
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded-lg hover:bg-orange-200 focus:ring-2 focus:ring-orange-500 transition-colors"
                          onClick={() => handleDeactivate(account.accountId, account.userName)}
                          disabled={operationLoading}
                        >
                          <FaToggleOff className="w-3 h-3 mr-1" /> Vô hiệu hóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">{startIndex + 1}</span>
                    {' '}đến{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredAccounts.length)}</span>
                    {' '}trong tổng số{' '}
                    <span className="font-medium">{filteredAccounts.length}</span>
                    {' '}tài khoản
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Trang trước</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {getPaginationPages().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-red-50 border-red-500 text-red-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Trang sau</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Thay đổi vai trò</h3>
              <button
                onClick={handleRoleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Thay đổi vai trò cho người dùng: <span className="font-medium">{selectedUserForRole?.username}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Vai trò hiện tại: <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(selectedUserForRole?.currentRole || '')}`}>
                  {selectedUserForRole?.currentRole}
                </span>
              </p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Vai trò mới</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  <option value={AccountRole.MEMBER}>Member</option>
                  <option value={AccountRole.STAFF}>Staff</option>
                  <option value={AccountRole.ADMIN}>Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleRoleCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                disabled={operationLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleRoleSubmit}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={operationLoading || newRole === selectedUserForRole?.currentRole}
              >
                {operationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Đang thay đổi...
                  </>
                ) : (
                  'Thay đổi'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activate Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Kích hoạt tài khoản</h3>
              <button
                onClick={handleActivateCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                <FaToggleOn className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-center text-gray-600 mb-2">
                Bạn chắc chắn muốn kích hoạt tài khoản?
              </p>
              <p className="text-center text-lg font-medium text-gray-800">
                {selectedAccountForAction?.userName}
              </p>
              <p className="text-center text-sm text-gray-500 mt-1">
                Tài khoản sẽ được kích hoạt và người dùng có thể đăng nhập
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleActivateCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                disabled={operationLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleActivateConfirm}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={operationLoading}
              >
                {operationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Đang kích hoạt...
                  </>
                ) : (
                  <>
                    <FaToggleOn className="w-4 h-4" />
                    Kích hoạt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Vô hiệu hóa tài khoản</h3>
              <button
                onClick={handleDeactivateCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full">
                <FaToggleOff className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-center text-gray-600 mb-2">
                Bạn chắc chắn muốn vô hiệu hóa tài khoản?
              </p>
              <p className="text-center text-lg font-medium text-gray-800">
                {selectedAccountForAction?.userName}
              </p>
              <p className="text-center text-sm text-gray-500 mt-1">
                Tài khoản sẽ bị vô hiệu hóa và người dùng không thể đăng nhập
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeactivateCancel}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                disabled={operationLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleDeactivateConfirm}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={operationLoading}
              >
                {operationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Đang vô hiệu hóa...
                  </>
                ) : (
                  <>
                    <FaToggleOff className="w-4 h-4" />
                    Vô hiệu hóa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Footer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tổng:</span> {accounts.length} tài khoản
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tìm thấy:</span> {filteredAccounts.length} tài khoản
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Hiển thị:</span> {paginatedAccounts.length} tài khoản
            </div>
            {selectedAccounts.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Đã chọn:</span> {selectedAccounts.length} tài khoản
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="text-sm text-gray-500">
              Sắp xếp theo: <span className="font-medium">{sortBy}</span> ({sortDirection})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManage;
