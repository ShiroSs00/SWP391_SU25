import { useState, useEffect } from 'react';
import { BlogPost, BlogFilters, BlogStats, BlogForm } from '../types/blog.types';
import { blogService } from '../services/blog.service';

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const fetchPosts = async (page = 1, limit = 10, filters?: BlogFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getPosts(page, limit, filters);
      setPosts(data.posts);
      setPagination({
        page,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPostBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const post = await blogService.getPostBySlug(slug);
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: BlogForm) => {
    try {
      setLoading(true);
      setError(null);
      const newPost = await blogService.createPost(post);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, post: Partial<BlogForm>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPost = await blogService.updatePost(id, post);
      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));
      return updatedPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await blogService.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (id: string) => {
    try {
      await blogService.likePost(id);
      setPosts(prev => prev.map(p => 
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    likePost
  };
}

export function useBlogStats() {
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await blogService.getBlogStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats
  };
}