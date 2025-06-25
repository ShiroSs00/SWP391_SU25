import { Card } from '../ui/card';
import {
    Heart as HeartIcon,
    MapPin as MapPinIcon,
    Clock as ClockIcon,
    ShieldCheck as ShieldCheckIcon,
    Users as UserGroupIcon,
    BarChart3 as ChartBarIcon,
    Bell as BellIcon,
    Calendar as CalendarIcon,
    Droplets as DropletsIcon,
} from 'lucide-react';

export function FeaturesSection() {
    const features = [
        {
            icon: HeartIcon,
            title: 'Đăng ký hiến máu dễ dàng',
            description: 'Quy trình đăng ký đơn giản, nhanh chóng với giao diện thân thiện và hướng dẫn chi tiết từng bước.',
            color: 'text-blood-600',
            bgColor: 'bg-blood-50',
            borderColor: 'border-blood-200'
        },
        {
            icon: MapPinIcon,
            title: 'Tìm kiếm thông minh',
            description: 'Hệ thống AI tìm kiếm người hiến máu và bệnh viện gần nhất dựa trên vị trí và tình trạng khẩn cấp.',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            icon: ClockIcon,
            title: 'Phản hồi khẩn cấp 24/7',
            description: 'Hệ thống hoạt động liên tục, đảm bảo phản hồi trong vòng 30 phút cho các trường hợp khẩn cấp.',
            color: 'text-emergency-600',
            bgColor: 'bg-emergency-50',
            borderColor: 'border-emergency-200'
        },
        {
            icon: ShieldCheckIcon,
            title: 'An toàn & Bảo mật',
            description: 'Mã hóa end-to-end, tuân thủ GDPR và các tiêu chuẩn bảo mật y tế quốc tế cao nhất.',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            icon: UserGroupIcon,
            title: 'Cộng đồng kết nối',
            description: 'Xây dựng mạng lưới người hiến máu tình nguyện với hệ thống điểm thưởng và thành tích.',
            color: 'text-life-600',
            bgColor: 'bg-life-50',
            borderColor: 'border-life-200'
        },
        {
            icon: ChartBarIcon,
            title: 'Thống kê thông minh',
            description: 'Dashboard phân tích dữ liệu hiến máu, dự đoán nhu cầu và tối ưu hóa quy trình.',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200'
        },
        {
            icon: BellIcon,
            title: 'Thông báo thông minh',
            description: 'Hệ thống thông báo đa kênh với AI cá nhân hóa theo sở thích và lịch trình của bạn.',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-200'
        },
    ];

    const process = [
        {
            step: "01",
            title: "Đăng ký hiến máu",
            description: "Điền thông tin cá nhân và đặt lịch hẹn hiến máu tại trung tâm gần nhất.",
            icon: CalendarIcon
        },
        {
            step: "02",
            title: "Kiểm tra sức khỏe",
            description: "Bác sĩ sẽ kiểm tra sức khỏe tổng quát và xét nghiệm máu cơ bản.",
            icon: ShieldCheckIcon
        },
        {
            step: "03",
            title: "Hiến máu an toàn",
            description: "Quy trình hiến máu diễn ra an toàn với thiết bị y tế hiện đại.",
            icon: DropletsIcon
        },
        {
            step: "04",
            title: "Nghỉ ngơi & chăm sóc",
            description: "Nghỉ ngơi và được chăm sóc chu đáo sau khi hiến máu hoàn tất.",
            icon: HeartIcon
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-dark-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20 animate-slide-up">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blood-100 text-blood-700 text-sm font-medium mb-6">
                        <HeartIcon className="w-4 h-4 mr-2" />
                        Tính năng nổi bật
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#222222] mb-6">
                        Công nghệ tiên tiến cho
                        <span className="block bg-gradient-to-r from-blood-600 to-blood-800 bg-clip-text text-transparent">
              sứ mệnh cứu người
            </span>
                    </h2>

                    <p className="text-xl text-[#222222] max-w-3xl mx-auto leading-relaxed">
                        BloodConnect sử dụng AI và công nghệ blockchain để tạo ra hệ sinh thái hiến máu
                        thông minh, minh bạch và hiệu quả nhất.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            variant="default"
                            padding="lg"
                            className={`group relative overflow-hidden border-2 border-[#222222]/10 hover:border-[#222222]/10 transition-all duration-300 animate-slide-up`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-8 h-8 text-[#222222]" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-[#222222] mb-4 group-hover:text-[#222222] transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-[#222222] leading-relaxed group-hover:text-[#222222] transition-colors">
                                    {feature.description}
                                </p>

                                {/* Hover Effect */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Process Section */}
                <section id="process" className="section-padding bg-gray-50">
                    <div className="container-custom">
                        <div className="text-center mb-16">
                            <h2 className="section-title text-gray-900 mb-4">
                                Quy trình hiến máu
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Quy trình hiến máu được thực hiện theo tiêu chuẩn quốc tế,
                                đảm bảo an toàn tuyệt đối cho người hiến.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {process.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="process-step">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto bg-gradient-blood rounded-full flex items-center justify-center mb-4">
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="text-blood-600 font-bold text-sm mb-2">BƯỚC {item.step}</div>
                                            <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <div className="text-center mt-20 animate-slide-up">
                    <div className="bg-gradient-to-r from-blood-600 to-blood-800 rounded-3xl p-12 text-[#222222] relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4 text-[#222222]">
                                Sẵn sàng tham gia cứu sống?
                            </h3>
                            <p className="text-xl text-[#222222] mb-8 max-w-2xl mx-auto">
                                Hãy trở thành một phần của cộng đồng hiến máu tình nguyện và góp phần cứu sống hàng ngàn người.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-[#222222] px-8 py-4 rounded-xl font-semibold hover:bg-[#f5f5f5] transition-colors duration-200 transform hover:scale-105">
                                    Tìm hiểu thêm
                                </button>
                                <button className="border-2 border-white text-[#222222] px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#222222] transition-all duration-200 transform hover:scale-105">
                                    Liên hệ hỗ trợ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;