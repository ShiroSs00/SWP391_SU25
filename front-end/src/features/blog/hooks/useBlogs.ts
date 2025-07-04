import { useState, useEffect, useCallback } from 'react';
import { blogService } from '../services/blog.service';
import type { BlogPost, BlogFilters, CreateBlogRequest, UpdateBlogRequest } from '../types/blog.types';
import toast from 'react-hot-toast';

interface UseBlogState {
    blogs: BlogPost[];
    currentBlog: BlogPost | null;
    loading: boolean;
    error: string | null;
    filters: BlogFilters;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export const useBlog = () => {
    const [state, setState] = useState<UseBlogState>({
        blogs: [],
        currentBlog: null,
        loading: false,
        error: null,
        filters: {
            sortBy: 'createdAt',
            sortOrder: 'desc',
        },
        pagination: {
            page: 1,
            limit: 12,
            total: 0,
        },
    });

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, loading }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error }));
    };

    const setBlogs = (blogs: BlogPost[]) => {
        setState(prev => ({ ...prev, blogs }));
    };

    const setCurrentBlog = (blog: BlogPost | null) => {
        setState(prev => ({ ...prev, currentBlog: blog }));
    };

    const setFilters = (filters: Partial<BlogFilters>) => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, ...filters },
            pagination: { ...prev.pagination, page: 1 }, // Reset to first page when filtering
        }));
    };

    // Fetch all blogs using axios
    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const blogs = await blogService.getAllBlogs();
            let filteredBlogs = [...blogs];

            // Apply filters
            if (state.filters.search) {
                const searchTerm = state.filters.search.toLowerCase();
                filteredBlogs = filteredBlogs.filter(blog =>
                    blog.title.toLowerCase().includes(searchTerm) ||
                    blog.content.toLowerCase().includes(searchTerm) ||
                    blog.summary?.toLowerCase().includes(searchTerm)
                );
            }

            if (state.filters.tags && state.filters.tags.length > 0) {
                filteredBlogs = filteredBlogs.filter(blog =>
                    state.filters.tags!.some(tag => blog.tags.includes(tag))
                );
            }

            if (state.filters.author) {
                filteredBlogs = filteredBlogs.filter(blog =>
                    blog.author.name.toLowerCase().includes(state.filters.author!.toLowerCase())
                );
            }

            // Apply sorting
            filteredBlogs.sort((a, b) => {
                const { sortBy = 'createdAt', sortOrder = 'desc' } = state.filters;
                let comparison = 0;

                switch (sortBy) {
                    case 'createdAt':
                        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                        break;
                    case 'title':
                        comparison = a.title.localeCompare(b.title);
                        break;
                    case 'viewCount':
                        comparison = (a.viewCount || 0) - (b.viewCount || 0);
                        break;
                    default:
                        comparison = 0;
                }

                return sortOrder === 'desc' ? -comparison : comparison;
            });

            setState(prev => ({
                ...prev,
                blogs: filteredBlogs,
                pagination: {
                    ...prev.pagination,
                    total: filteredBlogs.length,
                },
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách bài viết';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [state.filters]);

    // Fetch single blog using axios
    const fetchBlog = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const blog = await blogService.getBlogById(id);
            setCurrentBlog(blog);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải bài viết';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create blog using axios
    const createBlog = useCallback(async (blogData: CreateBlogRequest): Promise<BlogPost | null> => {
        setLoading(true);
        setError(null);

        try {
            const newBlog = await blogService.createBlog(blogData);
            toast.success('Tạo bài viết thành công!');

            // Refresh blogs list
            await fetchBlogs();

            return newBlog;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo bài viết';
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchBlogs]);

    // Update blog using axios
    const updateBlog = useCallback(async (id: string, blogData: UpdateBlogRequest): Promise<BlogPost | null> => {
        setLoading(true);
        setError(null);

        try {
            const updatedBlog = await blogService.updateBlog(id, blogData);
            toast.success('Cập nhật bài viết thành công!');

            // Update current blog if it's the one being edited
            if (state.currentBlog?.id === id) {
                setCurrentBlog(updatedBlog);
            }

            // Refresh blogs list
            await fetchBlogs();

            return updatedBlog;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật bài viết';
            setError(errorMessage);
            toast.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [state.currentBlog?.id, fetchBlogs]);

    // Delete blog using axios
    const deleteBlog = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await blogService.deleteBlog(id);
            toast.success('Xóa bài viết thành công!');

            // Remove from blogs list
            setBlogs(state.blogs.filter(blog => blog.id !== id));

            // Clear current blog if it's the one being deleted
            if (state.currentBlog?.id === id) {
                setCurrentBlog(null);
            }

            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa bài viết';
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [state.blogs, state.currentBlog?.id]);

    // Get paginated blogs
    const getPaginatedBlogs = useCallback(() => {
        const { page, limit } = state.pagination;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return state.blogs.slice(startIndex, endIndex);
    }, [state.blogs, state.pagination]);

    // Set page
    const setPage = (page: number) => {
        setState(prev => ({
            ...prev,
            pagination: { ...prev.pagination, page },
        }));
    };

    // Initialize
    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);


    return {
        ...state,
        fetchBlogs,
        fetchBlog,
        createBlog,
        updateBlog,
        deleteBlog,
        setFilters,
        setPage,
        getPaginatedBlogs,
        clearError: () => setError(null),
        clearCurrentBlog: () => setCurrentBlog(null),
    };
};

