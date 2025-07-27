import api from "../../../services/axios/api"
import type { ProfileData, DonationRecord, Achievement, PointsData, EventParticipation, FeedbackItem } from '../types/dashboard.type';
import { type ApiResponse, type AdminEvent } from "../../event/types/admin.types";

// ==================== PROFILE SERVICES ====================
export const getProfile = async (): Promise<ProfileData> => {
  const response = await api.get('/profile');
  const data = response.data.data;

  return {
    id: data.profileId || data.accountId,
    name: data.name || data.username,
    email: data.email,
    phone: data.phone,
    gender: data.gender ? 'Male' : 'Female', // Assuming boolean from API
    birthDate: data.dob,
    bloodType: data.bloodType,
    avatar: data.avatar,
    isAvailableToDonate: data.isActive || true,
    temporaryDeferral: !data.isActive || false,
    notificationRange: 5, // Default value
    emergencyNotifications: true,
    getNotifications: true,
    sendToFamily: false,
    rangeNotifications: 5,
    // Additional API fields
    accountId: data.accountId,
    address: data.address ? `${data.address.street}, ${data.address.ward}, ${data.address.district}, ${data.address.city}` : '',
    dateCreated: data.creationDate,
    status: data.isActive ? 'Active' : 'Inactive'
  };
};

export const updateProfile = async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
  const response = await api.put('/profile', {
    name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
    gender: profileData.gender === 'Male',
    dob: profileData.birthDate,
    bloodType: profileData.bloodType,
    isActive: profileData.isAvailableToDonate
  });

  return getProfile(); // Refresh profile data
};

// ==================== DONATION HISTORY SERVICES ====================
// Thay thế phần getDonationHistory trong service của bạn
export const getDonationHistory = async (): Promise<DonationRecord[]> => {
  try {
    const profile = await getProfile();
    const response = await getBloodDonationHistoryByAccountId(profile.accountId);

    let donations = [];
    if (response.data && Array.isArray(response.data.data)) {
      donations = response.data.data;
    } else if (response.data && Array.isArray(response.data)) {
      donations = response.data;
    } else if (Array.isArray(response)) {
      donations = response;
    }

    console.log('=== FULL DONATIONS ARRAY ===');
    console.log('Donations array:', donations);
    console.log('Array length:', donations.length);

    return donations.map((item: any, index: number) => {
      console.log(`\n=== PROCESSING DONATION ${index} ===`);
      console.log('Raw item from API:', JSON.stringify(item, null, 2));
      console.log('Available keys:', Object.keys(item));

      // Test all possible ID fields
      const possibleIds = [
        item.registerId,
        item.registrationId,
        item.donationId,
        item.bloodDonationId,
        item.donationRegisterId,
        item.eventRegistrationId,
        item.participationId,
        item.id
      ];

      console.log('Possible ID values:', possibleIds);

      // Find the first non-empty ID
      const actualRegisterId = possibleIds.find(id => id && id !== '' && id !== null && id !== undefined) || '';

      console.log('Selected registerId:', actualRegisterId);

      const mapped = {
        id: item.id,
        name: item.name,
        event: item.event || '',
        bloodCode: item.bloodCode || '',
        healthCheck: item.healthCheck || '',
        afterDonationBlood: item.afterDonationBlood || '',
        status: item.status,
        type: 'donation' as const,
        registerId: actualRegisterId, // Use the found ID
      };

      console.log('Final mapped object:', mapped);
      return mapped;
    });
  } catch (error) {
    console.error('Error fetching donation history:', error);
    return [];
  }
};

export const getBloodDonationHistoryByAccountId = async (accountId: string) => {
  try {
    const response = await api.get(`/blood-donation-history/${accountId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blood donation history:", error);
    throw error; // Hoặc return null/[] tùy use-case
  }
};

export const getBloodDonationHistory = async () => {
  try {
    const response = await api.get(`/blood-donation-history/`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blood donation history:", error);
    throw error; // Hoặc return null/[] tùy use-case
  }
};

// ==================== BLOOD REQUEST HISTORY (RECEIVING) ====================
// ==================== BLOOD REQUEST UPDATE SERVICE ====================
export const updateBloodRequest = async (
  bloodRequestId: string,
  updateData: {
    requestDate?: string,
    bloodType?: string;
    component?: string;
    volume?: number;
    emergency?: boolean;
  }
): Promise<any> => {
  try {
    const response = await api.put(`/blood-requests/update/${bloodRequestId}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating blood request:', error);
    throw error;
  }
};
// ==================== BLOOD REQUEST HISTORY (RECEIVING) ====================
export const getReceivingHistory = async (): Promise<DonationRecord[]> => {
  try {
    const response = await api.get('/blood-requests/my-requests');
    let receivingRecords = [];

    if (response.data && Array.isArray(response.data.data)) {
      receivingRecords = response.data.data;
    } else if (response.data && Array.isArray(response.data)) {
      receivingRecords = response.data;
    } else if (Array.isArray(response)) {
      receivingRecords = response;
    } else {
      console.log('Unexpected response structure:', response);
      return [];
    }

    return receivingRecords.map((item: any) => ({
      id: item.idBloodRequest,
      name: item.requesterName,
      event: '', // Blood requests không có event
      bloodCode: item.bloodBagId || '', // Sử dụng bloodBagId làm bloodCode
      volumeToTake: parseInt(item.volume),
      healCheck: '', // Blood request không có health check
      afterDonationBlood: '', // Blood request không có after donation
      status: mapBloodRequestStatus(item.status),
      type: 'receiving' as const,
      feedback: '', // Có thể thêm feedback sau
      date: item.requestDate || item.requestCreationDate || new Date().toISOString(),
      location: item.requesterAddress || 'Không có thông tin địa điểm',
      registrationId: item.idBloodRequest,

      // Thêm các field đặc thù của blood request
      requesterName: item.requesterName,
      requesterPhone: item.requesterPhone,
      requesterEmail: item.requesterEmail,
      requesterAddress: item.requesterAddress,
      bloodType: item.bloodType,
      component: item.component,
      volume: item.volume,
      emergency: item.emergency,
      requestCreationDate: item.requestCreationDate,
      processedBy: item.processedBy,
      processedDate: item.processedDate,
      rejectionReason: item.rejectionReason,
      contactPhone: item.contactPhone,
      contactEmail: item.contactEmail,
      requestDate: item.requestDate
    }));
  } catch (error) {
    console.error('Error fetching receiving history:', error);
    return [];
  }
};

// Helper function để map status từ API sang format hiển thị
const mapBloodRequestStatus = (apiStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    'PENDING': 'Pending',
    'APPROVED': 'Approved',
    'REJECTED': 'Rejected',
    'CANCELLED': 'Cancelled'
  };

  return statusMap[apiStatus] || apiStatus;
};


// dashboard.service.ts - Fixed version
export const getHealthCheckByRegisterId = async (registrationId: string, token: string) => {
  console.log('=== API SERVICE DEBUG ===');
  console.log('Input registerId:', registrationId);
  console.log('Input type:', typeof registrationId);
  console.log('Token present:', !!token);

  // Validate registerId
  if (!registrationId || registrationId === 'undefined' || registrationId === 'null') {
    console.error('Invalid registerId provided to API service');
    return {
      success: false,
      data: null,
      message: 'Invalid registerId provided'
    };
  }

  try {
    const fullUrl = `/healthcheck/get-by-registration/${registrationId}`;
    console.log('Full API URL:', fullUrl);
    console.log('Making API call...');

    const response = await api.get(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('API Response received:', response);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Success'
    };
  } catch (error: any) {
    console.error("=== API ERROR DEBUG ===");
    console.error("Error object:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);

    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch health check data'
    };
  }
};

export const getAfterDonationByHealthCheckId = async (healthCheckId: string, token: string) => {
  try {
    const response = await api.get(`/after-donation/get-by-healthcheck/${healthCheckId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    // Return consistent structure
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Success'
    };
  } catch (error: any) {
    console.error("Error fetching after-donation:", error);

    // Return consistent error structure
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch after donation data'
    };
  }
};

// ==================== ACHIEVEMENTS SERVICES ====================
export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const response = await api.get('/achievements/getbyaccount');
    // Handle different response structures
    let achievements = []
    if (response.data && Array.isArray(response.data.data)) {
      achievements = response.data.data
    } else if (response.data && Array.isArray(response.data)) {
      achievements = response.data
    } else if (Array.isArray(response)) {
      achievements = response
    } else {
      console.log('Unexpected achievements response structure:', response)
      return []
    }

    return achievements.map((item: any) => ({
      id: item.achievementId || item.id,
      title: item.achievementName || item.name,
      description: item.description,
      icon: getAchievementIcon(item.achievementName),
      tier: getAchievementTier(item.minValue, item.maxValue),
      isUnlocked: item.achieved || false,
      progress: item.currentValue || 0,
      maxProgress: item.maxValue || item.target || 1,
      dateUnlocked: item.achieved ? item.dateCreated : undefined,
      // Additional fields
      achievementId: item.achievementId,
      achievementName: item.achievementName,
      achieved: item.achieved,
      minValue: item.minValue,
      maxValue: item.maxValue,

    }));
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
};

// Helper function to determine achievement icon
const getAchievementIcon = (achievementName: string): string => {
  if (achievementName?.toLowerCase().includes('first') || achievementName?.toLowerCase().includes('đầu')) return 'Heart';
  if (achievementName?.toLowerCase().includes('event') || achievementName?.toLowerCase().includes('sự kiện')) return 'Calendar';
  if (achievementName?.toLowerCase().includes('donation') || achievementName?.toLowerCase().includes('hiến')) return 'Droplet';
  if (achievementName?.toLowerCase().includes('hero') || achievementName?.toLowerCase().includes('anh hùng')) return 'Star';
  return 'Award';
};

// Helper function to determine achievement tier
const getAchievementTier = (minValue: number, maxValue: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' => {
  if (maxValue <= 1) return 'Bronze';
  if (maxValue <= 5) return 'Silver';
  if (maxValue <= 10) return 'Gold';
  return 'Platinum';
};

// ==================== POINTS DATA ====================
export const getPointsData = async (): Promise<PointsData> => {
  try {
    const [donations, achievements] = await Promise.all([
      getDonationHistory(),
      getAchievements()
    ]);

    // Calculate points based on donations and achievements
    const completedDonations = donations.filter(d => d.status === 'Completed' || d.status === 'Success');
    const unlockedAchievements = achievements.filter(a => a.isUnlocked);

    const donationPoints = completedDonations.length * 500;
    const achievementPoints = unlockedAchievements.length * 100;
    const totalPoints = donationPoints + achievementPoints;

    const breakdown = [
      ...completedDonations.map(d => ({
        source: `Hiến máu ${d.volume}ml`,
        points: 500,
        date: d.date
      })),
      ...unlockedAchievements.filter(a => a.dateUnlocked).map(a => ({
        source: `Thành tích: ${a.title}`,
        points: 100,
        date: a.dateUnlocked!
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      totalPoints,
      breakdown,
      availableRewards: [
        { id: '1', title: 'Voucher khám sức khỏe', cost: 2000, description: 'Voucher khám sức khỏe tổng quát tại bệnh viện đối tác' },
        { id: '2', title: 'Áo thun BloodConnect', cost: 800, description: 'Áo thun kỷ niệm với logo BloodConnect cao cấp' },
        { id: '3', title: 'Cốc giữ nhiệt', cost: 500, description: 'Cốc giữ nhiệt cao cấp với thiết kế đặc biệt' },
        { id: '4', title: 'Túi tote BloodConnect', cost: 300, description: 'Túi tote canvas với thiết kế độc quyền' }
      ]
    };
  } catch (error) {
    console.error('Error calculating points data:', error);
    return {
      totalPoints: 0,
      breakdown: [],
      availableRewards: []
    };
  }
};

// ==================== EVENT PARTICIPATION SERVICES ====================
export const getEventParticipations = async (): Promise<EventParticipation[]> => {
  try {
    const response = await api.get('/event/getall');
    const events = response.data.data || response.data || [];

    // Get user's donation history to determine participation
    const donations = await getDonationHistory();
    const participatedEventIds = donations.map(d => d.event).filter(Boolean);

    return events
      .filter((event: any) => participatedEventIds.includes(event.id))
      .map((item: any) => ({
        id: item.id,
        eventName: item.name,
        date: item.startDate,
        location: item.location || 'Chưa cập nhật',
        role: 'Donor' as const,
        banner: item.image,
        status: new Date(item.startDate) > new Date() ? 'Upcoming' : 'Completed',
        // Additional fields
        eventId: item.id,
        name: item.name,
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description
      }));
  } catch (error) {
    console.error('Error fetching event participations:', error);
    return [];
  }
};

// ==================== FEEDBACK SERVICES ====================
export const getFeedback = async (): Promise<FeedbackItem[]> => {
  try {
    const response = await api.get('/feedback/getall');
    const feedbacks = response.data.data || response.data || [];

    return feedbacks.map((item: any) => ({
      id: item.id,
      relatedRecordId: item.registrationId,
      message: item.message,
      rating: item.rating || 5,
      date: item.dateCreated,
      response: item.adminResponse,
      // Additional fields
      registrationId: item.registrationId,
      dateCreated: item.dateCreated,
      dateUpdated: item.dateUpdated
    }));
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
};

export const submitFeedback = async (feedback: {
  message: string;
  rating: number;
  relatedRecordId: string;
}): Promise<FeedbackItem> => {
  const response = await api.post(`/feedback/create/${feedback.relatedRecordId}`, {
    message: feedback.message,
    rating: feedback.rating
  });

  const newFeedback = response.data.data || response.data;
  return {
    id: newFeedback.id,
    relatedRecordId: feedback.relatedRecordId,
    message: feedback.message,
    rating: feedback.rating,
    date: new Date().toISOString(),
    response: newFeedback.adminResponse
  };
};

export const updateFeedback = async (
  registrationId: string,
  feedback: { message: string; rating: number }
): Promise<FeedbackItem> => {
  const response = await api.put(`/feedback/update/${registrationId}`, feedback);
  const updatedFeedback = response.data.data || response.data;

  return {
    id: updatedFeedback.id,
    relatedRecordId: registrationId,
    message: feedback.message,
    rating: feedback.rating,
    date: updatedFeedback.dateUpdated || new Date().toISOString(),
    response: updatedFeedback.adminResponse
  };
};

// ==================== ADDITIONAL SERVICES ====================

// Get emergency blood requests
export const getEmergencyRequests = async () => {
  try {
    const response = await api.get('/blood-requests/emergency');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching emergency requests:', error);
    return [];
  }
};

export const getAllEvents = async (): Promise<AdminEvent[]> => {
  try {
    const res = await api.get<ApiResponse<AdminEvent[]>>('/event/getall');

    // VALIDATION: Kiểm tra response structure
    if (!res.data) {
      throw new Error('Không nhận được dữ liệu từ server');
    }

    if (!Array.isArray(res.data.data)) {
      throw new Error('Dữ liệu trả về không đúng định dạng');
    }

    return res.data.data;
  } catch (error: any) {
    // ENHANCED ERROR HANDLING
    if (error.code === 'ERR_NETWORK') {
      const networkError = new Error('Lỗi kết nối mạng');
      (networkError as any).code = 'NETWORK_ERROR';
      throw networkError;
    }

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 404:
          throw new Error('Không tìm thấy dữ liệu sự kiện');
        case 500:
          throw new Error('Lỗi server nội bộ');
        case 403:
          throw new Error('Không có quyền truy cập');
        case 401:
          throw new Error('Phiên đăng nhập đã hết hạn');
        default:
          throw new Error(message || `Lỗi server (${status})`);
      }
    }

    // Re-throw the original error if it's already processed
    throw error;
  }
};

// Get events by date range
export const getEventsByDateRange = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get('/event/by-end-date-range', {
      params: { startDate, endDate }
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    return [];
  }
};

// Create achievement (for admin use)
export const createAchievement = async (achievementData: {
  achievementName: string;
  description: string;
  minValue: number;
  maxValue: number;
}) => {
  try {
    const response = await api.post('/achievements/create', achievementData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
};

// Reward redemption (placeholder - implement based on your rewards system)
export const redeemReward = async (rewardId: string): Promise<void> => {
  try {
    // This would be implemented when you have a rewards API
    console.log(`Redeeming reward ${rewardId}...`);

    // For now, we'll simulate the redemption
    await new Promise(resolve => setTimeout(resolve, 1000));

    // You might want to create an API endpoint like:
    // await api.post(`/rewards/${rewardId}/redeem`);

    console.log(`Reward ${rewardId} redeemed successfully`);
  } catch (error) {
    console.error('Error redeeming reward:', error);
    throw error;
  }
};

// Get optimized donor search (for emergency situations)
export const getOptimizedDonors = async () => {
  try {
    const response = await api.get('/search/donors/optimized');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching optimized donors:', error);
    return [];
  }
};

// Validate authentication
export const validateAuth = async () => {
  try {
    const response = await api.get('/auth/validate');
    return response.data.success || false;
  } catch (error) {
    console.error('Error validating auth:', error);
    return false;
  }
};

