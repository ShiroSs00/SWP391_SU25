import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WrapperSection from "../../components/sections/wrapperSection.tsx";
import GroupedHeading from "../../components/sections/GroupedHeading.tsx";

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    authorAvatar: string;
    authorRole: string;
    date: string;
    category: string;
    readTime: string;
    views: number;
    comments: number;
    image: string;
    featured: boolean;
    tags: string[];
}

interface Category {
    name: string;
    count: number;
    color: string;
}

const Blog: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories: Category[] = [
        { name: 'all', count: 12, color: 'bg-gray-500' },
        { name: 'Hướng dẫn', count: 4, color: 'bg-blue-500' },
        { name: 'Kinh nghiệm', count: 3, color: 'bg-green-500' },
        { name: 'Y học', count: 2, color: 'bg-purple-500' },
        { name: 'Sự kiện', count: 2, color: 'bg-orange-500' },
        { name: 'Câu chuyện', count: 1, color: 'bg-pink-500' }
    ];

    const blogPosts: BlogPost[] = [
        {
            id: 1,
            title: 'Hành Trình 10 Năm Hiến Máu: Từ Lần Đầu Tiên Đến 50 Lần Hiến Máu',
            excerpt: 'Chia sẻ câu chuyện cảm động về hành trình hiến máu của anh Nguyễn Văn Nam, một trong những người hiến máu tích cực nhất tại TP.HCM với 50 lần hiến máu trong 10 năm.',
            content: 'Câu chuyện chi tiết sẽ được hiển thị ở trang riêng...',
            author: 'Nguyễn Văn Nam',
            authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            authorRole: 'Người hiến máu tình nguyện',
            date: '2024-05-25',
            category: 'Kinh nghiệm',
            readTime: '5 phút đọc',
            views: 1250,
            comments: 24,
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
            featured: true,
            tags: ['Hiến máu', 'Kinh nghiệm', 'Cảm hứng']
        },
        {
            id: 2,
            title: '5 Điều Cần Biết Trước Khi Hiến Máu Lần Đầu',
            excerpt: 'Hướng dẫn chi tiết cho những người lần đầu tham gia hiến máu, từ chuẩn bị sức khỏe đến quy trình hiến máu an toàn và những lưu ý sau khi hiến máu.',
            content: 'Nội dung chi tiết sẽ được hiển thị ở trang riêng...',
            author: 'Bác sĩ Trần Thị Lan',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            authorRole: 'Bác sĩ Huyết học',
            date: '2024-05-22',
            category: 'Hướng dẫn',
            readTime: '3 phút đọc',
            views: 890,
            comments: 15,
            image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=300&fit=crop',
            featured: true,
            tags: ['Hướng dẫn', 'Lần đầu', 'An toàn']
        },
        {
            id: 3,
            title: 'Tầm Quan Trọng Của Máu Hiếm Trong Y Tế',
            excerpt: 'Tìm hiểu về các nhóm máu hiếm như O-, AB- và vai trò quan trọng của chúng trong việc cứu sống bệnh nhân, đặc biệt trong các ca cấp cứu.',
            content: 'Nội dung chi tiết sẽ được hiển thị ở trang riêng...',
            author: 'ThS. Phạm Minh Đức',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            authorRole: 'Thạc sĩ Y học',
            date: '2024-05-20',
            category: 'Y học',
            readTime: '7 phút đọc',
            views: 543,
            comments: 8,
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=300&fit=crop',
            featured: false,
            tags: ['Máu hiếm', 'Y học', 'Cấp cứu']
        },
        {
            id: 4,
            title: 'Lịch Sự Kiện Hiến Máu Tháng 6/2024',
            excerpt: 'Danh sách đầy đủ các điểm hiến máu lưu động, sự kiện hiến máu tại các trường học và doanh nghiệp trong tháng 6 tại TP.HCM.',
            content: 'Nội dung chi tiết sẽ được hiển thị ở trang riêng...',
            author: 'Ban Tổ chức',
            authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            authorRole: 'Điều phối viên',
            date: '2024-05-18',
            category: 'Sự kiện',
            readTime: '4 phút đọc',
            views: 720,
            comments: 12,
            image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=300&fit=crop',
            featured: false,
            tags: ['Sự kiện', 'Lịch trình', 'TP.HCM']
        },
        {
            id: 5,
            title: 'Cách Chuẩn Bị Sức Khỏe Trước Khi Hiến Máu',
            excerpt: 'Hướng dẫn chi tiết về cách ăn uống, nghỉ ngơi và chuẩn bị tinh thần trước khi hiến máu để đảm bảo quá trình diễn ra thuận lợi.',
            content: 'Nội dung chi tiết sẽ được hiển thị ở trang riêng...',
            author: 'Điều dưỡng Lê Thị Mai',
            authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
            authorRole: 'Điều dưỡng trưởng',
            date: '2024-05-15',
            category: 'Hướng dẫn',
            readTime: '4 phút đọc',
            views: 456,
            comments: 7,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop',
            featured: false,
            tags: ['Chuẩn bị', 'Sức khỏe', 'Dinh dưỡng']
        },
        {
            id: 6,
            title: 'Câu Chuyện Của Bệnh Nhân Được Cứu Sống Nhờ Hiến Máu',
            excerpt: 'Chia sẻ câu chuyện cảm động của chị Nguyễn Thị Hoa, bệnh nhân ung thư được cứu sống nhờ sự hỗ trợ của cộng đồng hiến máu.',
            content: 'Nội dung chi tiết sẽ được hiển thị ở trang riêng...',
            author: 'Nguyễn Thị Hoa',
            authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
            authorRole: 'Bệnh nhân',
            date: '2024-05-12',
            category: 'Câu chuyện',
            readTime: '6 phút đọc',
            views: 892,
            comments: 31,
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=300&fit=crop',
            featured: false,
            tags: ['Câu chuyện', 'Cảm động', 'Hy vọng']
        }
    ];

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const featuredPosts = blogPosts.filter(post => post.featured);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePostClick = (postId: number) => {
        navigate(`/blog/${postId}`);
    };

    const renderFeaturedPost = (post: BlogPost) => (
        <div
            key={post.id}
            className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handlePostClick(post.id)}
        >
            <div className="aspect-video relative">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
              categories.find(cat => cat.name === post.category)?.color || 'bg-gray-500'
          }`}>
            {post.category}
          </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-red-600 transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{post.author}</p>
                            <p className="text-xs text-gray-500">{post.authorRole}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
                        <p className="text-xs text-gray-400">{post.readTime}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRegularPost = (post: BlogPost) => (
        <div
            key={post.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
            onClick={() => handlePostClick(post.id)}
        >
            <div className="aspect-video relative">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
              categories.find(cat => cat.name === post.category)?.color || 'bg-gray-500'
          }`}>
            {post.category}
          </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                        <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{post.author}</span>
                    </div>
                    <span>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    <span>{post.readTime}</span>
                    <div className="flex items-center space-x-3">
                        <span>{post.views} lượt xem</span>
                        <span>{post.comments} bình luận</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <WrapperSection>
                <div className="max-w-7xl mx-auto py-8">
                    <GroupedHeading
                        title="Blog & Tin Tức"
                        description="Chia sẻ kiến thức, kinh nghiệm và câu chuyện về hiến máu"
                    />

                    {/* Search and Filter Section */}
                    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col lg:flex-row gap-6 items-center">
                            {/* Search Bar */}
                            <div className="flex-1 w-full">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm bài viết..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            selectedCategory === category.name
                                                ? `${category.color} text-white`
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category.name === 'all' ? 'Tất cả' : category.name} ({category.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Featured Posts Section */}
                    {featuredPosts.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết nổi bật</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {featuredPosts.map(renderFeaturedPost)}
                            </div>
                        </div>
                    )}

                    {/* All Posts Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedCategory === 'all' ? 'Tất cả bài viết' : `Danh mục: ${selectedCategory}`}
                            </h2>
                            <p className="text-gray-600">
                                {filteredPosts.length} bài viết
                            </p>
                        </div>

                        {filteredPosts.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPosts.map(renderRegularPost)}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33m-.92 3.33L3 18l3-3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài viết</h3>
                                <p className="text-gray-600">
                                    Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="bg-red-50 rounded-lg p-8 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Đăng ký nhận tin tức mới nhất
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Nhận thông báo về các bài viết mới, sự kiện hiến máu và thông tin hữu ích khác.
                        </p>
                        <div className="max-w-md mx-auto flex gap-3">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </WrapperSection>
        </div>
    );
};

export default Blog;