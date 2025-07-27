import { useState, useEffect } from 'react';
import {
  getProfile,
  updateProfile,
  getDonationHistory,
  getReceivingHistory,
  getAchievements,
  getPointsData,
  getEventParticipations,
  getFeedback,
  submitFeedback,
  updateFeedback,
  redeemReward
} from '../services/dashboard.service';
import type { 
  ProfileData, 
  DonationRecord, 
  Achievement, 
  PointsData, 
  EventParticipation, 
  FeedbackItem 
} from '../types/dashboard.type';

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [donationHistory, setDonationHistory] = useState<DonationRecord[]>([]);
  const [receivingHistory, setReceivingHistory] = useState<DonationRecord[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [events, setEvents] = useState<EventParticipation[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  // Load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Vui lòng đăng nhập để tiếp tục');
        return;
      }

      const [
        profileData,
        donationData,
        receivingData,
        achievementsData,
        pointsDataResult,
        eventsData,
        feedbackData
      ] = await Promise.allSettled([
        getProfile(),
        getDonationHistory(),
        getReceivingHistory(),
        getAchievements(),
        getPointsData(),
        getEventParticipations(),
        getFeedback()
      ]);

      // Handle profile data
      if (profileData.status === 'fulfilled') {
        setProfile(profileData.value);
      } else {
        console.error('Error loading profile:', profileData.reason);
      }

      // Handle donation history
      if (donationData.status === 'fulfilled') {
        setDonationHistory(donationData.value);
      } else {
        console.error('Error loading donation history:', donationData.reason);
      }

      // Handle receiving history
      if (receivingData.status === 'fulfilled') {
        setReceivingHistory(receivingData.value);
      } else {
        console.error('Error loading receiving history:', receivingData.reason);
      }

      // Handle achievements
      if (achievementsData.status === 'fulfilled') {
        setAchievements(achievementsData.value);
      } else {
        console.error('Error loading achievements:', achievementsData.reason);
      }

      // Handle points data
      if (pointsDataResult.status === 'fulfilled') {
        setPointsData(pointsDataResult.value);
      } else {
        console.error('Error loading points data:', pointsDataResult.reason);
      }

      // Handle events
      if (eventsData.status === 'fulfilled') {
        setEvents(eventsData.value);
      } else {
        console.error('Error loading events:', eventsData.reason);
      }

      // Handle feedback
      if (feedbackData.status === 'fulfilled') {
        setFeedback(feedbackData.value);
      } else {
        console.error('Error loading feedback:', feedbackData.reason);
      }

    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleProfileUpdate = async (updatedData: Partial<ProfileData>) => {
    try {
      const updatedProfile = await updateProfile(updatedData);
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
      throw err;
    }
  };

  const handleFeedbackSubmit = async (feedbackData: {
    message: string;
    rating: number;
    relatedRecordId: string;
  }) => {
    try {
      // Check if feedback already exists
      const existingFeedback = feedback.find(f => f.relatedRecordId === feedbackData.relatedRecordId);
      
      let newFeedback: FeedbackItem;
      if (existingFeedback) {
        // Update existing feedback
        newFeedback = await updateFeedback(feedbackData.relatedRecordId, {
          message: feedbackData.message,
          rating: feedbackData.rating
        });
        // Update feedback in state
        setFeedback(prev => prev.map(f => 
          f.relatedRecordId === feedbackData.relatedRecordId ? newFeedback : f
        ));
      } else {
        // Create new feedback
        newFeedback = await submitFeedback(feedbackData);
        setFeedback(prev => [newFeedback, ...prev]);
      }
      
      return newFeedback;
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Không thể gửi phản hồi. Vui lòng thử lại.');
      throw err;
    }
  };

  const handleRewardRedeem = async (rewardId: string) => {
    try {
      await redeemReward(rewardId);
      // Reload points data to reflect the change
      const updatedPointsData = await getPointsData();
      setPointsData(updatedPointsData);
    } catch (err) {
      console.error('Error redeeming reward:', err);
      setError('Không thể đổi thưởng. Vui lòng thử lại.');
      throw err;
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    // Data
    profile,
    donationHistory,
    receivingHistory,
    achievements,
    pointsData,
    events,
    feedback,
    
    // States
    loading,
    error,
    
    // Actions
    loadInitialData,
    handleProfileUpdate,
    handleFeedbackSubmit,
    handleRewardRedeem,
    
    // Setters for local state management
    setError
  };
};