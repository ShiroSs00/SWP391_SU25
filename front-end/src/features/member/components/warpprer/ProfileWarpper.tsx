import React from 'react';
import { useNavigate } from 'react-router-dom';
import  ProfilePage  from '../../pages/ProfilePage';
import { useDashboard } from '../../hooks/useDashboard';

export const ProfileWrapper: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    loading,
    error,
    loadInitialData,
    handleProfileUpdate,
  } = useDashboard();

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleViewSettings = () => {
    navigate('/settings');
  };

  const handleNavigateToHistory = () => {
    navigate('/history');
  };

  return (
    <ProfilePage
      profile={profile}
      loading={loading}
      error={error}
      onUpdate={handleProfileUpdate}
      onRetry={loadInitialData}
    //   onEditProfile={handleEditProfile}
    //   onViewSettings={handleViewSettings}
    //   onNavigateToHistory={handleNavigateToHistory}
    />
  );
};