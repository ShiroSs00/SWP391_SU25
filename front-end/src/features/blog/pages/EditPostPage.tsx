import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { BlogEditor } from '../components/BlogEditor';
import { blogService } from '../services/blog.service';
import { useAuth } from '../hooks/useAuth';
import type { BlogPost, UpdateBlogRequest } from '../types/blog.types';
import toast from 'react-hot-toast';

interface EditPostPageProps {
    blogId: string;
    onBack: () => void;
    onSuccess: () => void;
    className?: string;
}

export const EditPostPage: React.FC<EditPostPageProps> = ({
                                                              blogId,
                                                              onBack,
                                                              onSuccess,
                                                              className = ''
                                                          }) => {
    const { canEditPost } = useAuth();
    const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch blog data
    const fetchBlog = async () => {
        try {
            setLoading(true);
            setError(null);
            const blog = await blogService.getBlogById(blogId);
            setCurrentBlog(blog);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải bài viết';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    // Check permissions
    const canEdit = currentBlog && canEditPost(currentBlog.author.id);

    if (loading) {
        return (
            <div className={`min-h-screen bg-gray-50 ${className}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                            <div className="h-32 bg-gray-200 rounded mb-4" />
                            <div className="h-64 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !currentBlog) {
        return (
            <div className={`min-h-screen bg-gray-50 ${className}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải bài viết</h2>
                        <p className="text-gray-600 mb-4">{error || 'Bài viết không tồn tại hoặc đã bị xóa'}</p>
                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={fetchBlog}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={onBack}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!canEdit) {
        return (
            <div className={`min-h-screen bg-gray-50 ${className}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Không có quyền chỉnh sửa</h2>
                        <p className="text-gray-600 mb-4">
                            Bạn chỉ có thể chỉnh sửa bài viết do chính mình tạo.
                        </p>
                        <button
                            onClick={onBack}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSave = async (data: UpdateBlogRequest): Promise<{ success:boolean; blogId?: string }> => {
        try {
            setSaving(true);
              await blogService.updateBlog(currentBlog.id, data);
            toast.success('Cập nhật bài viết thành công!');
            // Navigate to blog list after successful creation
            setTimeout(() => {
                onSuccess(); // This should navigate to blog list
            }, 1000);
            return { success: true, blogId: currentBlog!.id};
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật bài viết';
            toast.error(errorMessage);
            return {success: false};
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
                    whileHover={{ x: -4 }}
                    transition={{ duration: 0.2 }}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Quay lại bài viết
                </motion.button>

                {/* Editor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <BlogEditor
                        initialData={{
                            title: currentBlog.title,
                            content: currentBlog.content,
                            summary: currentBlog.summary,
                            coverImage: currentBlog.coverImage,
                            tags: currentBlog.tags,
                            isPublished: currentBlog.isPublished,
                        }}
                        onSave={handleSave}
                        onCancel={onBack}
                        loading={saving}
                        isEditing={true}
                    />
                </motion.div>
            </div>
        </div>
    );
};