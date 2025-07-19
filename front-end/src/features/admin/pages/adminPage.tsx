import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminRouter from '../router/AdminRouter';
interface AdminPageProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ showToast }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar collapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <AdminHeader showToast={showToast} onToggleSidebar={handleToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 p-8">
          <AdminRouter />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
