import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  FeedbackPage  from '../../pages/FeedbackPage';
import { useDashboard } from '../../hooks/useDashboard';

export const FeedbackWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  
  const {
    feedback,
    loading,
    error,
    loadInitialData,
    handleFeedbackSubmit,
  } = useDashboard();

  const handleViewFeedbackDetails = (feedbackId: string) => {
    navigate(`/feedback/${feedbackId}`);
  };

  const handleEditFeedback = (feedbackId: string) => {
    navigate(`/feedback/edit/${feedbackId}`);
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    // Logic for deleting feedback
    console.log('Deleting feedback:', feedbackId);
  };

  const handleCreateNewFeedback = () => {
    navigate('/feedback/create');
  };

  const handleViewRelatedRecord = (recordId: string) => {
    navigate(`/history/details/${recordId}`);
  };

  const handleFilterFeedback = (filterType: string) => {
    navigate(`/feedback?filter=${filterType}`);
  };

  const handleSortFeedback = (sortType: string) => {
    navigate(`/feedback?sort=${sortType}`);
  };

  const handleSelectFeedback = (feedbackId: string) => {
    setSelectedFeedback(feedbackId);
  };

  const handleBulkDelete = () => {
    if (selectedFeedback) {
      console.log('Bulk deleting feedback:', selectedFeedback);
      setSelectedFeedback(null);
    }
  };

  return (
    <FeedbackPage
      feedback={feedback}
      loading={loading}
      error={error}
      onRetry={loadInitialData}
    //   onViewDetails={handleViewFeedbackDetails}
    //   onEdit={handleEditFeedback}
    //   onDelete={handleDeleteFeedback}
    //   onCreate={handleCreateNewFeedback}
    //   onViewRelatedRecord={handleViewRelatedRecord}
    //   onFilter={handleFilterFeedback}
    //   onSort={handleSortFeedback}
    //   onSelect={handleSelectFeedback}
    //   onBulkDelete={handleBulkDelete}
    //   selectedFeedback={selectedFeedback}
    />
  );
};