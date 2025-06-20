import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Tag } from 'lucide-react';
import BlogCard from './BlogCard';
import { useBlog } from '../hooks/useBlog';
import { BlogFilters, BlogCategory } from '../types/blog.types';

interface BlogListProps {
    onPostClick?: (slug: string) => void;
    showFilters?: boolean;
    category?: BlogCategory;
    limit?: number;
}

const categoryOptions = [
    { value: 'blood_education', label: 'Giáo dục về máu' },
    { value: 'donation_tips', label: 'Mẹo hiến máu' },
    { value: 'health_wellness', label: 'Sức khỏe' },
    { value: 'success_stories', label: 'Câu chuyện thành công' },
    { value: 'medical_research', label: 'Nghiên cứu y khoa' },
    { value: 'community', label: 'Cộng đồng' },
    { value: 'news', label: 'Tin tức' },
    { value: 'events', label: 'Sự kiện' }
];

const BlogList: React.FC<BlogListProps> = ({
                                               onPostClick,
                                               showFilters = true,
                                               category,
                                               limit = 10
                                           }) => {
    const { posts, loading, error, pagination, fetchPosts } = useBlog();
    const [filters, setFilters] = useState<BlogFilters>({
        category,
        sortBy: 'newest'
    });
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPosts(1, limit, filters);
    }, [filters, limit]);

    const handleFilterChange = (newFilters: Partial<BlogFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange({ search: searchTerm });
    };

    const filteredPosts = posts.filter(post =>
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            {showFilters && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSearch} className="flex items-center gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Lọc
                        </button>
                    </form>

                    {/* Filter Panel */}
                    {showFilterPanel && (
                        <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Danh mục
                                </label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => handleFilterChange({
                                        category: e.target.value as BlogCategory || undefined
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categoryOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sắp xếp theo
                                </label>
                                <select
                                    value={filters.sortBy || 'newest'}
                                    onChange={(e) => handleFilterChange({
                                        sortBy: e.target.value as any
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="oldest">Cũ nhất</option>
                                    <option value="popular">Phổ biến</option>
                                    <option value="trending">Xu hướng</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tác giả
                                </label>
                                <input
                                    type="text"
                                    placeholder="Tên tác giả..."
                                    value={filters.author || ''}
                                    onChange={(e) => handleFilterChange({ author: e.target.value || undefined })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && posts.length === 0 ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded mb-3"></div>
                            <div className="h-20 bg-gray-200 rounded mb-4"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    ))
                ) : filteredPosts.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Không tìm thấy bài viết
                        </h3>
                        <p className="text-gray-600">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                        </p>
                    </div>
                ) : (
                    filteredPosts.map(post => (
                        <BlogCard
                            key={post.id}
                            post={post}
                            onClick={() => onPostClick?.(post.slug)}
                        />
                    ))
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => fetchPosts(pagination.page - 1, limit, filters)}
                        disabled={pagination.page === 1}
                        className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
                    <button
                        onClick={() => fetchPosts(pagination.page + 1, limit, filters)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogList;