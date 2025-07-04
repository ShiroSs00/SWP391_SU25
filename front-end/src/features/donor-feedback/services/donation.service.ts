import { DonationRegistration, DonationFilters, DonationResponse } from '../types/donation.types';

const API_BASE_URL = '/api/donation';

class DonationService {
  // Lấy tất cả donation registrations
  async getAllDonations(filters?: DonationFilters): Promise<DonationResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/getall?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể tải danh sách đăng ký hiến máu');
    }

    return response.json();
  }

  // Tạo link feedback cho donation
  generateFeedbackLink(registrationId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/feedback/user?registrationId=${registrationId}`;
  }
}

export const donationService = new DonationService();