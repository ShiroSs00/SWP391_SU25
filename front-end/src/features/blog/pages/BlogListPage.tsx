import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogList } from '../components/BlogList';
import { blogService } from '../services/blog.service';
import { useAuth } from '../hooks/useAuth';
import { BLOG_TAGS, type BlogPost, type BlogTag } from '../types/blog.types';
import toast from 'react-hot-toast';

interface BlogListPageProps {
    onCreatePost: () => void;
    onViewPost: (blog: BlogPost) => void;
    onEditPost: (blog: BlogPost) => void;
    className?: string;
}

interface BlogFilters {
    search?: string;
    tags?: BlogTag[];
    sortBy?: 'createdAt' | 'viewCount' | 'title';
    sortOrder?: 'asc' | 'desc';
}

export const BlogListPage: React.FC<BlogListPageProps> = ({
                                                              onCreatePost,
                                                              onViewPost,
                                                              onEditPost,
                                                              className = ''
                                                          }) => {
    const { canCreatePost } = useAuth();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<BlogFilters>({
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 12;

    // Fetch blogs from API
    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await blogService.getAllBlogs();
            setBlogs(data);
            setFilteredBlogs(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách bài viết';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Apply filters and sorting
    const applyFilters = useCallback(() => {
        let result = [...blogs];

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(blog =>
                blog.title.toLowerCase().includes(searchTerm) ||
                blog.content.toLowerCase().includes(searchTerm) ||
                blog.summary?.toLowerCase().includes(searchTerm)
            );
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
            result = result.filter(blog =>
                filters.tags!.some(tag => blog.tags.includes(tag))
            );
        }

        // Sorting
        result.sort((a, b) => {
            const { sortBy = 'createdAt', sortOrder = 'desc' } = filters;
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

        setFilteredBlogs(result);
        setCurrentPage(1); // Reset to first page when filtering
    }, [blogs, filters]);

    // Initialize
    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Apply filters when they change
    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchTerm.trim() || undefined }));
    };

    const handleTagFilter = (tag: BlogTag) => {
        const currentTags = filters.tags || [];
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];

        setFilters(prev => ({ ...prev, tags: newTags.length > 0 ? newTags : undefined }));
    };

    const handleSortChange = (sortBy: 'createdAt' | 'viewCount' | 'title', sortOrder: 'asc' | 'desc') => {
        setFilters(prev => ({ ...prev, sortBy, sortOrder }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            search: undefined,
            tags: undefined,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
    };

    const handleBlogClick = (blog: BlogPost) => {
        onViewPost(blog);
    };

    const handleEditPost = (blog: BlogPost) => {
        onEditPost(blog);
    };

    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Blog Hiến Máu</h1>
                            <p className="mt-2 text-gray-600">
                                Chia sẻ kiến thức, kinh nghiệm và câu chuyện về hiến máu
                            </p>
                        </div>

                        {canCreatePost() && (
                            <motion.button
                                onClick={onCreatePost}
                                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Tạo bài viết
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex space-x-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm bài viết..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Bộ lọc
                        </button>
                    </form>

                    {/* Filters */}
                    {showFilters && (
                        <motion.div
                            className="border-t border-gray-200 pt-6"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Tags Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Lọc theo thẻ:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {BLOG_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagFilter(tag)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                filters.tags?.includes(tag)
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Sắp xếp theo:</h3>
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={`${filters.sortBy}-${filters.sortOrder}`}
                                        onChange={(e) => {
                                            const [sortBy, sortOrder] = e.target.value.split('-') as [
                                                    'createdAt' | 'viewCount' | 'title',
                                                    'asc' | 'desc'
                                            ];
                                            handleSortChange(sortBy, sortOrder);
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        <option value="createdAt-desc">Mới nhất</option>
                                        <option value="createdAt-asc">Cũ nhất</option>
                                        <option value="title-asc">Tiêu đề A-Z</option>
                                        <option value="title-desc">Tiêu đề Z-A</option>
                                        <option value="viewCount-desc">Xem nhiều nhất</option>
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Active Filters Display */}
                    {(filters.search || filters.tags?.length) && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                            <span className="text-sm text-gray-600">Đang lọc:</span>

                            {filters.search && (
                                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    Tìm kiếm: "{filters.search}"
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, search: undefined }))}
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {filters.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        onClick={() => handleTagFilter(tag)}
                                        className="ml-2 text-primary-600 hover:text-primary-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        {loading ? 'Đang tải...' : `Tìm thấy ${filteredBlogs.length} bài viết`}
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={fetchBlogs}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Blog List */}
                <BlogList
                    blogs={paginatedBlogs}
                    onBlogClick={handleBlogClick}
                    onEditPost={handleEditPost}
                    loading={loading}
                    className="mb-8"
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Trước
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg transition-colors ${
                                    page === currentPage
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};