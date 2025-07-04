import { useState, useEffect, useCallback } from 'react';
import type { DonorFeedback, CreateFeedbackRequest, UpdateFeedbackRequest, FeedbackFilters, FeedbackStats } from '../types/feedback.types';
import { feedbackService } from '../services/feedback.service';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<DonorFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const createFeedback = useCallback(async (registrationId: string, data: CreateFeedbackRequest) => {
    try {
      setLoading(true);
      setError(null);
      const feedback = await feedbackService.createFeedback(registrationId, data);
      return feedback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllFeedbacks = useCallback(async (filters?: FeedbackFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await feedbackService.getAllFeedbacks(filters);
      setFeedbacks(result.feedbacks);
      setTotal(result.total);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeedbackByRegistration = useCallback(async (registrationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const feedback = await feedbackService.getFeedbackByRegistration(registrationId);
      return feedback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFeedback = useCallback(async (feedbackId: string, data: UpdateFeedbackRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedFeedback = await feedbackService.updateFeedback(feedbackId, data);
      
      // Cập nhật state local
      setFeedbacks(prev => 
        prev.map(feedback => 
          feedback.feedbackId === feedbackId ? updatedFeedback : feedback
        )
      );
      
      return updatedFeedback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFeedback = useCallback(async (feedbackId: string) => {
    try {
      setLoading(true);
      setError(null);
      await feedbackService.deleteFeedback(feedbackId);
      
      // Cập nhật state local
      setFeedbacks(prev => prev.filter(feedback => feedback.feedbackId !== feedbackId));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMultipleFeedbacks = useCallback(async (feedbackIds: string[]) => {
    try {
      setLoading(true);
      setError(null);
      await feedbackService.deleteMultipleFeedbacks(feedbackIds);
      
      // Cập nhật state local
      setFeedbacks(prev => prev.filter(feedback => !feedbackIds.includes(feedback.feedbackId)));
      setTotal(prev => prev - feedbackIds.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    feedbacks,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    createFeedback,
    getAllFeedbacks,
    getFeedbackByRegistration,
    updateFeedback,
    deleteFeedback,
    deleteMultipleFeedbacks,
    setError,
  };
};

export const useFeedbackStats = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await feedbackService.getFeedbackStats();
      setStats(statsData);
      return statsData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};