import React, { useState } from 'react';
import { Settings, Bell, Shield, User, Smartphone, Mail } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import type { ProfileData } from '../types/dashboard.type';

interface SettingsPageProps {
  profile: ProfileData | null;
  onUpdate: (data: Partial<ProfileData>) => Promise<void>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ profile, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emergencyNotifications: profile?.emergencyNotifications ?? true,
    getNotifications: profile?.getNotifications ?? true,
    sendToFamily: profile?.sendToFamily ?? false,
    rangeNotifications: profile?.rangeNotifications ?? 5,
  });

  const handleSettingChange = async (key: string, value: any) => {
    setIsLoading(true);
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await onUpdate(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      // Revert on error
      setSettings(settings);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cài đặt</h1>
          <p className="text-gray-600">Quản lý thông báo và tùy chọn tài khoản</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Cài đặt thông báo</h2>
          </div>

          <div className="space-y-6">
            {/* Emergency Notifications */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Thông báo khẩn cấp</h3>
                  <p className="text-sm text-gray-600">Nhận thông báo khi có yêu cầu máu khẩn cấp</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emergencyNotifications}
                  onChange={(e) => handleSettingChange('emergencyNotifications', e.target.checked)}
                  disabled={isLoading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            {/* General Notifications */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Thông báo chung</h3>
                  <p className="text-sm text-gray-600">Nhận thông báo về sự kiện và tin tức</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.getNotifications}
                  onChange={(e) => handleSettingChange('getNotifications', e.target.checked)}
                  disabled={isLoading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {/* Family Notifications */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Thông báo gia đình</h3>
                  <p className="text-sm text-gray-600">Gửi thông báo cho gia đình khi hiến máu</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sendToFamily}
                  onChange={(e) => handleSettingChange('sendToFamily', e.target.checked)}
                  disabled={isLoading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Notification Range */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Phạm vi thông báo</h3>
                  <p className="text-sm text-gray-600">Khoảng cách tối đa để nhận thông báo (km)</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={settings.rangeNotifications}
                  onChange={(e) => handleSettingChange('rangeNotifications', parseInt(e.target.value))}
                  disabled={isLoading}
                  className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-lg font-semibold text-purple-600 min-w-[60px]">
                  {settings.rangeNotifications} km
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">Bảo mật tài khoản</h2>
          </div>

          <div className="space-y-4">
            {/* Account Status */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Trạng thái tài khoản</h3>
                  <p className="text-sm text-gray-600">Tài khoản của bạn đang hoạt động bình thường</p>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                  Hoạt động
                </span>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Email đăng nhập:</span>
                <span className="font-medium">{profile.email}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{profile.phone}</span>
              </div>
              
              {profile.dateCreated && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Ngày tạo tài khoản:</span>
                  <span className="font-medium">
                    {new Date(profile.dateCreated).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>

            {/* Security Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-800">Đổi mật khẩu</span>
                  <span className="text-blue-600">→</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">Cập nhật mật khẩu để bảo mật tài khoản</p>
              </button>
              
              <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-800">Xác thực 2 bước</span>
                  <span className="text-purple-600">→</span>
                </div>
                <p className="text-sm text-purple-600 mt-1">Tăng cường bảo mật với xác thực 2 bước</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-800">Dữ liệu & Quyền riêng tư</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-1">Tải xuống dữ liệu</h3>
            <p className="text-sm text-gray-600">Tải xuống bản sao dữ liệu cá nhân của bạn</p>
          </button>
          
          <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-1">Chính sách bảo mật</h3>
            <p className="text-sm text-gray-600">Xem cách chúng tôi bảo vệ thông tin của bạn</p>
          </button>
          
          <button className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-1">Điều khoản sử dụng</h3>
            <p className="text-sm text-gray-600">Đọc các điều khoản và điều kiện</p>
          </button>
          
          <button className="p-4 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
            <h3 className="font-medium text-red-800 mb-1">Xóa tài khoản</h3>
            <p className="text-sm text-red-600">Xóa vĩnh viễn tài khoản và dữ liệu</p>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <LoadingSpinner />
            <span>Đang cập nhật cài đặt...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;