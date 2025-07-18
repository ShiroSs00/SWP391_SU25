import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { BlogManagementPage } from '../pages/BlogManagementPage';

export const BlogPostWrapper: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

  if (!blogId) {
    return <Navigate to="/blogs" replace />;
  }

  const handleBack = () => {
    navigate('/blogs');
  };

  const handleEdit = () => {
    navigate(`/blogs/edit/${blogId}`);
  };

  return (
    <BlogManagementPage
      initialViewMode="detail"
      blogId={blogId}
      onBack={handleBack}
      onEditPost={handleEdit}
    />
  );
};