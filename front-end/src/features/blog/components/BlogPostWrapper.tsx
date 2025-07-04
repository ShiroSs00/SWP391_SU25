import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { BlogPostPage } from '../pages/BlogPostPage';

export const BlogPostWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Validate that we have an ID
  if (!id) {
    return <Navigate to="/blogs" replace />;
  }

  const handleBack = () => {
    navigate('/blogs');
  };

  const handleEdit = () => {
    navigate(`/blogs/edit/${id}`);
  };

  return (
    <BlogPostPage
      blogId={id}
      onBack={handleBack}
      onEdit={handleEdit}
    />
  );
};