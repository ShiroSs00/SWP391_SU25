import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { EditPostPage } from '../pages/EditPostPage';

export const EditPostWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Validate that we have an ID
  if (!id) {
    return <Navigate to="/blogs" replace />;
  }

  const handleBack = () => {
    navigate(`/blogs/${id}`);
  };

  const handleSuccess = () => {
    navigate(`/blogs/${id}`);
  };

  return (
    <EditPostPage
      blogId={id}
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
};