import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from "../components/sections/hero.tsx";
import WrapperSection from "../components/sections/wrapperSection.tsx";
import GroupedHeading from "../components/sections/GroupedHeading.tsx";
import TwoCta from "../components/sections/twoCta.tsx";
import ThreeStepProcess from "../components/sections/threeStepProcess.tsx";
import ContactDetails from "../components/sections/contactDetails.tsx";

const Home: React.FC = () => {
    const navigate = useNavigate();

    // Hero section data
    const heroData = {
        title: "Kết Nối Sự Sống Qua Hiến Máu",
        subtitle: "Tham gia mạng lưới hiến máu toàn quốc. Mỗi giọt máu của bạn là một cơ hội cứu sống.",
        primaryButtonText: "Đăng ký hiến máu",
        secondaryButtonText: "Tìm hiểu thêm",
        backgroundImage: "/images/hero-blood-donation.jpg"
    };

    // Statistics data
    const statsData = [
        { label: "Người hiến máu", value: "25,847", icon: "👥" },
        { label: "Đơn vị máu đã thu", value: "89,234", icon: "🩸" },
        { label: "Bệnh nhân được cứu", value: "156,789", icon: "💚" },
        { label: "Bệnh viện liên kết", value: "47", icon: "🏥" }
    ];

    // Process steps
    const processSteps = [
        {
            step: 1,
            title: "Đăng ký",
            description: "Điền thông tin cá nhân và đặt lịch hiến máu phù hợp với bạn"
        },
        {
            step: 2,
            title: "Khám sàng lọc",
            description: "Kiểm tra sức khỏe tổng quát và xét nghiệm máu cơ bản miễn phí"
        },
        {
            step: 3,
            title: "Hiến máu",
            description: "Quá trình hiến máu an toàn, nhanh chóng trong 10-15 phút"
        }
    ];

    // Urgent blood types
    const urgentBloodTypes = [
        { type: "O-", stock: "Cực thấp", urgency: "Cần gấp", color: "bg-red-600" },
        { type: "AB-", stock: "Rất thấp", urgency: "Cần thiết", color: "bg-orange-500" },
        { type: "A-", stock: "Thấp", urgency: "Ưu tiên", color: "bg-yellow-500" }
    ];

    // Recent blog posts data
    const blogPosts = [
        {
            title: "5 điều cần biết trước khi hiến máu lần đầu",
            excerpt: "Hướng dẫn chi tiết cho người hiến máu lần đầu tiên để có trải nghiệm tốt nhất.",
            date: "2024-01-15",
            readTime: "5 phút đọc",
            image: "/images/blog-first-time.jpg"
        },
        {
            title: "Lợi ích sức khỏe của việc hiến máu",
            excerpt: "Khám phá những lợi ích bất ngờ mà hiến máu mang lại cho sức khỏe của bạn.",
            date: "2024-01-10",
            readTime: "3 phút đọc",
            image: "/images/blog-benefits.jpg"
        },
        {
            title: "Câu chuyện cảm động về hiến máu",
            excerpt: "Những câu chuyện thực tế về sự kết nối giữa người hiến và người nhận máu.",
            date: "2024-01-05",
            readTime: "7 phút đọc",
            image: "/images/blog-stories.jpg"
        }
    ];

    // Navigation handlers
    const handleDonateBlood = () => {
        navigate('/need-blood-donate');
    };

    const handleLearnMore = () => {
        navigate('/blog');
    };

    const handleNeedBlood = () => {
        navigate('/need-blood-donate');
    };

    const handleContactUs = () => {
        navigate('/contact');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <Hero
                title={heroData.title}
                subtitle={heroData.subtitle}
                primaryButtonText={heroData.primaryButtonText}
                secondaryButtonText={heroData.secondaryButtonText}
                onPrimaryClick={handleDonateBlood}
                onSecondaryClick={handleLearnMore}
                backgroundImage={heroData.backgroundImage}
            />

            {/* Stats Section */}
            <WrapperSection className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <GroupedHeading
                        title="Tác động của cộng đồng"
                        description="Những con số ý nghĩa từ mạng lưới hiến máu toàn quốc"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                        {statsData.map((stat, index) => (
                            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </WrapperSection>

            {/* Urgent Blood Need Alert */}
            <WrapperSection className="py-12 bg-red-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-red-100 to-pink-100 border border-red-200 rounded-xl p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="text-red-600 text-3xl mr-4">🚨</div>
                                <div>
                                    <h3 className="text-xl font-bold text-red-800 mb-1">
                                        Cần gấp các nhóm máu hiếm
                                    </h3>
                                    <p className="text-red-700">
                                        Tồn kho máu đang ở mức thấp, cần sự hỗ trợ từ cộng đồng
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleDonateBlood}
                                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                            >
                                Hiến máu ngay
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            {urgentBloodTypes.map((blood, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full ${blood.color} mr-3`}></div>
                                            <div>
                                                <div className="font-bold text-lg text-gray-900">Nhóm {blood.type}</div>
                                                <div className="text-sm text-gray-600">{blood.stock}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                                            {blood.urgency}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </WrapperSection>

            {/* How It Works */}
            <WrapperSection className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <GroupedHeading
                        title="Quy trình hiến máu"
                        description="3 bước đơn giản để trở thành người hiến máu và cứu sống nhiều người"
                    />

                    <ThreeStepProcess steps={processSteps} />

                    <div className="text-center mt-12">
                        <p className="text-gray-600 mb-6">
                            Bạn có thắc mắc về quy trình hiến máu?
                        </p>
                        <button
                            onClick={handleContactUs}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Liên hệ tư vấn
                        </button>
                    </div>
                </div>
            </WrapperSection>

            {/* Blood Types Information */}
            <WrapperSection className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <GroupedHeading
                        title="Thông tin nhóm máu"
                        description="Tìm hiểu về các nhóm máu và tính tương thích trong hiến máu"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bloodType) => (
                            <div key={bloodType} className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 border border-gray-100">
                                <div className="text-3xl font-bold text-red-600 mb-2">{bloodType}</div>
                                <div className="text-sm text-gray-600 mb-3">Nhóm máu {bloodType}</div>
                                <button
                                    onClick={() => navigate(`/blood-types?type=${bloodType}`)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                >
                                    Xem chi tiết →
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={() => navigate('/blood-types')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Xem tất cả thông tin nhóm máu
                        </button>
                    </div>
                </div>
            </WrapperSection>

            {/* Recent Blog Posts */}
            <WrapperSection className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <GroupedHeading
                        title="Tin tức & Kiến thức"
                        description="Cập nhật thông tin mới nhất về hiến máu và sức khỏe cộng đồng"
                    />

                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {blogPosts.map((post, index) => (
                            <article key={index} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="h-48 bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                                    <div className="text-6xl">📝</div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <span>{post.date}</span>
                                        <span className="mx-2">•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <button
                                        onClick={() => navigate('/blog')}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                    >
                                        Đọc thêm →
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={() => navigate('/blog')}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                            Xem tất cả bài viết
                        </button>
                    </div>
                </div>
            </WrapperSection>

            {/* Call to Action Section */}
            <WrapperSection className="py-16 bg-gradient-to-r from-red-600 to-pink-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TwoCta
                        title="Bạn cần máu hay muốn hiến máu?"
                        subtitle="Chúng tôi kết nối những người cần máu với những người sẵn sàng hiến máu trong cộng đồng"
                        primaryText="Tôi muốn hiến máu"
                        secondaryText="Tôi cần máu"
                        onPrimaryClick={handleDonateBlood}
                        onSecondaryClick={handleNeedBlood}
                        theme="dark"
                    />
                </div>
            </WrapperSection>

            {/* Contact Section */}
            <WrapperSection className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <GroupedHeading
                        title="Liên hệ với chúng tôi"
                        description="Có câu hỏi hoặc cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ bạn"
                    />

                    <ContactDetails />
                </div>
            </WrapperSection>
        </div>
    );
};

export default Home;