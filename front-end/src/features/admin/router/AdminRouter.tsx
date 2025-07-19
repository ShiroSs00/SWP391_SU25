import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import EventPage from '../pages/eventPage';
import AccountManage from '../components/accountmanage';
import FeedbackManage from '../components/FeedbackManage';
import BloodBagsManage from '../components/BloodBagsManage';
import AchievementsPage from '../pages/achievements.manage';

const AdminRouter: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Admin routes */}
      <Route path="dashboard" element={
        <>
          <h1 className="text-3xl font-bold text-center text-[#b71c1c] mb-8">Trang quản trị hệ thống</h1>
          <AdminDashboard />
        </>
      } />
      <Route path="users" element={<AccountManage />} />
      <Route path="events" element={<EventPage />} />
      <Route path="feedback" element={<FeedbackManage />} />
      <Route path="blood" element={<BloodBagsManage />} />
      <Route path="achievements" element={<AchievementsPage />} />
      <Route path="stats" element={
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600 text-lg animate-fade-in">
          <p>Chức năng thống kê và báo cáo đang được phát triển...</p>
        </div>
      } />
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600 text-lg animate-fade-in">
          <p>Chức năng này đang được phát triển...</p>
        </div>
      } />
    </Routes>
  );
};

export default AdminRouter;
