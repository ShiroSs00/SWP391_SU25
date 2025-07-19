import { useState, useEffect } from 'react';
import type { Feedback } from '../types/feedback-manage.types';
import { feedbackManageService } from '../services/feedback-manage.services';

export const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackManageService.getAllFeedbacks();
      
      if (response.success) {
        setFeedbacks(response.data);
      } else {
        setError(response.message || 'Failed to fetch feedbacks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return {
    feedbacks,
    loading,
    error,
    refetch: fetchFeedbacks
  };
};
