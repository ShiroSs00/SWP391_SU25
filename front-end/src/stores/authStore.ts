import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';
import { UserRole } from '../utils/enums';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bloodType: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    district: string;
    ward: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: {
    weight: number;
    height: number;
    allergies: string[];
    medications: string[];
    chronicConditions: string[];
  };
  donationInfo: {
    totalDonations: number;
    lastDonationDate?: string;
    nextEligibleDate?: string;
    preferredDonationType: string;
    isEligible: boolean;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      showProfile: boolean;
      showDonationHistory: boolean;
    };
    language: string;
    theme: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock API call - replace with actual API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const mockUser: User = {
            id: '1',
            email,
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            phone: '0123456789',
            bloodType: 'O+',
            role: UserRole.USER,
            isVerified: true,
            dateOfBirth: '1990-01-01',
            address: {
              street: '123 Đường ABC',
              city: 'TP.HCM',
              district: 'Quận 1',
              ward: 'Phường 1'
            },
            emergencyContact: {
              name: 'Nguyễn Thị B',
              phone: '0987654321',
              relationship: 'Vợ/Chồng'
            },
            medicalInfo: {
              weight: 70,
              height: 170,
              allergies: [],
              medications: [],
              chronicConditions: []
            },
            donationInfo: {
              totalDonations: 5,
              lastDonationDate: '2024-01-15',
              nextEligibleDate: '2024-03-15',
              preferredDonationType: 'whole_blood',
              isEligible: true
            },
            preferences: {
              notifications: {
                email: true,
                sms: true,
                push: true
              },
              privacy: {
                showProfile: true,
                showDonationHistory: true
              },
              language: 'vi',
              theme: 'light'
            },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          };

          const mockToken = 'mock-jwt-token';
          const mockRefreshToken = 'mock-refresh-token';

          set({
            user: mockUser,
            token: mockToken,
            refreshToken: mockRefreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            error: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
            isLoading: false
          });
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock successful registration
          set({
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            error: 'Đăng ký thất bại. Vui lòng thử lại.',
            isLoading: false
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        });
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...userData },
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          set({
            error: 'Cập nhật thông tin thất bại.',
            isLoading: false
          });
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          // Mock refresh token API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock new token
          set({ token: 'new-mock-jwt-token' });
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
