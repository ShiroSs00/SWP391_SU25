import React from 'react';
import { useNavigate } from 'react-router-dom';
import  PointsPage  from '../../pages/PointsPage';
import { useDashboard } from '../../hooks/useDashboard';

export const PointsWrapper: React.FC = () => {
  const navigate = useNavigate();
  const {
    pointsData,
    loading,
    error,
    loadInitialData,
    handleRewardRedeem,
  } = useDashboard();

  const handleRedeemReward = async (rewardId: string) => {
    await handleRewardRedeem(rewardId);
  };

  const handleViewRewardDetails = (rewardId: string) => {
    navigate(`/rewards/${rewardId}`);
  };

  const handleViewTransactionHistory = () => {
    navigate('/points/history');
  };

  const handleNavigateToAchievements = () => {
    navigate('/achievements');
  };

  const handleNavigateToEvents = () => {
    navigate('/events');
  };

  const handleViewTermsAndConditions = () => {
    navigate('/terms');
  };

  return (
    <PointsPage
      pointsData={pointsData}
      loading={loading}
      error={error}
      onRedeem={handleRedeemReward}
      onRetry={loadInitialData}
    //   onViewRewardDetails={handleViewRewardDetails}
    //   onViewTransactionHistory={handleViewTransactionHistory}
    //   onNavigateToAchievements={handleNavigateToAchievements}
    //   onNavigateToEvents={handleNavigateToEvents}
    //   onViewTermsAndConditions={handleViewTermsAndConditions}
    />
  );
};