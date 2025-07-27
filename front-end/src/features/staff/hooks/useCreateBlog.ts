import { useState, useCallback } from 'react';
import { blogService } from '../services/blog.service';
import type { CreateBlogRequest, CreateBlogResponse } from '../types/blog.types';

export const useCreateBlog = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createBlog = useCallback(async (blogData: CreateBlogRequest | FormData): Promise<CreateBlogResponse | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await blogService.createBlog(blogData);
            setSuccess(true);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo bài viết';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearSuccess = useCallback(() => {
        setSuccess(false);
    }, []);

    return {
        createBlog,
        loading,
        error,
        success,
        clearError,
        clearSuccess
    };
};

export default useCreateBlog;
