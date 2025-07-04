import { useState, useEffect, useCallback } from 'react';
import type { BlogComment, BlogInteraction } from '../types/blog.types';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface UseCommentsState {
    interactions: Record<string, BlogInteraction>;
    loading: boolean;
    error: string | null;
}

export const useComments = () => {
    const { user, canComment, canLike } = useAuth();
    const [state, setState] = useState<UseCommentsState>({
        interactions: {},
        loading: false,
        error: null,
    });

    // Load interactions from localStorage
    useEffect(() => {
        try {
            const savedInteractions = localStorage.getItem('blogInteractions');
            if (savedInteractions) {
                const interactions = JSON.parse(savedInteractions);
                setState(prev => ({ ...prev, interactions }));
            }
        } catch (error) {
            console.error('Error loading interactions:', error);
        }
    }, []);

    // Save interactions to localStorage
    const saveInteractions = useCallback((interactions: Record<string, BlogInteraction>) => {
        try {
            localStorage.setItem('blogInteractions', JSON.stringify(interactions));
        } catch (error) {
            console.error('Error saving interactions:', error);
        }
    }, []);

    // Get blog interaction
    const getBlogInteraction = useCallback((blogId: string): BlogInteraction => {
        return state.interactions[blogId] || {
            blogId,
            likes: [],
            comments: [],
            likeCount: 0,
            commentCount: 0,
        };
    }, [state.interactions]);

    // Check if user liked a blog
    const isLiked = useCallback((blogId: string): boolean => {
        if (!user) return false;
        const interaction = getBlogInteraction(blogId);
        return interaction.likes.some(like => like.userId === user.id);
    }, [user, getBlogInteraction]);

    // Toggle like
    const toggleLike = useCallback(async (blogId: string): Promise<boolean> => {
        if (!user || !canLike()) {
            toast.error('Bạn cần đăng nhập để thích bài viết');
            return false;
        }

        setState(prev => ({ ...prev, loading: true }));

        try {
            const currentInteraction = getBlogInteraction(blogId);
            const userLikeIndex = currentInteraction.likes.findIndex(like => like.userId === user.id);

            const newLikes = [...currentInteraction.likes];
            let action = '';

            if (userLikeIndex >= 0) {
                // Unlike
                newLikes.splice(userLikeIndex, 1);
                action = 'unliked';
            } else {
                // Like
                newLikes.push({
                    id: `${blogId}-${user.id}-${Date.now()}`,
                    blogId,
                    userId: user.id,
                    createdAt: new Date().toISOString(),
                });
                action = 'liked';
            }

            const updatedInteraction: BlogInteraction = {
                ...currentInteraction,
                likes: newLikes,
                likeCount: newLikes.length,
            };

            const newInteractions = {
                ...state.interactions,
                [blogId]: updatedInteraction,
            };

            setState(prev => ({ ...prev, interactions: newInteractions }));
            saveInteractions(newInteractions);

            if (action === 'liked') {
                toast.success('Đã thích bài viết!');
            }

            return true;
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Có lỗi xảy ra khi thích bài viết');
            return false;
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [user, canLike, getBlogInteraction, state.interactions, saveInteractions]);

    // Add comment
    const addComment = useCallback(async (
        blogId: string,
        content: string,
        parentId?: string
    ): Promise<boolean> => {
        if (!user || !canComment()) {
            toast.error('Bạn cần đăng nhập để bình luận');
            return false;
        }

        if (!content.trim()) {
            toast.error('Nội dung bình luận không được để trống');
            return false;
        }

        setState(prev => ({ ...prev, loading: true }));

        try {
            const currentInteraction = getBlogInteraction(blogId);

            const newComment: BlogComment = {
                id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                blogId,
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                content: content.trim(),
                createdAt: new Date().toISOString(),
                parentId,
                replies: [],
            };

            const newComments = [...currentInteraction.comments];

            if (parentId) {
                // Add as reply
                const parentIndex = newComments.findIndex(comment => comment.id === parentId);
                if (parentIndex >= 0) {
                    if (!newComments[parentIndex].replies) {
                        newComments[parentIndex].replies = [];
                    }
                    newComments[parentIndex].replies!.push(newComment);
                }
            } else {
                // Add as top-level comment
                newComments.push(newComment);
            }

            const updatedInteraction: BlogInteraction = {
                ...currentInteraction,
                comments: newComments,
                commentCount: newComments.length + newComments.reduce((acc, comment) => acc + (comment.replies?.length || 0), 0),
            };

            const newInteractions = {
                ...state.interactions,
                [blogId]: updatedInteraction,
            };

            setState(prev => ({ ...prev, interactions: newInteractions }));
            saveInteractions(newInteractions);

            toast.success('Đã thêm bình luận!');
            return true;
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Có lỗi xảy ra khi thêm bình luận');
            return false;
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [user, canComment, getBlogInteraction, state.interactions, saveInteractions]);

    // Delete comment
    const deleteComment = useCallback(async (blogId: string, commentId: string): Promise<boolean> => {
        if (!user) {
            toast.error('Bạn cần đăng nhập để xóa bình luận');
            return false;
        }

        setState(prev => ({ ...prev, loading: true }));

        try {
            const currentInteraction = getBlogInteraction(blogId);

            // Find and remove comment (including from replies)
            const removeCommentRecursive = (comments: BlogComment[]): BlogComment[] => {
                return comments.filter(comment => {
                    if (comment.id === commentId) {
                        // Check if user can delete this comment
                        if (comment.userId !== user.id && user.role !== 'ADMIN' && user.role !== 'STAFF') {
                            throw new Error('Bạn không có quyền xóa bình luận này');
                        }
                        return false;
                    }

                    if (comment.replies) {
                        comment.replies = removeCommentRecursive(comment.replies);
                    }

                    return true;
                });
            };

            const newComments = removeCommentRecursive(currentInteraction.comments);

            const updatedInteraction: BlogInteraction = {
                ...currentInteraction,
                comments: newComments,
                commentCount: newComments.length + newComments.reduce((acc, comment) => acc + (comment.replies?.length || 0), 0),
            };

            const newInteractions = {
                ...state.interactions,
                [blogId]: updatedInteraction,
            };

            setState(prev => ({ ...prev, interactions: newInteractions }));
            saveInteractions(newInteractions);

            toast.success('Đã xóa bình luận!');
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa bình luận';
            toast.error(errorMessage);
            return false;
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [user, getBlogInteraction, state.interactions, saveInteractions]);

    // Get comments for a blog
    const getComments = useCallback((blogId: string): BlogComment[] => {
        const interaction = getBlogInteraction(blogId);
        return interaction.comments.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [getBlogInteraction]);

    return {
        ...state,
        getBlogInteraction,
        isLiked,
        toggleLike,
        addComment,
        deleteComment,
        getComments,
    };
};