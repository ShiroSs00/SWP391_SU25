import React, { useState } from 'react';
import StaffHeader from '../components/StaffHeader';
import StaffSidebar from '../components/StaffSidebar';
import StaffRouter from '../router/StaffRouter';

const StaffPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Lấy tên staff từ localStorage nếu có
  let staffName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    staffName = user.name || user.username || 'Staff';
  } catch {
    // Ignore JSON parse errors or missing user info
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <StaffSidebar collapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <StaffHeader onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} isSidebarCollapsed={isSidebarCollapsed} staffName={staffName} />
        <main className="flex-1 p-8">
          <StaffRouter />
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
