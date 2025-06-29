import { useState, useEffect, useCallback } from 'react';
import type{ 
  Feedback, 
  CreateFeedbackRequest, 
  UpdateFeedbackRequest, 
  FeedbackFilter,
  FeedbackStats 
}  from '../types/feedback.types';
import { feedbackService } from '../services/feedback.service';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'An error occurred';
    setError(message);
  };

  const createFeedback = useCallback(async (
    registrationId: string, 
    feedback: CreateFeedbackRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newFeedback = await feedbackService.createFeedback(registrationId, feedback);
      setFeedbacks(prev => [...prev, newFeedback]);
      return newFeedback;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFeedback = useCallback(async (
    registrationId: string, 
    feedback: UpdateFeedbackRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedFeedback = await feedbackService.updateFeedback(registrationId, feedback);
      setFeedbacks(prev => 
        prev.map(f => f.registrationId === registrationId ? updatedFeedback : f)
      );
      return updatedFeedback;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFeedback = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await feedbackService.deleteFeedback(id);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMultipleFeedbacks = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      await feedbackService.deleteMultipleFeedbacks(ids);
      setFeedbacks(prev => prev.filter(f => !ids.includes(f.id)));
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFeedbacks = useCallback(async (filter?: FeedbackFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getAllFeedbacks(filter);
      setFeedbacks(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeedbackByRegistration = useCallback(async (registrationId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await feedbackService.getFeedbackByRegistration(registrationId);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    feedbacks,
    loading,
    error,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    deleteMultipleFeedbacks,
    loadFeedbacks,
    getFeedbackByRegistration,
    clearError: () => setError(null)
  };
};

export const useFeedbackStats = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, error, refreshStats: loadStats };
};