import { useNavigate } from "react-router-dom";
import DashboardPage from "../../pages/DashboardPage";
import React from "react";
import { useDashboard } from "../../hooks/useDashboard";


export const DashboardWarpper: React.FC = () => {
    const navigate = useNavigate();
    const {
        profile,
        loading,
        error,
        loadInitialData,
    } = useDashboard();
    
    const handleEditProfile = () => {
        navigate("/profile/edit");
    };
    
    const handleViewAchievements = () => {
        navigate("/achievements");
    };
    
    const handleViewHistory = () => {
        navigate("/history");
    };
    
    const handleViewFeedback = () => {
        navigate("/feedback");
    };
    
    const handleViewSettings = () => {
        navigate("/settings");
    };
    
    // You may need to fetch or define donationHistory, achievements, and events using useDashboard or other hooks.
    // Here are placeholder empty arrays; replace with actual data as needed.
    return (
        <DashboardPage
            profile={profile}
            loading={loading}
            error={error}
            onRetry={loadInitialData}
            donationHistory={[]} // Replace with actual donation history data
            achievements={[]}    // Replace with actual achievements data
            events={[]}          // Replace with actual events data
            // // onEditProfile={handleEditProfile}
            // // onViewAchievements={handleViewAchievements}
            // onViewHistory={handleViewHistory}
            // onViewFeedback={handleViewFeedback}
            // onViewSettings={handleViewSettings}
        />
    );
    }
