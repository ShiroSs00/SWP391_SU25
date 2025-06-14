import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StaffFeatureMenu from './StaffFeatureMenu';
import StaffHeader from './StaffHeader';
import { AdviceForMembersPage, SearchBloodRequestByDistancePage, BloodDonationInfoPage, BloodDonationOverviewPage } from './index';

const StaffPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffHeader isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <div className="flex pt-16">
        <StaffFeatureMenu isOpen={isSidebarOpen} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-8`}>
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<BloodDonationOverviewPage />} />
              <Route path="advice" element={<AdviceForMembersPage />} />
              <Route path="search-blood-request" element={<SearchBloodRequestByDistancePage />} />
              <Route path="blood-donation-info" element={<BloodDonationInfoPage />} />
              <Route path="*" element={<Navigate to="/staff" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;