import React, { useState } from 'react';
import StaffHeader from '../components/StaffHeader';
import StaffSidebar from '../components/StaffSidebar';
import DonationManage from '../../donation-register/components/donation-manage';
import RequestManage from '../../request-blood/components/request-manage';
// import RequestBloodPage from '../../request-blood/pages/request-blood.page';

const StaffPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('donation');
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
      <StaffSidebar collapsed={isSidebarCollapsed} onMenuClick={setActivePage} />
      <div className="flex-1 flex flex-col">
        <StaffHeader onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} isSidebarCollapsed={isSidebarCollapsed} staffName={staffName} />
        <main className="flex-1 p-8">
          {activePage === 'donation' && <DonationManage />}
          {activePage === 'receive' && <RequestManage />}
          {/* {activePage === 'request' && <RequestBloodPage/>} */}
          {/* Có thể mở rộng các trang khác cho staff ở đây */}
          {!['donation', 'health', 'request'].includes(activePage) && (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600 text-lg animate-fade-in">
              <p>Chức năng này đang được phát triển...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
