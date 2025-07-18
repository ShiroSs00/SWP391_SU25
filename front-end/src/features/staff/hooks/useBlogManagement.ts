import { useState, useCallback } from 'react';
import { blogService } from '../services/blog.service';
import type { 
    Blog, 
    GetBlogsParams, 
    UpdateBlogRequest,
    DeleteBlogResponse 
} from '../types/blog.types';

export const useBlogManagement = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10
    });

    // Lấy danh sách blogs
    const fetchBlogs = useCallback(async (params?: GetBlogsParams) => {
        try {
            setLoading(true);
            setError(null);
            const response = await blogService.getBlogs(params);
            setBlogs(response.blogs);
            setPagination({
                total: response.total || 0,
                page: response.page || 1,
                limit: response.limit || 10
            });
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy blog theo ID
    const fetchBlogById = useCallback(async (blogId: string): Promise<Blog> => {
        try {
            setLoading(true);
            setError(null);
            const blog = await blogService.getBlogById(blogId);
            return blog;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cập nhật blog
    const updateBlog = useCallback(async (blogId: string, blogData: UpdateBlogRequest): Promise<Blog> => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const updatedBlog = await blogService.updateBlog(blogId, blogData);
            
            // Cập nhật blog trong danh sách
            setBlogs(prev => prev.map(blog => 
                blog.blogId === blogId ? updatedBlog : blog
            ));
            
            setSuccess('Cập nhật bài viết thành công');
            return updatedBlog;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Xóa blog
    const deleteBlog = useCallback(async (blogId: string): Promise<DeleteBlogResponse> => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const response = await blogService.deleteBlog(blogId);
            
            // Xóa blog khỏi danh sách
            setBlogs(prev => prev.filter(blog => blog.blogId !== blogId));
            
            setSuccess('Xóa bài viết thành công');
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Xóa nhiều blogs
    const deleteMultipleBlogs = useCallback(async (blogIds: string[]): Promise<DeleteBlogResponse> => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const response = await blogService.deleteMultipleBlogs(blogIds);
            
            // Xóa các blogs khỏi danh sách
            setBlogs(prev => prev.filter(blog => !blogIds.includes(blog.blogId)));
            
            setSuccess(`Xóa ${blogIds.length} bài viết thành công`);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear messages
    const clearError = useCallback(() => setError(null), []);
    const clearSuccess = useCallback(() => setSuccess(null), []);

    return {
        blogs,
        loading,
        error,
        success,
        pagination,
        fetchBlogs,
        fetchBlogById,
        updateBlog,
        deleteBlog,
        deleteMultipleBlogs,
        clearError,
        clearSuccess
    };
};
