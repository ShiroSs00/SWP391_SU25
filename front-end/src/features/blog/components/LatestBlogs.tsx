import React from 'react';
import { useNavigate} from "react-router-dom";
import { motion } from 'framer-motion';
import {User, ArrowRight, Heart, MessageCircle, Tag, Eye} from "lucide-react";
import { useLatestBlogs } from '../hooks/useLatestBlog';
import { formatDate} from "../../donor-feedback/utils/formatters.ts";

interface LatestBlogsProps {
    limit?: number;
}

export const LatestBlogs: React.FC<LatestBlogsProps> = ({ limit = 6 }) => {
    const navigate = useNavigate();
    const { blogs, isLoading, error } = useLatestBlogs(limit);

    const handleViewPost = (blogId: string) => {
        navigate(`/blog/post/${blogId}`);
    };

    const handleViewAllBlogs = () => {
        navigate('/blog');
    };

    const truncateContent = (content: string, maxLength: number = 120) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const getTagColor = (tagName: string) => {
        const colors = {
            'Câu chuyện': 'bg-purple-100 text-purple-800',
            'Kinh nghiệm': 'bg-blue-100 text-blue-800',
            'Y học': 'bg-green-100 text-green-800',
            'Tin tức': 'bg-gray-100 text-gray-800',
            'Hướng dẫn': 'bg-yellow-100 text-yellow-800',
            'Sự kiện': 'bg-red-100 text-red-800',
            'Thống kê': 'bg-indigo-100 text-indigo-800',
            'Nghiên cứu': 'bg-teal-100 text-teal-800',
        };
        return colors[tagName as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (error) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Không thể tải bài viết</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Heart className="w-4 h-4" />
                        <span>Chia sẻ từ cộng đồng</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Blog Mới Nhất
            </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Khám phá những câu chuyện cảm động, kiến thức khoa học và kinh nghiệm thực tế về hiến máu từ cộng đồng
                    </p>
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Blog Cards */}
                {!isLoading && blogs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    >
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                                {/* Cover Image */}
                                {blog.coverImage && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Tags and Date */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                                                >
                          <Tag className="w-3 h-3" />
                                                    {tag}
                        </span>
                                            ))}
                                            {blog.tags.length > 2 && (
                                                <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(blog.createdAt, 'short')}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {blog.title}
                                    </h3>

                                    {/* Summary or Content Preview */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {blog.summary ? truncateContent(blog.summary) : truncateContent(blog.content)}
                                    </p>

                                    {/* Engagement Stats */}
                                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Heart className="w-4 h-4" />
                                            <span>{blog.like || 0}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{blog.comment || 0}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{blog.viewCount || 0}</span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            {blog.author.avatar ? (
                                                <img
                                                    src={blog.author.avatar}
                                                    alt={blog.author.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User className="w-3 h-3 text-gray-500" />
                                                </div>
                                            )}
                                            <div className="text-sm">
                                                <div className="text-gray-900 font-medium">{blog.author.name}</div>
                                                <div className="text-gray-500 text-xs">{blog.author.role}</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleViewPost(blog.id)}
                                            className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-200"
                                        >
                                            <span>Đọc thêm</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Empty State */}
                {!isLoading && blogs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="text-red-500" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có bài viết nào</h3>
                        <p className="text-gray-600 mb-8">Hãy quay lại sau để đọc những câu chuyện cảm động về hiến máu</p>
                    </motion.div>
                )}

                {/* View All Button */}
                {!isLoading && blogs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                    >
                        <button
                            onClick={handleViewAllBlogs}
                            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span>Xem tất cả bài viết</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};