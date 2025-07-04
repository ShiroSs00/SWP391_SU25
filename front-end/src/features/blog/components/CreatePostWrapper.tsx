import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreatePostPage } from '../pages/CreatePostPage';

export const CreatePostWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/blogs');
  };

  const handleSuccess = () => {
    navigate('/blogs');
  };

  return (
    <CreatePostPage
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
};