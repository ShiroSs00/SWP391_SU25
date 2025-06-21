import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminDashboard from '../components/AdminDashboard';
import EventPage from './eventPage';

interface AdminPageProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ showToast }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState<'dashboard' | 'events'>('dashboard');

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Chuyển trang nội bộ, không đổi route
  const handleMenuClick = (key: string) => {
    if (key === 'events') setActivePage('events');
    else setActivePage('dashboard');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar collapsed={isSidebarCollapsed} onMenuClick={handleMenuClick} />
      <div className="flex-1 flex flex-col">
        <AdminHeader showToast={showToast} onToggleSidebar={handleToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 p-8">
          {activePage === 'dashboard' && <><h1 className="text-3xl font-bold text-center text-[#b71c1c] mb-8">Trang quản trị hệ thống</h1><AdminDashboard /></>}
          {activePage === 'events' && <EventPage />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
