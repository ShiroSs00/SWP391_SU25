import React from 'react';
import { useNavigate } from 'react-router-dom';
import  AchievementsPage  from '../../pages/AchievementsPage';
import { useDashboard } from '../../hooks/useDashboard';

export const AchievementsWrapper: React.FC = () => {
  const navigate = useNavigate();
  const {
    achievements,
    loading,
    error,
    loadInitialData,
  } = useDashboard();

  const handleViewAchievementDetails = (achievementId: string) => {
    navigate(`/achievements/${achievementId}`);
  };

  const handleShareAchievement = (achievementId: string) => {
    // Logic for sharing achievement
    console.log('Sharing achievement:', achievementId);
  };


  const handleNavigateToPoints = () => {
    navigate('/points');
  };

  const handleNavigateToHistory = () => {
    navigate('/history');
  };

  return (
    <AchievementsPage
      achievements={achievements}
      loading={loading}
      error={error}
      onRetry={loadInitialData}
    //   onViewDetails={handleViewAchievementDetails}
    //   onShare={handleShareAchievement}
      // onNavigateToPoints={handleNavigateToPoints}
      // onNavigateToHistory={handleNavigateToHistory}
    />
  );
};