import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/sections/ProtectedRoute';
import DonorRegisterForm from '../forms/DonorRegister/DonorRegisterForm';
import ProfilePage from '../pages/profilePage/profile';
import RequestBloodForm from '../forms/RequestBlood/RequestBloodForm';
import Dashboard from '../pages/dashboard/dashboard';
import StaffPage from '../pages/staffPages/staffPage';
import AdminPage from '../pages/adminPage/adminPage';
import AdviceForMembersPage from '../pages/staffPages/AdviceForMembersPage';
import BlogManagement from '../pages/staffPages/BlogManagement';
import BloodDonationInfoPage from '../pages/staffPages/BloodDonationInfoPage';

interface ProtectedRoutesProps {
  isSidebarOpen: boolean;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ isSidebarOpen }) => {
  return (
    <Routes>
      {/* Member Section */}
      <Route
        path="donate"
        element={
          <ProtectedRoute allowedRoles={['member', 'admin', 'staff']}>
            <DonorRegisterForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute allowedRoles={['member', 'admin', 'staff']}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="need-blood-donate"
        element={
          <ProtectedRoute allowedRoles={['member', 'admin', 'staff']}>
            <RequestBloodForm />
          </ProtectedRoute>
        }
      />

      {/* Staff Section */}
      <Route
        path="staff/*"
        element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StaffPage isSidebarOpen={isSidebarOpen} />
          </ProtectedRoute>
        }
      >
        <Route path="advice-for-members" element={<AdviceForMembersPage />} />
        <Route path="donation-applications" element={<BloodDonationInfoPage />} />
      </Route>
  
      {/* Admin Section */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default ProtectedRoutes; 