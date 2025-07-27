import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types/blog.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  canCreatePost: () => boolean;
  canEditPost: (postAuthorId?: string) => boolean;
  canDeletePost: (postAuthorId?: string) => boolean;
  canComment: () => boolean;
  canLike: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
        localStorage.setItem('authToken', token);
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('authToken');
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

      hasPermission: (requiredRole: UserRole) => {
        const { user } = get();
        if (!user) return false;

        const roleHierarchy: Record<UserRole, number> = {
          MEMBER: 1,
          STAFF: 2,
          ADMIN: 3,
        };

        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
      },

      canCreatePost: () => {
        const { hasPermission } = get();
        return hasPermission('STAFF');
      },

      canEditPost: (postAuthorId?: string) => {
        const { user, hasPermission } = get();
        if (!user) return false;

        // Admin có thể edit tất cả bài viết
        if (hasPermission('ADMIN')) return true;

        // Staff chỉ có thể edit bài viết của chính mình
        if (hasPermission('STAFF') && postAuthorId) {
          return user.id === postAuthorId;
        }

        return false;
      },

      canDeletePost: (postAuthorId?: string) => {
        const { user, hasPermission } = get();
        if (!user) return false;

        // Admin có thể delete tất cả bài viết
        if (hasPermission('ADMIN')) return true;

        // Staff chỉ có thể delete bài viết của chính mình
        if (hasPermission('STAFF') && postAuthorId) {
          return user.id === postAuthorId;
        }

        return false;
      },

      canComment: () => {
        const { hasPermission } = get();
        return hasPermission('MEMBER');
      },

      canLike: () => {
        const { hasPermission } = get();
        return hasPermission('MEMBER');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);