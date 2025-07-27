import React from 'react';
import { useNavigate} from "react-router-dom";
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from "lucide-react";
import { BlogCard } from '../components/BlogCard';
import { useLatestBlogs } from '../hooks/useLatestBlog';

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
                                key={blog.blogId}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <BlogCard
                                    blog={blog}
                                    onView={() => handleViewPost(blog.blogId)}
                                    showActions={false}
                                    className="shadow-lg hover:shadow-2xl"
                                />
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