import React, { useState } from 'react';
import { Edit2, Save, X, Phone, Mail, Calendar, Droplet, MapPin, User } from 'lucide-react';
import type { ProfileData } from '../types/dashboard.type';

interface ProfileCardProps {
  profile: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800 border-red-200',
      'A-': 'bg-red-200 text-red-900 border-red-300',
      'B+': 'bg-blue-100 text-blue-800 border-blue-200',
      'B-': 'bg-blue-200 text-blue-900 border-blue-300',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
      'AB-': 'bg-purple-200 text-purple-900 border-purple-300',
      'O+': 'bg-green-100 text-green-800 border-green-200',
      'O-': 'bg-green-200 text-green-900 border-green-300',
    };
    return colors[bloodType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profile.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop'}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(profile.isAvailableToDonate)}`}>
                {profile.isAvailableToDonate ? 'Sẵn sàng' : 'Tạm hoãn'}
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getBloodTypeColor(profile.bloodType)}`}>
                <Droplet className="w-4 h-4 mr-1" />
                {profile.bloodType}
              </div>
              {profile.accountId && (
                <p className="text-red-100 text-sm mt-2">ID: {profile.accountId}</p>
              )}
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Lưu</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-red-500" />
              Thông tin cơ bản
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Email"
                  />
                ) : (
                  <span className="text-gray-700">{profile.email}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Số điện thoại"
                  />
                ) : (
                  <span className="text-gray-700">{profile.phone}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {formatDate(profile.birthDate)}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-gray-400 text-sm font-medium flex items-center justify-center">GT</span>
                {isEditing ? (
                  <select
                    value={editData.gender}
                    onChange={(e) => setEditData({ ...editData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                ) : (
                  <span className="text-gray-700">
                    {profile.gender === 'Male' ? 'Nam' : profile.gender === 'Female' ? 'Nữ' : 'Khác'}
                  </span>
                )}
              </div>

              {profile.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-700 text-sm">{profile.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Health Status & Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Droplet className="w-5 h-5 mr-2 text-red-500" />
              Trạng thái sức khỏe
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">Sẵn sàng hiến máu</span>
                  <p className="text-sm text-gray-500">Cho phép nhận thông báo khẩn cấp</p>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.isAvailableToDonate}
                      onChange={(e) => setEditData({ ...editData, isAvailableToDonate: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(profile.isAvailableToDonate)}`}>
                    {profile.isAvailableToDonate ? 'Có' : 'Không'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">Thông báo khẩn cấp</span>
                  <p className="text-sm text-gray-500">Nhận thông báo khi có yêu cầu khẩn cấp</p>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.emergencyNotifications}
                      onChange={(e) => setEditData({ ...editData, emergencyNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${profile.emergencyNotifications ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {profile.emergencyNotifications ? 'Bật' : 'Tắt'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">Nhận thông báo chung</span>
                  <p className="text-sm text-gray-500">Thông báo về sự kiện và tin tức</p>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.getNotifications}
                      onChange={(e) => setEditData({ ...editData, getNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${profile.getNotifications ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {profile.getNotifications ? 'Bật' : 'Tắt'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        {(profile.dateCreated || profile.status) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {profile.dateCreated && (
                <div>
                  <span className="text-gray-500">Ngày tạo tài khoản:</span>
                  <span className="ml-2 font-medium">{formatDate(profile.dateCreated)}</span>
                </div>
              )}
              {profile.status && (
                <div>
                  <span className="text-gray-500">Trạng thái tài khoản:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${profile.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {profile.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;