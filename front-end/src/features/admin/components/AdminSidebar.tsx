import React from 'react';

interface AdminSidebarProps {
  collapsed?: boolean;
  onMenuClick?: (key: string) => void;
}

const adminFeatures = [
  { key: 'users', title: 'Quản lí tài khoản người dùng', icon: '👤' },
  { key: 'events', title: 'Quản lý sự kiện', icon: '🩸' },
  { key: 'roles', title: 'Phân quyền cho người dùng', icon: '🔑' },
  { key: 'feedback', title: 'Quản lí feedback', icon: '💬' },
  { key: 'blood', title: 'Quản lí danh sách máu', icon: '🧪' },
  { key: 'achievements', title: 'Quản lý các thành tựu', icon: '🏆' },
  { key: 'stats', title: 'Quản lí thống kê, báo cáo của hệ thống', icon: '📊' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false, onMenuClick }) => (
  <aside className={`bg-gray-100 shadow-md flex flex-col py-6 px-4 min-h-screen border-r border-gray-300 ${collapsed ? 'w-20' : 'w-64'}`}>
    <div className="mb-8 flex items-center gap-2 justify-center">
      <span className="text-2xl font-bold text-[#b71c1c]">🩸</span>
      {!collapsed && <span className="text-xl font-bold text-gray-800">Admin Panel</span>}
    </div>
    <nav className="flex flex-col gap-2">
      {adminFeatures.map((feature) => (
        <button
          key={feature.key}
          onClick={() => onMenuClick && onMenuClick(feature.key)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-gray-800 font-medium hover:bg-gray-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="text-lg">{feature.icon}</span>
          {!collapsed && feature.title}
        </button>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;
