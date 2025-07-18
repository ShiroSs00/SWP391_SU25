import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  User,
  History,
  Award,
  Coins,
  Calendar,
  MessageSquare,
  Heart,
  Settings,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  to: string;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home, description: 'Xem tổng quan hoạt động', to: '/member/dashboard' },
    { id: 'profile', label: 'Hồ sơ', icon: User, description: 'Quản lý thông tin cá nhân', to: '/member/profile' },
    { id: 'history', label: 'Lịch sử máu', icon: History, description: 'Xem lịch sử hiến/nhận máu', to: '/member/history' },
    { id: 'achievements', label: 'Thành tích', icon: Award, description: 'Khám phá các thành tích', to: '/member/achievements' },
    { id: 'points', label: 'Điểm thưởng', icon: Coins, description: 'Tích lũy và đổi thưởng', to: '/member/points' },
    { id: 'events', label: 'Sự kiện', icon: Calendar, description: 'Tham gia các sự kiện', to: '/member/events' },
    { id: 'feedback', label: 'Phản hồi', icon: MessageSquare, description: 'Gửi ý kiến đóng góp', to: '/member/feedback' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, description: 'Tùy chỉnh tài khoản', to: '/member/settings' },
  ];

  const handleTabChange = (tabId: string) => {
    // Add smooth transition effect
    document.body.style.opacity = '0.95';
    setTimeout(() => {
      onTabChange(tabId);
      document.body.style.opacity = '1';
    }, 100);
  };

  return (
    <div className="w-64 bg-white shadow-xl h-screen fixed left-0 top-0 z-20 border-r border-gray-100">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">BloodCare</h1>
            <p className="text-sm text-gray-500 font-medium">Member Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-2 px-3 pb-4 overflow-y-auto h-full">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => handleTabChange(item.id)}
                className={`group w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${isActive
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-200'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-white bg-opacity-20'
                      : 'bg-gray-100 group-hover:bg-red-100 group-hover:bg-opacity-50'
                    }`}>
                    <Icon className={`w-5 h-5 transition-all duration-200 ${isActive
                        ? 'text-white'
                        : 'text-gray-500 group-hover:text-red-500'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium text-sm transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-red-600'
                      }`}>
                      {item.label}
                    </span>
                    <p className={`text-xs mt-0.5 transition-all duration-200 ${isActive
                        ? 'text-red-100'
                        : 'text-gray-500 group-hover:text-red-400'
                      }`}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${isActive
                    ? 'text-white transform rotate-90'
                    : 'text-gray-400 group-hover:text-red-500 group-hover:transform group-hover:translate-x-1'
                  }`} />
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* User Status Card */}
        <div className="mx-1 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">Trạng thái</p>
              <p className="text-xs text-blue-600">Sẵn sàng hiến máu</p>
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div className="bg-blue-500 h-2 rounded-full w-4/5 transition-all duration-500"></div>
          </div>
          <p className="text-xs text-blue-600">Sức khỏe tốt - 80%</p>
        </div>

        {/* Encouragement Message */}
        <div className="mx-1 mt-4 p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🏆</span>
              <p className="text-sm font-bold">Bạn là người hùng!</p>
            </div>
            <p className="text-xs text-red-100 leading-relaxed">
              Cảm ơn bạn đã cứu sống nhiều người qua việc hiến máu
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mx-1 mt-4 grid grid-cols-2 gap-2">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="text-lg font-bold text-green-600">12</div>
            <div className="text-xs text-green-500">Lần hiến</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <div className="text-lg font-bold text-purple-600">8</div>
            <div className="text-xs text-purple-500">Thành tích</div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;