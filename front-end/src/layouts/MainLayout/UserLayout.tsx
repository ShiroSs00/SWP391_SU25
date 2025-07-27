import React from 'react';
import { Outlet } from 'react-router-dom';
import  Sidebar  from '../../features/accounts/components/Sidebar'
import  Header  from '../../features/member/components/Header';
import  LoadingSpinner  from '../../features/accounts/components/LoadingSpinner';
import ErrorMessage from '../../features/accounts/components/ErrorMessage';
import { useDashboard } from '../../features/accounts/hooks/useDashboard';

export const UserLayout: React.FC = () => {
  const {
    profile,
    loading,
    error,
    loadInitialData,
  } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadInitialData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab="dashboard" 
        onTabChange={() => {}} 
      />
      <Header 
        userName={profile?.name || 'Người dùng'} 
        userAvatar={profile?.avatar} 
      />
      
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Outlet sẽ render component tương ứng với route */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};