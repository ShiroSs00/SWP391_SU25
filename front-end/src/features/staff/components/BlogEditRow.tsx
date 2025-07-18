import React, { useState } from 'react';
import { useBlogManagement } from '../hooks/useBlogManagement';
import type { Blog, UpdateBlogRequest } from '../types/blog.types';

interface BlogEditRowProps {
    blog: Blog;
    onCancel: () => void;
    onSave: () => void;
}

const BlogEditRow: React.FC<BlogEditRowProps> = ({ blog, onCancel, onSave }) => {
    const { updateBlog, loading } = useBlogManagement();
    
    const [formData, setFormData] = useState<UpdateBlogRequest>({
        blogId: blog.blogId,
        content: blog.content,
        postDate: blog.postDate.split('T')[0], // Convert to date format
        tagName: blog.tagName,
        img: blog.img || '',
        thumbnail: blog.thumbnail || ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            // Validation
            if (!formData.content?.trim()) {
                alert('Vui lòng nhập nội dung');
                return;
            }
            if (!formData.tagName?.trim()) {
                alert('Vui lòng chọn tag');
                return;
            }

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
            onSave();
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    return (
        <>
            <tr className="bg-blue-50 border-2 border-blue-200">
                <td className="px-6 py-4">
                    <input
                        type="checkbox"
                        disabled
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 opacity-50"
                    />
                </td>
                <td className="px-6 py-4">
                    <textarea
                        name="content"
                        value={formData.content || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical text-sm"
                        placeholder="Nhập nội dung blog..."
                    />
                </td>
                <td className="px-6 py-4">
                    <select
                        name="tagName"
                        value={formData.tagName || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                </td>
                <td className="px-6 py-4">
                    <input
                        type="date"
                        name="postDate"
                        value={formData.postDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </td>
                <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                        {blog.account?.name || 'N/A'}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm disabled:opacity-50"
                        >
                            {loading ? 'Lưu...' : 'Lưu'}
                        </button>
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm disabled:opacity-50"
                        >
                            Hủy
                        </button>
                    </div>
                </td>
            </tr>
            {/* Additional row for image and thumbnail fields */}
            <tr className="bg-blue-50 border-2 border-blue-200 border-t-0">
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4" colSpan={5}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL Hình ảnh
                            </label>
                            <input
                                type="url"
                                name="img"
                                value={formData.img || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL Thumbnail
                            </label>
                            <input
                                type="url"
                                name="thumbnail"
                                value={formData.thumbnail || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="https://example.com/thumbnail.jpg"
                            />
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
};

export default BlogEditRow;
