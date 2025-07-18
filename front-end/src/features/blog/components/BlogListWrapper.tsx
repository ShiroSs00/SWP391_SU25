import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogManagementPage } from '../pages/BlogManagementPage';
import type { BlogPost } from '../types/blog.types';

export const BlogListWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate('/blogs/create');
  };

  const handleViewPost = (blog: BlogPost) => {
    navigate(`/blogs/${blog.blogId}`);
  };

  const handleEditPost = (blog: BlogPost) => {
    navigate(`/blogs/edit/${blog.blogId}`);
  };

  return (
    <BlogManagementPage
      initialViewMode="list"
      onCreatePost={handleCreatePost}
      onViewPost={handleViewPost}
      onEditPost={handleEditPost}
    />
  );
};