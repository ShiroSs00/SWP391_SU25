import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import type { AuthResponse, RegisterFormData } from '../types/auth.types';

interface RegisterPageProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ showToast }) => {
  const { isLoading, register } = useAuth();

  // Đăng ký qua API thật
  const handleRegister = async (data: RegisterFormData): Promise<AuthResponse> => {
    return await register(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <div className="flex flex-col items-center w-full max-w-2xl gap-8 py-12">
        <RegisterForm onRegister={handleRegister} showToast={showToast} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default RegisterPage;
