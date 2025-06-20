import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import type { AuthResponse, RegisterFormData } from '../types/auth.types';

const RegisterPage: React.FC = () => {
  const { isLoading, register } = useAuth();
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Đăng ký qua API thật
  const handleRegister = async (data: RegisterFormData): Promise<AuthResponse> => {
    return await register(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <div className="flex flex-col items-center w-full max-w-2xl gap-8 py-12">
        <RegisterForm onRegister={handleRegister} showToast={showToast} isLoading={isLoading} />
      </div>
      <div className="fixed top-5 right-5 space-y-2 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow text-white transition-all duration-300 animate-slide-in-right \
              ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterPage;
