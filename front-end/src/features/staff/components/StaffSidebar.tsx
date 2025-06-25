import React from 'react';

interface StaffSidebarProps {
  collapsed?: boolean;
  onMenuClick?: (key: string) => void;
}

const staffFeatures = [
  { key: 'advice', title: 'Lời khuyên sức khỏe', icon: '💡' },
  { key: 'blog', title: 'Viết blog hiến máu', icon: '✍️' },
  { key: 'donation', title: 'Quản lý đơn hiến máu', icon: '🩸' },
  { key: 'bloodtest', title: 'Quản lý kiểm tra máu', icon: '🧪' },
  { key: 'receive', title: 'Quản lý nhận máu', icon: '💉' },
  { key: 'health', title: 'Quản lý sức khỏe', icon: '❤️' },
  { key: 'request', title: 'Đăng ký xin máu', icon: '🆘' },
];

const StaffSidebar: React.FC<StaffSidebarProps> = ({ collapsed = false, onMenuClick }) => (
  <aside className={`bg-white shadow-lg flex flex-col py-6 px-4 min-h-screen border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
    <div className="mb-8 flex items-center gap-2 justify-center">
      <span className="text-2xl font-bold text-[#e53935]">🩸</span>
      {!collapsed && <span className="text-xl font-bold text-[#b71c1c]">Staff Panel</span>}
    </div>
    <nav className="flex flex-col gap-2">
      {staffFeatures.map((feature) => (
        <button
          key={feature.key}
          onClick={() => onMenuClick && onMenuClick(feature.key)}
          className={`flex items-center gap-2 px-3 py-2 rounded text-[#b71c1c] font-medium hover:bg-[#ffeaea] transition ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="text-lg">{feature.icon}</span>
          {!collapsed && feature.title}
        </button>
      ))}
    </nav>
  </aside>
);

export default StaffSidebar;
