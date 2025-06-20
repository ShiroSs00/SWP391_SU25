import React, { useState } from 'react';
import type { LoginFormProps } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, showToast, isLoading }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (formData.username.length < 3) {
      showToast('Tên đăng nhập phải có ít nhất 3 ký tự!', 'error');
      setError('Tên đăng nhập phải có ít nhất 3 ký tự!');
      return;
    }
    if (formData.password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    setError('');
    const response = await onLogin(formData);
    console.log('Full login response:', response);
    if (response.token && response.role) {
      showToast(response.message, 'success');
      const role = response.role.toUpperCase();
      console.log('Login response role:', role);
      if (role === 'ADMIN') {
        console.log('Navigate to /admin - before');
        setTimeout(() => navigate('/admin'), 0);
        console.log('Navigate to /admin - after');
      } else if (role === 'STAFF') {
        console.log('Navigate to /staff');
        setTimeout(() => navigate('/staff'), 0);
      } else if (role === 'MEMBER') {
        console.log('Navigate to /');
        setTimeout(() => navigate('/'), 0);
      } else {
        console.log('Navigate to / (unknown role)');
        setTimeout(() => navigate('/'), 0);
      }
      setFormData({ username: '', password: '' });
    } else {
      showToast(response.message || 'Đăng nhập thất bại', 'error');
      setError(response.message || 'Đăng nhập thất bại');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <form className="bg-white rounded-lg shadow-xl px-6 py-8 w-full max-w-sm flex flex-col gap-4 font-sans animate-in fade-in-0 zoom-in-95 duration-700" onSubmit={handleSubmit} style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <h2 className="text-3xl font-extrabold text-[#e53935] text-center mb-4 tracking-wide" style={{ fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: '1px' }}>Đăng nhập Bloodcare</h2>
      <input
        id="username"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 mb-3 font-medium text-[#b71c1c]"
        placeholder="Email hoặc số điện thoại"
        disabled={isLoading}
        autoComplete="username"
        style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
      />
      <input
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 mb-3 font-medium text-[#b71c1c]"
        placeholder="Mật khẩu"
        disabled={isLoading}
        autoComplete="current-password"
        style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
      />
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#e53935] text-white py-3 px-4 rounded-md font-bold text-lg hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#e57373] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mb-2"
        style={{ fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: '1px' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Đang đăng nhập...
          </div>
        ) : (
          'Đăng nhập'
        )}
      </button>
      <a href="#" className="text-[#e53935] text-center text-sm font-medium hover:underline mb-2" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>Quên mật khẩu?</a>
      <div className="border-t border-gray-300 my-2"></div>
      <button
        type="button"
        className="w-fit mx-auto bg-[#43a047] text-white py-3 px-6 rounded-md font-bold text-base hover:bg-[#2e7d32] transition-colors"
        style={{ fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: '1px' }}
        onClick={() => navigate('/register')}
      >
        Tạo tài khoản mới
      </button>
    </form>
  );
};

export default LoginForm;