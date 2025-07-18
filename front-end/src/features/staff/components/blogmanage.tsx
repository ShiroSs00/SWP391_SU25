import React, { useState, useEffect } from 'react';
import { useBlogManagement } from '../hooks/useBlogManagement';
import type { GetBlogsParams } from '../types/blog.types';
import BlogEditRow from './BlogEditRow';

const BlogManage: React.FC = () => {
    const {
        blogs,
        loading,
        error,
        success,
        pagination,
        fetchBlogs,
        deleteBlog,
        deleteMultipleBlogs,
        clearError,
        clearSuccess
    } = useBlogManagement();

    const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
    const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
    const [filters, setFilters] = useState<GetBlogsParams>({
        page: 1,
        limit: 10,
        tagName: '',
        accountId: ''
    });

    // Fetch blogs khi component mount hoặc filters thay đổi
    useEffect(() => {
        fetchBlogs(filters);
    }, [fetchBlogs, filters]);

    // Handle pagination
    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    // Handle filter change
    const handleFilterChange = (key: keyof GetBlogsParams, value: string | number) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    // Handle select blog
    const handleSelectBlog = (blogId: string) => {
        setSelectedBlogs(prev => 
            prev.includes(blogId) 
                ? prev.filter(id => id !== blogId)
                : [...prev, blogId]
        );
    };

    // Handle select all
    const handleSelectAll = () => {
        setSelectedBlogs(prev => 
            prev.length === blogs.length 
                ? []
                : blogs.map(blog => blog.blogId)
        );
    };

    // Handle delete single blog
    const handleDeleteBlog = async (blogId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                await deleteBlog(blogId);
            } catch (error) {
                console.error('Error deleting blog:', error);
            }
        }
    };

    // Handle delete multiple blogs
    const handleDeleteMultiple = async () => {
        if (selectedBlogs.length === 0) {
            alert('Vui lòng chọn ít nhất một bài viết để xóa');
            return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedBlogs.length} bài viết đã chọn?`)) {
            try {
                await deleteMultipleBlogs(selectedBlogs);
                setSelectedBlogs([]);
            } catch (error) {
                console.error('Error deleting multiple blogs:', error);
            }
        }
    };

    // Handle edit blog
    const handleEditBlog = (blogId: string) => {
        setEditingBlogId(blogId);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingBlogId(null);
    };

    // Handle save edit
    const handleSaveEdit = () => {
        setEditingBlogId(null);
        // Refresh data
        fetchBlogs(filters);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Blog</h2>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lọc theo Tag
                            </label>
                            <select
                                value={filters.tagName || ''}
                                onChange={(e) => handleFilterChange('tagName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả</option>
                                <option value="Câu chuyện">Câu chuyện</option>
                                <option value="Kinh nghiệm">Kinh nghiệm</option>
                                <option value="Y học">Y học</option>
                                <option value="Tin tức">Tin tức</option>
                                <option value="Hướng dẫn">Hướng dẫn</option>
                                <option value="Sự kiện">Sự kiện</option>
                                <option value="Thống kê">Thống kê</option>
                                <option value="Nghiên cứu">Nghiên cứu</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số bài viết mỗi trang
                            </label>
                            <select
                                value={filters.limit || 10}
                                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleDeleteMultiple}
                                disabled={selectedBlogs.length === 0}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Xóa đã chọn ({selectedBlogs.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                        <button
                            onClick={clearError}
                            className="ml-2 text-red-800 hover:text-red-900"
                        >
                            ×
                        </button>
                    </div>
                )}

                {success && (
                    <div className="mx-6 mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {success}
                        <button
                            onClick={clearSuccess}
                            className="ml-2 text-green-800 hover:text-green-900"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="p-6 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                )}

                {/* Table */}
                {!loading && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nội dung
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tag
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày đăng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tác giả
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {blogs.map((blog) => (
                                    editingBlogId === blog.blogId ? (
                                        <BlogEditRow
                                            key={blog.blogId}
                                            blog={blog}
                                            onCancel={handleCancelEdit}
                                            onSave={handleSaveEdit}
                                        />
                                    ) : (
                                        <tr key={blog.blogId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBlogs.includes(blog.blogId)}
                                                    onChange={() => handleSelectBlog(blog.blogId)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {blog.content.length > 100 
                                                        ? blog.content.substring(0, 100) + '...' 
                                                        : blog.content
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {blog.tagName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(blog.postDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {blog.account?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditBlog(blog.blogId)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBlog(blog.blogId)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && blogs.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 
                            của {pagination.total} bài viết
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Trước
                            </button>
                            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
                                {pagination.page}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page * pagination.limit >= pagination.total}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}

                {/* No data */}
                {!loading && blogs.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        Không có bài viết nào được tìm thấy
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogManage;
