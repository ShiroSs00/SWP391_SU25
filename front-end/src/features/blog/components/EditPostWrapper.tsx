import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { BlogManagementPage } from '../pages/BlogManagementPage';

export const EditPostWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
    <BlogManagementPage
      initialViewMode="edit"
      blogId={id}
      onBack={handleBack}
      onSuccess={handleSuccess}
    />
  );
};