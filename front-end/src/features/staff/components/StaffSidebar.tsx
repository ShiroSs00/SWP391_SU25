import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface StaffSidebarProps {
  collapsed?: boolean;
}

const staffFeatures = [
  { key: 'blog', title: 'Viết blog hiến máu', icon: '✍️', path: '/staff/blog' },
  { key: 'donation', title: 'Quản lý đơn hiến máu', icon: '🩸', path: '/staff/donation' },
  { key: 'bloodtest', title: 'Quản lý kiểm tra máu', icon: '🧪', path: '/staff/bloodtest' },
  { key: 'receive', title: 'Quản lý nhận máu', icon: '💉', path: '/staff/receive' },
  { key: 'health', title: 'Quản lý sức khỏe', icon: '❤️', path: '/staff/health' },
];

const StaffSidebar: React.FC<StaffSidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  
  return (
    <aside className={`bg-white shadow-lg flex flex-col py-6 px-4 min-h-screen border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="mb-8 flex items-center gap-2 justify-center">
        <span className="text-2xl font-bold text-[#e53935]">🩸</span>
        {!collapsed && <span className="text-xl font-bold text-[#b71c1c]">Staff Panel</span>}
      </div>
      <nav className="flex flex-col gap-2">
        {staffFeatures.map((feature) => {
          const isActive = location.pathname === feature.path;
          return (
            <Link
              key={feature.key}
              to={feature.path}
              className={`flex items-center gap-2 px-3 py-2 rounded font-medium transition ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive 
                  ? 'bg-[#e53935] text-white' 
                  : 'text-[#b71c1c] hover:bg-[#ffeaea]'
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

export default StaffSidebar;
