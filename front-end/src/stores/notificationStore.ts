import { create } from 'zustand';
import { NotificationType, NotificationPriority } from '../utils/enums';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    requestId?: string;
    donationId?: string;
    appointmentId?: string;
    userId?: string;
  };
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    appointmentReminders: boolean;
    emergencyRequests: boolean;
    donationThankYou: boolean;
    systemAlerts: boolean;
    inventoryAlerts: boolean;
    achievements: boolean;
  };
  sms: {
    enabled: boolean;
    emergencyOnly: boolean;
    appointmentReminders: boolean;
    urgentRequests: boolean;
  };
  push: {
    enabled: boolean;
    all: boolean;
    emergencyOnly: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  inApp: {
    enabled: boolean;
    showBadge: boolean;
    autoMarkRead: boolean;
    soundEnabled: boolean;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;
  
  // Real-time connection status
  isConnected: boolean;
  lastSync: string | null;
}

interface NotificationActions {
  // Fetch notifications
  fetchNotifications: (limit?: number, offset?: number) => Promise<void>;
  
  // Mark notifications as read
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  
  // Delete notifications
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  
  // Create notification (for testing/admin)
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  
  // Settings management
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  
  // Real-time notifications
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;
  
  // Emergency notifications
  sendEmergencyAlert: (message: string, targetUsers?: string[]) => Promise<void>;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useNotificationStore = create<NotificationState & NotificationActions>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  settings: {
    email: {
      enabled: true,
      appointmentReminders: true,
      emergencyRequests: true,
      donationThankYou: true,
      systemAlerts: true,
      inventoryAlerts: false,
      achievements: true
    },
    sms: {
      enabled: true,
      emergencyOnly: false,
      appointmentReminders: true,
      urgentRequests: true
    },
    push: {
      enabled: true,
      all: true,
      emergencyOnly: false,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00'
      }
    },
    inApp: {
      enabled: true,
      showBadge: true,
      autoMarkRead: false,
      soundEnabled: true
    }
  },
  isLoading: false,
  error: null,
  isConnected: false,
  lastSync: null,

  // Actions
  fetchNotifications: async (limit = 50, offset = 0) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: NotificationType.URGENT_REQUEST,
          priority: NotificationPriority.CRITICAL,
          title: 'Yêu cầu máu khẩn cấp',
          message: 'Bệnh viện Chợ Rẫy cần máu O- khẩn cấp cho bệnh nhân tai nạn giao thông',
          isRead: false,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
          actionUrl: '/blood-requests/emergency',
          actionLabel: 'Xem chi tiết',
          metadata: {
            requestId: 'req_001'
          }
        },
        {
          id: '2',
          type: NotificationType.APPOINTMENT_REMINDER,
          priority: NotificationPriority.HIGH,
          title: 'Nhắc nhở lịch hẹn hiến máu',
          message: 'Bạn có lịch hẹn hiến máu vào ngày mai lúc 9:00 AM tại Bệnh viện Tâm Đức',
          isRead: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          actionUrl: '/appointments/upcoming',
          actionLabel: 'Xem lịch hẹn',
          metadata: {
            appointmentId: 'apt_001'
          }
        },
        {
          id: '3',
          type: NotificationType.ACHIEVEMENT_UNLOCKED,
          priority: NotificationPriority.MEDIUM,
          title: 'Thành tích mới!',
          message: 'Chúc mừng! Bạn đã đạt được thành tích "Người hùng cứu người" với 10 lần hiến máu',
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          actionUrl: '/achievements',
          actionLabel: 'Xem thành tích'
        },
        {
          id: '4',
          type: NotificationType.ELIGIBILITY_RESTORED,
          priority: NotificationPriority.MEDIUM,
          title: 'Đủ điều kiện hiến máu trở lại',
          message: 'Bạn đã đủ điều kiện để hiến máu trở lại. Hãy đăng ký lịch hẹn mới!',
          isRead: false,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          actionUrl: '/donate/schedule',
          actionLabel: 'Đăng ký hiến máu'
        },
        {
          id: '5',
          type: NotificationType.DONATION_THANK_YOU,
          priority: NotificationPriority.LOW,
          title: 'Cảm ơn bạn đã hiến máu!',
          message: 'Máu của bạn đã được sử dụng để cứu sống 3 bệnh nhân. Cảm ơn sự hào phóng của bạn!',
          isRead: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          metadata: {
            donationId: 'don_001'
          }
        }
      ];
      
      const unreadCount = mockNotifications.filter(n => !n.isRead).length;
      
      set({
        notifications: mockNotifications,
        unreadCount,
        isLoading: false,
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      set({
        error: 'Không thể tải thông báo',
        isLoading: false
      });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        const updatedNotifications = state.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount
        };
      });
    } catch (error) {
      set({ error: 'Không thể đánh dấu đã đọc' });
    }
  },

  markAllAsRead: async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0
      }));
    } catch (error) {
      set({ error: 'Không thể đánh dấu tất cả đã đọc' });
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        const updatedNotifications = state.notifications.filter(
          notification => notification.id !== notificationId
        );
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount
        };
      });
    } catch (error) {
      set({ error: 'Không thể xóa thông báo' });
    }
  },

  clearAllNotifications: async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({
        notifications: [],
        unreadCount: 0
      });
    } catch (error) {
      set({ error: 'Không thể xóa tất cả thông báo' });
    }
  },

  createNotification: async (notification) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}`,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      
      set(state => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }));
    } catch (error) {
      set({ error: 'Không thể tạo thông báo' });
    }
  },

  updateSettings: async (newSettings) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        settings: { ...state.settings, ...newSettings },
        isLoading: false
      }));
    } catch (error) {
      set({
        error: 'Không thể cập nhật cài đặt thông báo',
        isLoading: false
      });
    }
  },

  subscribeToNotifications: () => {
    // Mock WebSocket connection
    set({ isConnected: true });
    
    // Simulate receiving real-time notifications
    const interval = setInterval(() => {
      const { createNotification } = get();
      
      // Randomly create emergency notifications
      if (Math.random() < 0.1) { // 10% chance every interval
        createNotification({
          type: NotificationType.URGENT_REQUEST,
          priority: NotificationPriority.CRITICAL,
          title: 'Yêu cầu máu khẩn cấp mới',
          message: 'Có yêu cầu máu khẩn cấp mới cần sự hỗ trợ của bạn',
          actionUrl: '/blood-requests/emergency',
          actionLabel: 'Xem ngay'
        });
      }
    }, 30000); // Check every 30 seconds
    
    // Store interval ID for cleanup
    (window as any).notificationInterval = interval;
  },

  unsubscribeFromNotifications: () => {
    set({ isConnected: false });
    
    // Clear interval
    if ((window as any).notificationInterval) {
      clearInterval((window as any).notificationInterval);
      delete (window as any).notificationInterval;
    }
  },

  sendEmergencyAlert: async (message, targetUsers) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create emergency notification
      await get().createNotification({
        type: NotificationType.URGENT_REQUEST,
        priority: NotificationPriority.CRITICAL,
        title: 'Cảnh báo khẩn cấp',
        message,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours
      });
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: 'Không thể gửi cảnh báo khẩn cấp',
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading) => set({ isLoading: loading })
}));
