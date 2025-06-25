import React from 'react';

interface StaffHeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  staffName?: string;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ onToggleSidebar, isSidebarCollapsed, staffName }) => {
  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <button
          className="mr-3 p-2 rounded hover:bg-gray-100 transition"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {isSidebarCollapsed ? (
            <span className="text-2xl">☰</span>
          ) : (
            <span className="text-2xl">«</span>
          )}
        </button>
        <span className="text-2xl font-bold text-[#e53935]">🩸</span>
        <span className="text-lg font-bold text-[#b71c1c]">Hệ thống quản lý Staff</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-semibold text-[#b71c1c]">Xin chào, {staffName || 'Staff'}</span>
        <button
          className="px-3 py-1 bg-[#e53935] text-white rounded hover:bg-[#b71c1c] transition"
          onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default StaffHeader;
