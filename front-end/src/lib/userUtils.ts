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
