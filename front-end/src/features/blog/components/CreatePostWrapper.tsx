import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogManagementPage } from '../pages/BlogManagementPage';

export const CreatePostWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/blogs');
  };

  const handleSuccess = (blogId: string) => {
    navigate(`/blogs/${blogId}`);
  };

  return (
    <BlogManagementPage
      initialViewMode="create"
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
};