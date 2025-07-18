import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  userName: string;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userAvatar }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
            <img
              src={userAvatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-800">{userName}</p>
              <p className="text-gray-500">Member</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;