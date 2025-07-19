import { useState, useEffect } from 'react';
import { useBloodBags } from './useBloodBags';
import { useFeedbacks } from './useFeedbacks';
import { useAchievements } from './useAchievements';
import { getAllEvents } from './useEvents';
import type { AdminEvent } from '../types/admin.types';

export interface DashboardStats {
  totalBloodBags: number;
  validBloodBags: number;
  expiredBloodBags: number;
  usedBloodBags: number;
  totalFeedbacks: number;
  averageRating: number;
  totalAchievements: number;
  totalEvents: number;
  totalVolume: number;
}

export const useDashboard = () => {
  const { bloodBags, loading: bloodLoading } = useBloodBags();
  const { feedbacks, loading: feedbackLoading } = useFeedbacks();
  const { achievements, loading: achievementLoading } = useAchievements();
  
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [eventLoading, setEventLoading] = useState(true);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalBloodBags: 0,
    validBloodBags: 0,
    expiredBloodBags: 0,
    usedBloodBags: 0,
    totalFeedbacks: 0,
    averageRating: 0,
    totalAchievements: 0,
    totalEvents: 0,
    totalVolume: 0,
  });

  const loading = bloodLoading || feedbackLoading || achievementLoading || eventLoading;

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventLoading(true);
        const eventData = await getAllEvents();
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setEventLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Calculate blood bag statistics
    const totalBloodBags = bloodBags.length;
    const validBloodBags = bloodBags.filter(bag => 
      bag.status?.toLowerCase() === 'valid'
    ).length;
    const expiredBloodBags = bloodBags.filter(bag => 
      bag.status?.toLowerCase() === 'expired'
    ).length;
    const usedBloodBags = bloodBags.filter(bag => 
      bag.status?.toLowerCase() === 'used'
    ).length;

    // Calculate total volume
    const totalVolume = bloodBags.reduce((sum, bag) => sum + (bag.volume || 0), 0);

    // Calculate feedback statistics  
    const totalFeedbacks = feedbacks.length;
    const averageRating = feedbacks.length > 0 
      ? feedbacks.reduce((sum, feedback) => {
          const avg = (feedback.process + feedback.bloodTest + feedback.postDonationCare + feedback.comfortable) / 4;
          return sum + avg;
        }, 0) / feedbacks.length
      : 0;

    // Calculate achievement statistics
    const totalAchievements = achievements.length;

    // Calculate event statistics
    const totalEvents = events.length;

    setStats({
      totalBloodBags,
      validBloodBags,
      expiredBloodBags,
      usedBloodBags,
      totalFeedbacks,
      averageRating,
      totalAchievements,
      totalEvents,
      totalVolume,
    });
  }, [bloodBags, feedbacks, achievements, events]);

  return {
    stats,
    loading,
    bloodBags,
    feedbacks,
    achievements,
    events,
  };
};
