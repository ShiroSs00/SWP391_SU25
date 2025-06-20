import { useState, useEffect } from 'react';
import { BlogComment } from '../types/blog.types';
import { blogService } from '../services/blog.service';

export function useComments(postId: string) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const fetchComments = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getComments(postId, page, limit);
      setComments(data.comments);
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

  const addComment = async (content: string, parentId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const newComment = await blogService.addComment(postId, content, parentId);
      
      if (parentId) {
        // Add as reply
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...(comment.replies || []), newComment] }
            : comment
        ));
      } else {
        // Add as new comment
        setComments(prev => [newComment, ...prev]);
      }
      
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      await blogService.likeComment(commentId);
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1, isLiked: true };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === commentId
                ? { ...reply, likes: reply.likes + 1, isLiked: true }
                : reply
            )
          };
        }
        return comment;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    error,
    pagination,
    fetchComments,
    addComment,
    likeComment
  };
}