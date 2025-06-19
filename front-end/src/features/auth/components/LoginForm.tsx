// LoginForm.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { LoginFormData, LoginFormProps } from './types';

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  error 
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof LoginFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({ username: '', password: '' });
    } catch (error) {
      // Error is handled by the hook and passed via props
      console.error('Form submission error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 transform hover:scale-105 transition-transform duration-300">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
        <p className="text-gray-600">Chào mừng bạn trở lại!</p>
      </div>

      {/* Global Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm flex items-center">
            <span className="w-4 h-4 mr-2">❌</span>
            {error}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Username Field */}
        <div className="relative">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Tên đăng nhập
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                validationErrors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Nhập tên đăng nhập"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {validationErrors.username}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                validationErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isLoading}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="w-4 h-4 mr-1">⚠️</span>
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
          </label>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            onClick={() => {
              // Handle forgot password
              console.log('Forgot password clicked');
            }}
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Đang đăng nhập...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <LogIn className="w-5 h-5 mr-2" />
              Đăng nhập
            </div>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
            onClick={() => {
              // Handle register navigation
              console.log('Register clicked');
            }}
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;