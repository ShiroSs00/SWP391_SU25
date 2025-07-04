import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogListPage } from '../pages/BlogListPage';
import type { BlogPost } from '../types/blog.types';

export const BlogListWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate('/blogs/create');
  };

  const handleViewPost = (blog: BlogPost) => {
    navigate(`/blogs/${blog.id}`);
  };

  const handleEditPost = (blog: BlogPost) => {
    navigate(`/blogs/edit/${blog.id}`);
  };

  return (
    <BlogListPage
      onCreatePost={handleCreatePost}
      onViewPost={handleViewPost}
      onEditPost={handleEditPost}
    />
  );
};