import { useState, useEffect } from 'react';
import { Feedback, FeedbackForm, FeedbackStats, Survey } from '../types/feedback.types';
import { feedbackService } from '../services/feedback.service';

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (feedback: FeedbackForm) => {
    try {
      setLoading(true);
      setError(null);
      const newFeedback = await feedbackService.submitFeedback(feedback);
      setFeedbacks(prev => [newFeedback, ...prev]);
      return newFeedback;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackService.getFeedbacks(page, limit);
      setFeedbacks(data.feedbacks);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await feedbackService.getFeedbackStats();
      setStats(statsData);
      return statsData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    feedbacks,
    stats,
    loading,
    error,
    submitFeedback,
    fetchFeedbacks,
    fetchStats
  };
}

export function useSurvey() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackService.getSurveys();
      setSurveys(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitSurveyResponse = async (surveyId: string, responses: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.submitSurveyResponse(surveyId, responses);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  return {
    surveys,
    loading,
    error,
    fetchSurveys,
    submitSurveyResponse
  };
}