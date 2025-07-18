import { useState, useEffect } from 'react';
import { blogService } from '../services/blog.service';
import type { BlogPost } from '../types/blog.types';

interface UseLatestBlogsReturn {
  blogs: BlogPost[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useLatestBlogs = (limit: number = 6): UseLatestBlogsReturn => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await blogService.getLatestBlogs();
      
      // Limit the number of blogs if needed
      const limitedBlogs = Array.isArray(data) ? data.slice(0, limit) : [data].slice(0, limit);
      
      setBlogs(limitedBlogs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải bài viết mới nhất';
      setError(errorMessage);
      console.error('Error fetching latest blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestBlogs();
  }, [limit]);

  return {
    blogs,
    isLoading,
    error,
    refetch: fetchLatestBlogs,
  };
};