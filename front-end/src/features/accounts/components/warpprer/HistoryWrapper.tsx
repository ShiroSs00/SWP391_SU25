import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  HistoryPage  from '../../pages/HistoryPage';
import { useDashboard } from '../../hooks/useDashboard';

export const HistoryWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [historyTab, setHistoryTab] = useState<'donation' | 'receiving'>('donation');
  const [feedbackForm, setFeedbackForm] = useState<{
    isOpen: boolean;
    recordId: string;
    existingFeedback?: string;
    existingRating?: number;
  }>({ isOpen: false, recordId: '' });

  const {
    donationHistory,
    receivingHistory,
    feedback,
    loading,
    error,
    loadInitialData,
    handleFeedbackSubmit,
  } = useDashboard();

  const handleViewDetails = (recordId: string) => {
    navigate(`/history/details/${recordId}`);
  };

  const handleBookNewDonation = () => {
    navigate('/events');
  };

  const openFeedbackForm = (recordId: string) => {
    const existingFeedback = feedback.find(f => f.relatedRecordId === recordId);
    setFeedbackForm({
      isOpen: true,
      recordId,
      existingFeedback: existingFeedback?.message,
      existingRating: existingFeedback?.rating
    });
  };

  const closeFeedbackForm = () => {
    setFeedbackForm({ isOpen: false, recordId: '' });
  };

  const onFeedbackSubmit = async (feedbackData: {
    message: string;
    rating: number;
    relatedRecordId: string;
  }) => {
    await handleFeedbackSubmit(feedbackData);
    closeFeedbackForm();
  };

  return (
    <HistoryPage
      donationHistory={donationHistory}
      receivingHistory={receivingHistory}
      historyTab={historyTab}
      loading={loading}
      error={error}
      onTabChange={setHistoryTab}
      onFeedback={openFeedbackForm}
      onRetry={loadInitialData}
    //   onViewDetails={handleViewDetails}
    //   onBookNewDonation={handleBookNewDonation}
    //   feedbackForm={feedbackForm}
    //   onFeedbackSubmit={onFeedbackSubmit}
    //   onCloseFeedback={closeFeedbackForm}
    />
  );
};