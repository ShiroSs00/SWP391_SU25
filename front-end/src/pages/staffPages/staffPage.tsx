import React from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';
import StaffFeatureMenu from './StaffFeatureMenu';
import AdviceForMembersPage from './AdviceForMembersPage';
import SearchBloodRequestByDistancePage from './SearchBloodRequestByDistancePage';
import BloodDonationInfoPage from './BloodDonationInfoPage';
import BloodDonationOverviewPage from './BloodDonationOverviewPage';
import { BloodOrderTable } from './BloodOrderTable';

interface StaffPageProps {
  isSidebarOpen: boolean;
}

const StaffPage: React.FC<StaffPageProps> = ({ isSidebarOpen }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StaffFeatureMenu isOpen={isSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-8`}>
        <Routes>
          <Route path="/" element={<BloodDonationOverviewPage />} />
          <Route path="advice" element={<AdviceForMembersPage />} />
          <Route path="search-blood-request" element={<SearchBloodRequestByDistancePage />} />
          <Route path="blood-donation-info" element={<BloodDonationInfoPage />} />
          <Route path="donation-applications" element={<BloodOrderTable orders={[]} activeTab="donation" onStatusChange={() => {}} onNoteChange={() => {}} onViewDetail={() => {}} />} />
          <Route path="*" element={<Navigate to="/staff" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default StaffPage;