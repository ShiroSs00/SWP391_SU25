import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  showToast: (message: string, type: 'success' | 'error') => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ showToast, onToggleSidebar, isSidebarCollapsed }) => {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast('Đăng xuất thành công', 'success');
    navigate('/login');
  };

  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <button
          className="mr-3 p-2 rounded hover:bg-gray-100 transition"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {/* Hamburger icon when collapsed, chevron-left when expanded */}
          {isSidebarCollapsed ? (
            <span className="text-2xl">☰</span>
          ) : (
            <span className="text-2xl">«</span>
          )}
        </button>
        <span className="text-2xl font-bold text-[#e53935]">🩸</span>
        <span className="text-lg font-bold text-[#b71c1c]">Hệ thống quản trị BloodCare</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-semibold text-[#b71c1c]">Xin chào, Admin</span>
        <button
          className="px-3 py-1 bg-[#e53935] text-white rounded hover:bg-[#b71c1c] transition"
          onClick={handleLogout}
          disabled={isLoading}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
