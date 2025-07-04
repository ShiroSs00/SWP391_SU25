import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { blogService } from '../services/blog.service';
import { useAuth } from '../hooks/useAuth';
import { BlogComments } from '../components/BlogComments';
import { LikeButton } from '../components/LikeButton';
import { ShareButton } from '../components/ShareButton';
import { useNavigate } from 'react-router-dom';
import type { BlogPost } from '../types/blog.types';
import toast from 'react-hot-toast';

interface BlogPostPageProps {
    blogId: string;
    onBack: () => void;
    onEdit: () => void;
    className?: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
                                                              blogId,
                                                              onBack,
                                                              onEdit,
                                                              className = ''
                                                          }) => {
    const { canEditPost, canDeletePost } = useAuth();
    const navigate = useNavigate();

    const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
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

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: vi });
        } catch {
            return 'N/A';
        }
    };

    const getTagColor = (tag: string) => {
        const colors: Record<string, string> = {
            'Câu chuyện': 'bg-blue-100 text-blue-800',
            'Kinh nghiệm': 'bg-green-100 text-green-800',
            'Y học': 'bg-purple-100 text-purple-800',
            'Tin tức': 'bg-red-100 text-red-800',
            'Hướng dẫn': 'bg-yellow-100 text-yellow-800',
            'Sự kiện': 'bg-pink-100 text-pink-800',
            'Thống kê': 'bg-indigo-100 text-indigo-800',
            'Nghiên cứu': 'bg-gray-100 text-gray-800',
        };
        return colors[tag] || 'bg-gray-100 text-gray-800';
    };

    const handleDelete = async () => {
        if (!currentBlog) return;

        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
            try {
                setLoading(true);
                await blogService.deleteBlog(currentBlog.id);
                toast.success('Đã xóa bài viết thành công');
                navigate('/blogs');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi xóa bài viết';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen bg-gray-50 ${className}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32 mb-6" />
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
                            <div className="h-64 bg-gray-200 rounded mb-6" />
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-200 rounded" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                            </div>
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
                                Quay lại danh sách
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    Quay lại danh sách
                </motion.button>

                {/* Article */}
                <motion.article
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Cover Image */}
                    {currentBlog.coverImage && (
                        <div className="h-64 md:h-80 overflow-hidden">
                            <img
                                src={currentBlog.coverImage}
                                alt={currentBlog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        {/* Header */}
                        <header className="mb-8">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {currentBlog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
                                    >
                    {tag}
                  </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {currentBlog.title}
                            </h1>

                            {/* Summary */}
                            {currentBlog.summary && (
                                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                                    {currentBlog.summary}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center space-x-6">
                                    {/* Author */}
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={currentBlog.author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                                            alt={currentBlog.author.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{currentBlog.author.name}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(currentBlog.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* View Count */}
                                    {currentBlog.viewCount !== undefined && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Eye className="w-4 h-4 mr-1" />
                                            {currentBlog.viewCount} lượt xem
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-3">
                                    {canEditPost(currentBlog.author.id) && (
                                        <button
                                            onClick={onEdit}
                                            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                                            title="Chỉnh sửa bài viết"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Sửa
                                        </button>
                                    )}

                                    {canDeletePost(currentBlog.author.id) && (
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                                            title="Xóa bài viết"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        </header>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none mb-8">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,
                                    p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">{children}</ol>,
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4">
                                            {children}
                                        </blockquote>
                                    ),
                                    code: ({ children }) => (
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                                            {children}
                                        </code>
                                    ),
                                    pre: ({ children }) => (
                                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 mb-4">
                      {children}
                    </pre>
                                    ),
                                }}
                            >
                                {currentBlog.content}
                            </ReactMarkdown>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex items-center justify-between py-6 border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                                <LikeButton blogId={currentBlog.id} />
                                <ShareButton
                                    url={`/blogs/${currentBlog.id}`}
                                    title={currentBlog.title}
                                />
                            </div>

                            {/* Updated Date */}
                            {currentBlog.updatedAt !== currentBlog.createdAt && (
                                <p className="text-sm text-gray-500">
                                    Cập nhật: {formatDate(currentBlog.updatedAt)}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.article>

                {/* Comments Section */}
                <div className="mt-8">
                    <BlogComments blogId={currentBlog.id} />
                </div>
            </div>
        </div>
    );
};