import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPagedAccounts, activateAccount, deactivateAccount, changeUserRole } from '../services/account-manage.services';
import type { Account, AccountsResponse } from '../types/accounts-manage.types';

export interface UseAccountsManageReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
  totalAccounts: number;
  success: boolean;
}

export const useAccountsManage = (): UseAccountsManageReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: AccountsResponse = await getPagedAccounts();
      
      if (response.success) {
        setAccounts(response.data);
        setSuccess(true);
      } else {
        setError(response.message || 'Không thể tải danh sách tài khoản');
        setSuccess(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách tài khoản';
      setError(errorMessage);
      setSuccess(false);
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAccounts = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    refreshAccounts,
    totalAccounts: accounts.length,
    success
  };
};

// Hook for individual account operations
export interface UseAccountOperationsReturn {
  createAccount: (accountData: Omit<Account, 'accountId' | 'creationDate'>) => Promise<boolean>;
  updateAccount: (accountId: string, accountData: Partial<Account>) => Promise<boolean>;
  deleteAccount: (accountId: string) => Promise<boolean>;
  activateAccount: (accountId: string) => Promise<boolean>;
  deactivateAccount: (accountId: string) => Promise<boolean>;
  changeRole: (username: string, newRole: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useAccountOperations = (): UseAccountOperationsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAccount = useCallback(async (accountData: Omit<Account, 'accountId' | 'creationDate'>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement createAccount API call when endpoint is available
      console.log('Creating account:', accountData);
      // const response = await createAccountAPI(accountData);
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo tài khoản';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const updateAccount = useCallback(async (accountId: string, accountData: Partial<Account>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement updateAccount API call when endpoint is available
      console.log('Updating account:', accountId, accountData);
      // const response = await updateAccountAPI(accountId, accountData);
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật tài khoản';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const deleteAccount = useCallback(async (accountId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement deleteAccount API call when endpoint is available
      console.log('Deleting account:', accountId);
      // const response = await deleteAccountAPI(accountId);
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa tài khoản';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const activateAccountHandler = useCallback(async (accountId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await activateAccount(accountId);
      setLoading(false);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi kích hoạt tài khoản';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const deactivateAccountHandler = useCallback(async (accountId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await deactivateAccount(accountId);
      setLoading(false);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi vô hiệu hóa tài khoản';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const changeRoleHandler = useCallback(async (username: string, newRole: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await changeUserRole(username, newRole);
      setLoading(false);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi thay đổi vai trò';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    createAccount,
    updateAccount,
    deleteAccount,
    activateAccount: activateAccountHandler,
    deactivateAccount: deactivateAccountHandler,
    changeRole: changeRoleHandler,
    loading,
    error
  };
};

// Hook for account filtering and searching
export interface UseAccountFiltersReturn {
  filteredAccounts: Account[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  clearFilters: () => void;
}

export const useAccountFilters = (accounts: Account[]): UseAccountFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('creationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAccounts = useMemo(() => {
    let filtered = [...accounts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(account => 
        account.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(account => account.role === roleFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Account];
      const bValue = b[sortBy as keyof Account];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [accounts, searchTerm, roleFilter, sortBy, sortDirection]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setRoleFilter('');
    setSortBy('creationDate');
    setSortDirection('desc');
  }, []);

  return {
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
  };
};
