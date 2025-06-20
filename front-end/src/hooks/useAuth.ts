import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../utils/enums';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshAuth,
    clearError,
    setLoading
  } = useAuthStore();

  // Helper functions
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  };

  const isStaff = (): boolean => {
    return hasAnyRole([
      UserRole.STAFF,
      UserRole.DOCTOR,
      UserRole.NURSE,
      UserRole.TECHNICIAN,
      UserRole.COORDINATOR,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN
    ]);
  };

  const isDonor = (): boolean => {
    return hasAnyRole([UserRole.USER, UserRole.MEMBER]);
  };

  const canDonate = (): boolean => {
    if (!user) return false;
    return user.donationInfo.isEligible && isDonor();
  };

  const getDaysUntilEligible = (): number | null => {
    if (!user?.donationInfo.nextEligibleDate) return null;
    
    const nextEligible = new Date(user.donationInfo.nextEligibleDate);
    const today = new Date();
    const diffTime = nextEligible.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const getFullName = (): string => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  };

  const getInitials = (): string => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    refreshAuth,
    clearError,
    setLoading,

    // Helper functions
    hasRole,
    hasAnyRole,
    isAdmin,
    isStaff,
    isDonor,
    canDonate,
    getDaysUntilEligible,
    getFullName,
    getInitials
  };
};
