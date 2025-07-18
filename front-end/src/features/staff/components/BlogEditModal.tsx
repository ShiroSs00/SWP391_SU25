import React, { useState, useEffect } from 'react';
import { useBlogManagement } from '../hooks/useBlogManagement';
import type { Blog, UpdateBlogRequest } from '../types/blog.types';

interface BlogEditModalProps {
    blog: Blog;
    onClose: () => void;
    onSuccess: () => void;
}

const BlogEditModal: React.FC<BlogEditModalProps> = ({ blog, onClose, onSuccess }) => {
    const { updateBlog, loading, error, clearError } = useBlogManagement();
    
    const [formData, setFormData] = useState<UpdateBlogRequest>({
        blogId: blog.blogId,
        content: blog.content,
        postDate: blog.postDate,
        tagName: blog.tagName,
        img: blog.img || '',
        thumbnail: blog.thumbnail || ''
    });

    useEffect(() => {
        // Reset form when blog changes
        setFormData({
            blogId: blog.blogId,
            content: blog.content,
            postDate: blog.postDate,
            tagName: blog.tagName,
            img: blog.img || '',
            thumbnail: blog.thumbnail || ''
        });
    }, [blog]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        // Validation
        if (!formData.content?.trim()) {
            alert('Vui lòng nhập nội dung');
            return;
        }
        if (!formData.tagName?.trim()) {
            alert('Vui lòng chọn tag');
            return;
        }

        try {
            // Prepare update data
            const updateData: UpdateBlogRequest = {
                blogId: formData.blogId,
                content: formData.content,
                postDate: formData.postDate,
                tagName: formData.tagName,
                img: formData.img || null,
                thumbnail: formData.thumbnail || null
            };

            await updateBlog(blog.blogId, updateData);
            onSuccess();
        } catch (err) {
            console.error('Error updating blog:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa bài viết</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content || ''}
                            onChange={handleInputChange}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                            placeholder="Nhập nội dung blog..."
                            required
                        />
                    </div>

                    {/* Post Date */}
                    <div>
                        <label htmlFor="postDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày đăng <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="postDate"
                            name="postDate"
                            value={formData.postDate || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Tag Name */}
                    <div>
                        <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-2">
                            Tag <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="tagName"
                            name="tagName"
                            value={formData.tagName || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Chọn tag</option>
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

                    {/* Image URL */}
                    <div>
                        <label htmlFor="img" className="block text-sm font-medium text-gray-700 mb-2">
                            URL Hình ảnh
                        </label>
                        <input
                            type="url"
                            id="img"
                            name="img"
                            value={formData.img || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Thumbnail URL */}
                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                            URL Thumbnail
                        </label>
                        <input
                            type="url"
                            id="thumbnail"
                            name="thumbnail"
                            value={formData.thumbnail || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/thumbnail.jpg"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogEditModal;
