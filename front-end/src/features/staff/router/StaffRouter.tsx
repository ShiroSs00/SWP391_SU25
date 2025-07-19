import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DonationManage from '../../donation-register/components/donation-manage';
import RequestManage from '../../request-blood/components/request-manage';
import RequestBloodPage from '../../request-blood/pages/request-blood.page';
import HealthCheckPage from '../../health-checks/pages/healthcheckPages';
import AfterDonationPage from '../../after-donation/pages/after-donation.pages';
import BlogManagePage from '../pages/BlogManagePage';

const StaffRouter: React.FC = () => {
  return (
    <Routes>
      {/* Redirect từ /staff về /staff/donation */}
      <Route index element={<Navigate to="donation" replace />} />
      
      {/* Staff routes */}
      <Route path="donation" element={<DonationManage />} />
      <Route path="receive" element={<RequestManage />} />
      <Route path="request" element={<RequestBloodPage />} />
      <Route path="health" element={<HealthCheckPage />} />
      <Route path="bloodtest" element={<AfterDonationPage />} />
      <Route path="blog" element={<BlogManagePage />} />
      
      {/* Fallback route cho các page chưa được phát triển */}
      <Route path="*" element={
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600 text-lg animate-fade-in">
          <p>Chức năng này đang được phát triển...</p>
        </div>
      } />
    </Routes>
  );
};

export default StaffRouter;
