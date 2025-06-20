import { DonationHistoryItem, DonationStats, HistoryFilters } from '../types/history.types';

class HistoryService {
  private baseUrl = '/api/donations/history';

  async getDonationHistory(
    page = 1, 
    limit = 10, 
    filters?: HistoryFilters
  ): Promise<{
    donations: DonationHistoryItem[];
    total: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters) {
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start.toISOString());
        params.append('endDate', filters.dateRange.end.toISOString());
      }
      if (filters.bloodType) params.append('bloodType', filters.bloodType);
      if (filters.component) params.append('component', filters.component);
      if (filters.status) params.append('status', filters.status);
      if (filters.hospital) params.append('hospital', filters.hospital);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }

    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch donation history');
    }

    return response.json();
  }

  async getDonationStats(): Promise<DonationStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch donation stats');
    }

    return response.json();
  }

  async getDonationById(id: string): Promise<DonationHistoryItem> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch donation details');
    }

    return response.json();
  }

  async exportHistory(format: 'pdf' | 'csv' = 'pdf'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to export history');
    }

    return response.blob();
  }

  async getNextEligibleDate(): Promise<Date | null> {
    const response = await fetch(`${this.baseUrl}/next-eligible`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch next eligible date');
    }

    const data = await response.json();
    return data.nextEligibleDate ? new Date(data.nextEligibleDate) : null;
  }
}

export const historyService = new HistoryService();