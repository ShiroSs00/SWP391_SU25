import api from '../../../services/axios/api';
import type { AccountsResponse } from '../types/accounts-manage.types';

// Get all accounts
export const getPagedAccounts = async (): Promise<AccountsResponse> => {
  const response = await api.get<AccountsResponse>('/accounts');
  return response.data;
};

// Toggle account status (activate/deactivate)
export const activateAccount = async (accountId: string): Promise<boolean> => {
  try {
    const response = await api.put(`/accounts/${accountId}/activate`);
    return response.data.success;
  } catch (error) {
    console.error('Error activating account:', error);
    return false;
  }
};

export const deactivateAccount = async (accountId: string): Promise<boolean> => {
  try {
    const response = await api.put(`/accounts/${accountId}/deactivate`);
    return response.data.success;
  } catch (error) {
    console.error('Error deactivating account:', error);
    return false;
  }
};

// Change user role
export const changeUserRole = async (username: string, newRole: string): Promise<boolean> => {
  try {
    const response = await api.put(`/accounts/${username}/role?newRole=${newRole}`);
    return response.data.success;
  } catch (error) {
    console.error('Error changing user role:', error);
    return false;
  }
};
