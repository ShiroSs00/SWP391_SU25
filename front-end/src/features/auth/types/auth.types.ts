// src/types.ts
// Type definitions for authentication
export interface LoginFormData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  role?: string;
}

export interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<AuthResponse>;
  showToast: (message: string, type: 'success' | 'error') => void;
  isLoading: boolean;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  dob: string;
  gender: boolean;
  address: {
    city: string;
    district: string;
    ward: string;
    street: string;
  };
};
