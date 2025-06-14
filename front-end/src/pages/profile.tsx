import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, MapPin, Droplet } from 'lucide-react';

const Profile: React.FC = () => {
  // Dữ liệu mẫu, sau này thay bằng fetch từ API/backend
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  const [profile] = useState({
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    dob: '1995-05-20',
    gender: true, // true: Nam, false: Nữ
    address: '123 Đường ABC, Quận 1, TP.HCM',
    role: 'user',
    numberOfBloodDonation: 3,
    bloodType: 'O+',
    email: 'nguyenvana@email.com',
    username: 'nguyenvana',
  }
    
);

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Thông tin cá nhân</h2>
      <div className="flex flex-col items-center mb-6">
        <User className="h-16 w-16 text-red-500 mb-2" />
        <div className="text-xl font-semibold">{profile.name}</div>
        <div className="text-gray-500">@{profile.username}</div>
        <div className="mt-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm">
          {profile.role === 'admin' ? 'Quản trị viên' : profile.role === 'staff' ? 'Nhân viên' : 'Người dùng'}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-gray-400 mr-2" />
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-gray-400 mr-2" />
          <span>{profile.phone}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <span>{profile.dob}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-medium">Giới tính:</span>
          <span>{profile.gender ? 'Nam' : 'Nữ'}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          <span>{profile.address}</span>
        </div>
        <div className="flex items-center">
          <Droplet className="h-5 w-5 text-red-400 mr-2" />
          <span>Nhóm máu: <b>{profile.bloodType}</b></span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 font-medium">Số lần hiến máu:</span>
          <span>{profile.numberOfBloodDonation}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;