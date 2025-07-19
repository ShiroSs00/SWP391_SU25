import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  collapsed?: boolean;
}

const adminFeatures = [
  { key: 'dashboard', title: 'Tổng quan', icon: '📊', path: '/admin/dashboard' },
  { key: 'users', title: 'Quản lí tài khoản người dùng', icon: '👤', path: '/admin/users' },
  { key: 'events', title: 'Quản lý sự kiện', icon: '🩸', path: '/admin/events' },
  { key: 'feedback', title: 'Quản lí feedback', icon: '💬', path: '/admin/feedback' },
  { key: 'blood', title: 'Quản lí danh sách máu', icon: '🧪', path: '/admin/blood' },
  { key: 'achievements', title: 'Quản lý các thành tựu', icon: '🏆', path: '/admin/achievements' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  
  return (
    <aside className={`bg-gray-100 shadow-md flex flex-col py-6 px-4 min-h-screen border-r border-gray-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="mb-8 flex items-center gap-2 justify-center">
        <span className="text-2xl font-bold text-[#b71c1c]">🩸</span>
        {!collapsed && <span className="text-xl font-bold text-gray-800">Admin Panel</span>}
      </div>
      <nav className="flex flex-col gap-2">
        {adminFeatures.map((feature) => {
          const isActive = location.pathname === feature.path;
          return (
            <Link
              key={feature.key}
              to={feature.path}
              className={`flex items-center gap-2 px-3 py-2 rounded font-medium transition ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive 
                  ? 'bg-[#b71c1c] text-white' 
                  : 'text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{feature.icon}</span>
              {!collapsed && feature.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
