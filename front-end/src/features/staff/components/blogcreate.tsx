import React, { useState } from 'react';
import { useCreateBlog } from '../hooks/useCreateBlog';
import type { CreateBlogRequest } from '../types/blog.types';

const BlogCreate: React.FC = () => {
    const { createBlog, loading, error, success, clearError, clearSuccess } = useCreateBlog();
    
    const [formData, setFormData] = useState<CreateBlogRequest>({
        blogId: null,
        title: '', // Thêm field title
        content: '',
        postDate: new Date().toISOString().split('T')[0],
        tagName: '',
        img: '',
        accountId: '', // Sẽ được tự động sinh bởi backend
        thumbnail: ''
    });

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // State cho file upload

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? (name === 'img' || name === 'thumbnail' ? '' : value) : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        clearSuccess();

        // Validation
        if (!formData.title.trim()) {
            alert('Vui lòng nhập tiêu đề');
            return;
        }
        if (!formData.content.trim()) {
            alert('Vui lòng nhập nội dung');
            return;
        }
        if (!formData.tagName.trim()) {
            alert('Vui lòng nhập tag');
            return;
        }
        if (!thumbnailFile) {
            alert('Vui lòng chọn file thumbnail');
            return;
        }

        try {
            // Tạo FormData để gửi file
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('tagName', formData.tagName);
            if (thumbnailFile) {
                formDataToSend.append('thumbnail', thumbnailFile);
            }
            
            console.log('Sending blog data as FormData');
            const result = await createBlog(formDataToSend);
            if (result) {
                alert('Tạo blog thành công!');
                // Reset form
                setFormData({
                    blogId: null,
                    title: '',
                    content: '',
                    postDate: new Date().toISOString().split('T')[0],
                    tagName: '',
                    img: '',
                    accountId: '',
                    thumbnail: ''
                });
                setThumbnailFile(null);
                // Reset file input
                const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            }
        } catch (err) {
            console.error('Error creating blog:', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo Blog Mới</h2>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        Blog đã được tạo thành công!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tiêu đề blog..."
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                            placeholder="Nhập nội dung blog..."
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
                            value={formData.tagName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Chọn tag</option>
                            <option value="sức khỏe">sức khỏe</option>
                            <option value="lifestyle">lifestyle</option>
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

                    {/* Thumbnail File Upload */}
                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                            Thumbnail <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="thumbnail"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        {thumbnailFile && (
                            <p className="mt-2 text-sm text-gray-600">
                                File đã chọn: {thumbnailFile.name}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    blogId: null,
                                    title: '',
                                    content: '',
                                    postDate: new Date().toISOString().split('T')[0],
                                    tagName: '',
                                    img: '',
                                    accountId: '',
                                    thumbnail: ''
                                });
                                setThumbnailFile(null);
                                const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
                                if (fileInput) fileInput.value = '';
                                clearError();
                                clearSuccess();
                            }}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo Blog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlogCreate;
