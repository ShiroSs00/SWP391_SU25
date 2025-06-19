export interface LoginFormData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<AuthResponse>;
  showToast: (message: string, type: 'success' | 'error') => void;
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
