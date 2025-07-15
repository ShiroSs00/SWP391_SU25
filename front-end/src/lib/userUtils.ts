// Utility functions for user state management

/**
 * Utility function to trigger user state change event
 * This should be called whenever user data in localStorage changes
 */
export function triggerUserStateChange() {
  window.dispatchEvent(new CustomEvent('userStateChange'));
}

/**
 * Get user from localStorage with error handling
 */
export function getUserFromLocalStorage() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
}

/**
 * Set user in localStorage and trigger state change
 */
export function setUserInLocalStorage(user: Record<string, unknown>) {
  localStorage.setItem('user', JSON.stringify(user));
  triggerUserStateChange();
}

/**
 * Remove user from localStorage and trigger state change
 */
export function removeUserFromLocalStorage() {
  localStorage.removeItem('user');
  triggerUserStateChange();
}

/**
 * Get username from localStorage
 */
export function getUsernameFromLocalStorage(): string | null {
  return localStorage.getItem('username');
}

/**
 * Get user name from localStorage
 */
export function getUserNameFromLocalStorage(): string | null {
  return localStorage.getItem('name');
}

/**
 * Get user role from localStorage
 */
export function getUserRoleFromLocalStorage(): string | null {
  return localStorage.getItem('role');
}

/**
 * Check if user is logged in
 */
export function isUserLoggedIn(): boolean {
  return !!localStorage.getItem('authToken');
}

/**
 * Get complete user info from localStorage
 */
export function getUserInfo() {
  return {
    username: getUsernameFromLocalStorage(),
    name: getUserNameFromLocalStorage(),
    role: getUserRoleFromLocalStorage(),
    isLoggedIn: isUserLoggedIn(),
    user: getUserFromLocalStorage()
  };
}
