import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Calendar, Users } from 'lucide-react';
import BlogList from "../components/BlogList.tsx";
import { useBlogStats } from "../hooks/useBlogs.ts";
import { useNavigate } from 'react-router-dom';
import api from '../../../services/axios/api.ts';
import type { BlogForm } from '../types/blog.types';
import BlogEditor from "../components/BlogEditor.tsx";

const BlogPage: React.FC = () => {
    const { stats } = useBlogStats();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string | null>(null);

    // Hàm lấy vai trò từ API
    const getUserRole = async (): Promise<string> => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return 'user';
            const response = await api.get('/user/role', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.role || 'user';
        } catch (error) {
            console.error('Error fetching user role:', error);
            return 'user';
        }
    };

    // Lấy vai trò khi component mount
    useEffect(() => {
        const fetchRole = async () => {
            const role = await getUserRole();
            setUserRole(role);
        };
        fetchRole();
    }, []);

    // Chuyển hướng nếu không phải staff
    useEffect(() => {
        if (userRole && userRole !== 'staff') {
            navigate('/');
        }
    }, [navigate, userRole]);

    // Nếu chưa xác định được role thì không render gì cả (tránh nháy trang)
    if (!userRole) return null;
    if (userRole !== 'staff') return null;

    const handleSave = async (data: BlogForm) => {
        try {
            // TODO: gọi API tạo bài viết
            // const newPost = await createPost(data);
            // navigate(`/blog/${newPost.slug}`);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handlePostClick = (slug: string) => {
        navigate(`/blog/${slug}`);
    };

    const handleCreatePost = () => {
        navigate('/blog/create');
    };

    const handlePreview = (data: BlogForm) => {
        console.log('Preview:', data);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Blog chia sẻ kinh nghiệm
                            </h1>
                            <p className="text-gray-600">
                                Khám phá những câu chuyện, kiến thức và kinh nghiệm về hiến máu
                            </p>
                        </div>
                        <button
                            onClick={handleCreatePost}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Viết bài mới
                        </button>
                    </div>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                                </div>
                                <Calendar className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.totalViews.toLocaleString()}
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Bình luận</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
                                </div>
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Lượt thích</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <BlogList onPostClick={handlePostClick} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Popular Posts */}
                        {stats?.popularPosts && stats.popularPosts.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Bài viết phổ biến
                                </h3>
                                <div className="space-y-4">
                                    {stats.popularPosts.slice(0, 5).map(post => (
                                        <div
                                            key={post.id}
                                            className="cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200"
                                            onClick={() => handlePostClick(post.slug)}
                                        >
                                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                                                {post.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{post.views} lượt xem</span>
                                                <span>•</span>
                                                <span>{post.likes} thích</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Posts */}
                        {stats?.recentPosts && stats.recentPosts.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Bài viết mới nhất
                                </h3>
                                <div className="space-y-4">
                                    {stats.recentPosts.slice(0, 5).map(post => (
                                        <div
                                            key={post.id}
                                            className="cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200"
                                            onClick={() => handlePostClick(post.slug)}
                                        >
                                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                                                {post.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Danh mục
                            </h3>
                            <div className="space-y-2">
                                {stats && Object.entries(stats.categoryStats).map(([category, count]) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                                    >
                                        <span className="text-sm text-gray-700">
                                            {category === 'blood_education' ? 'Giáo dục về máu' :
                                                category === 'donation_tips' ? 'Mẹo hiến máu' :
                                                    category === 'health_wellness' ? 'Sức khỏe' :
                                                        category === 'success_stories' ? 'Câu chuyện thành công' :
                                                            category === 'medical_research' ? 'Nghiên cứu y khoa' :
                                                                category === 'community' ? 'Cộng đồng' :
                                                                    category === 'news' ? 'Tin tức' : 'Sự kiện'}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Nếu muốn chỉ staff mới được tạo bài thì render BlogEditor ở trang riêng, không render ở đây */}
            </div>
        </div>
    );
};

export default BlogPage;