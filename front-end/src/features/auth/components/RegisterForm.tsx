import React, { useState } from 'react';
import type { RegisterFormData, AuthResponse } from '../types/auth.types';
import { HCM_DISTRICTS_AND_WARDS } from '../types/hcm-districts-wards';

interface RegisterFormProps {
  onRegister: (data: RegisterFormData) => Promise<AuthResponse>;
  showToast: (message: string, type: 'success' | 'error') => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, showToast, isLoading }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    dob: '',
    gender: true,
    address: {
      city: '',
      district: '',
      ward: '',
      street: '',
    },
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim() || !confirmPassword.trim() || !formData.name.trim() || !formData.phone.trim() || !formData.dob.trim() || !formData.address.city.trim() || !formData.address.district.trim() || !formData.address.ward.trim() || !formData.address.street.trim()) {
      showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (formData.password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    if (formData.password !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp!', 'error');
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (!formData.dob.trim()) {
      showToast('Vui lòng chọn ngày sinh!', 'error');
      setError('Vui lòng chọn ngày sinh!');
      return;
    }
    setError('');
    const dataToSend = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      dob: new Date(formData.dob).toISOString(),
      gender: formData.gender,
      address: {
        city: formData.address.city,
        district: formData.address.district,
        ward: formData.address.ward,
        street: formData.address.street,
      }
    };
    console.log('Register payload:', dataToSend);
    const response = await onRegister(dataToSend);
    if (response.success) {
      showToast(response.message, 'success');
      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        phone: '',
        dob: '',
        gender: true,
        address: {
          city: '',
          district: '',
          ward: '',
          street: '',
        },
      });
      setConfirmPassword('');
    } else {
      showToast(response.message, 'error');
      setError(response.message);
    }
  };

  return (
    <form className="bg-white rounded-lg shadow-xl px-6 py-8 w-full max-w-md flex flex-col gap-4 font-sans animate-in fade-in-0 zoom-in-95 duration-700" onSubmit={handleSubmit} style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <h2 className="text-3xl font-extrabold text-[#e53935] text-center mb-1 tracking-wide">Tạo tài khoản mới</h2>
      <p className="text-center text-gray-600 mb-3">Nhanh chóng và dễ dàng.</p>
      <div className="mb-2">
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c]"
          placeholder="Họ và tên"
          disabled={isLoading}
          autoComplete="name"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
        />
      </div>
      <div className="flex gap-2 mb-2">
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="w-1/2 border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c]"
          placeholder="Số điện thoại"
          disabled={isLoading}
          autoComplete="tel"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
        />
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-1/2 border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c]"
          placeholder="Email"
          disabled={isLoading}
          autoComplete="email"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
        />
      </div>
      <div className="flex flex-col mb-2">
        <label className="text-sm font-semibold text-[#b71c1c] mb-1 flex items-center gap-1">
          Ngày sinh
          <span className="text-gray-400" title="Chọn ngày sinh của bạn để xác thực độ tuổi">&#9432;</span>
        </label>
        <div className="flex gap-2">
          <select
            id="dob-day"
            name="dob-day"
            value={formData.dob ? String(new Date(formData.dob).getDate()).padStart(2, '0') : ''}
            onChange={e => {
              const day = e.target.value.padStart(2, '0');
              const date = formData.dob ? new Date(formData.dob) : new Date();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = String(date.getFullYear());
              setFormData(f => ({ ...f, dob: `${year}-${month}-${day}` }));
            }}
            className="w-1/3 border border-gray-300 rounded-md px-2 py-2 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 font-medium text-[#b71c1c]"
            disabled={isLoading}
          >
            <option value="">Ngày</option>
            {[...Array(31)].map((_, i) => {
              const d = String(i+1).padStart(2, '0');
              return <option key={d} value={d}>{d}</option>;
            })}
          </select>
          <select
            id="dob-month"
            name="dob-month"
            value={formData.dob ? String(new Date(formData.dob).getMonth() + 1).padStart(2, '0') : ''}
            onChange={e => {
              const month = e.target.value.padStart(2, '0');
              const date = formData.dob ? new Date(formData.dob) : new Date();
              const day = String(date.getDate()).padStart(2, '0');
              const year = String(date.getFullYear());
              setFormData(f => ({ ...f, dob: `${year}-${month}-${day}` }));
            }}
            className="w-1/3 border border-gray-300 rounded-md px-2 py-2 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 font-medium text-[#b71c1c]"
            disabled={isLoading}
          >
            <option value="">Tháng</option>
            {[...Array(12)].map((_, i) => {
              const m = String(i+1).padStart(2, '0');
              return <option key={m} value={m}>{m}</option>;
            })}
          </select>
          <select
            id="dob-year"
            name="dob-year"
            value={formData.dob ? String(new Date(formData.dob).getFullYear()) : ''}
            onChange={e => {
              const year = e.target.value;
              const date = formData.dob ? new Date(formData.dob) : new Date();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              setFormData(f => ({ ...f, dob: `${year}-${month}-${day}` }));
            }}
            className="w-1/3 border border-gray-300 rounded-md px-2 py-2 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 font-medium text-[#b71c1c]"
            disabled={isLoading}
          >
            <option value="">Năm</option>
            {Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i)).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2 mb-2 items-center">
        <label className="text-[#b71c1c] font-medium">Giới tính:</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender ? 'male' : 'female'}
          onChange={e => setFormData(f => ({ ...f, gender: e.target.value === 'male' }))}
          className="border border-gray-300 rounded-md px-2 py-2 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 font-medium text-[#b71c1c]"
          disabled={isLoading}
        >
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      </div>
      <input
        id="username"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c] mb-2"
        placeholder="Tên đăng nhập"
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
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c] mb-2"
        placeholder="Mật khẩu mới"
        disabled={isLoading}
        autoComplete="new-password"
        style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
      />
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c] mb-2"
        placeholder="Xác nhận mật khẩu"
        disabled={isLoading}
        autoComplete="new-password"
        style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
      />
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-semibold text-[#b71c1c] mb-1">Địa chỉ</label>
        <div className="flex gap-2">
          <select
            id="city"
            name="city"
            value={formData.address.city}
            onChange={e => setFormData(f => ({ ...f, address: { ...f.address, city: e.target.value, district: '', ward: '' } }))}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c]"
            disabled={isLoading}
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          </select>
          <select
            id="district"
            name="district"
            value={formData.address.district}
            onChange={e => setFormData(f => ({ ...f, address: { ...f.address, district: e.target.value, ward: '' } }))}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c]"
            disabled={isLoading || !formData.address.city}
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          >
            <option value="">Chọn Quận/Huyện</option>
            {HCM_DISTRICTS_AND_WARDS.map(d => (
              <option key={d.district} value={d.district}>{d.district}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <select
            id="ward"
            name="ward"
            value={formData.address.ward}
            onChange={e => setFormData(f => ({ ...f, address: { ...f.address, ward: e.target.value } }))}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c]"
            disabled={isLoading || !formData.address.district}
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          >
            <option value="">Chọn Phường/Xã</option>
            {HCM_DISTRICTS_AND_WARDS.find(d => d.district === formData.address.district)?.wards.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <input
            id="street"
            name="street"
            type="text"
            value={formData.address.street}
            onChange={e => setFormData(f => ({ ...f, address: { ...f.address, street: e.target.value } }))}
            className="w-1/2 border border-gray-300 rounded-md px-4 py-3 text-base focus:ring-2 focus:ring-[#e53935] focus:border-[#e53935] transition-colors bg-gray-50 placeholder-gray-400 font-medium text-[#b71c1c]"
            placeholder="Số nhà, tên đường"
            disabled={isLoading}
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          />
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#43a047] text-white py-3 px-4 rounded-md font-bold text-lg hover:bg-[#2e7d32] focus:outline-none focus:ring-2 focus:ring-[#a5d6a7] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-2"
        style={{ fontFamily: 'Montserrat, Arial, sans-serif', letterSpacing: '1px' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Đang đăng ký...
          </div>
        ) : (
          'Đăng ký'
        )}
      </button>
      <a href="/login" className="text-[#1877f2] text-center text-base font-medium hover:underline mt-2">Đã có tài khoản?</a>
    </form>
  );
};

export default RegisterForm;
