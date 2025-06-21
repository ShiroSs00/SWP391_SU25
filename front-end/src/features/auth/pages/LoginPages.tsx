// src/pages/LoginPage.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';
import { type Toast } from '../types/auth.types';

interface LoginPageProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ showToast }) => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-12 py-12">
        <div className="flex-1 flex flex-col items-center md:items-start md:justify-center px-4 mb-10 md:mb-0">
          <h1 className="text-6xl font-extrabold text-[#e53935] mb-4 select-none" style={{ fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: '2px' }}>bloodcare</h1>
          <p className="text-2xl text-[#b71c1c] font-normal max-w-md leading-snug" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>Bloodcare giúp bạn kết nối và chia sẻ yêu thương qua từng giọt máu hiến tặng.</p>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <LoginForm onLogin={login} showToast={showToast} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
export default LoginPage;