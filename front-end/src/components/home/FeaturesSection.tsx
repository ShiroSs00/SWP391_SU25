import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate()

  const mainFeatures = [
    {
      icon: HeartIcon,
      title: "Đăng ký hiến máu",
      description: "Quy trình đăng ký đơn giản, nhanh chóng với giao diện thân thiện.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: MapPinIcon,
      title: "Lịch sử hiến máu",
      description: "Theo dõi lịch sử hiến máu cá nhân và nhận chứng nhận điện tử.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: BellIcon,
      title: "Thông báo khẩn cấp",
      description: "Nhận thông báo khẩn cấp khi có nhu cầu máu gấp trong khu vực.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: ClockIcon,
      title: "Sự kiện hiến máu",
      description: "Tham gia các sự kiện hiến máu trong cộng đồng và nhận điểm thưởng.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  const supportFeatures = [
    {
      icon: ShieldCheckIcon,
      title: "An toàn & Bảo mật",
      description: "Mã hóa end-to-end, tuân thủ các tiêu chuẩn bảo mật y tế cao nhất.",
    },
    {
      icon: UserGroupIcon,
      title: "Cộng đồng kết nối",
      description: "Xây dựng mạng lưới người hiến máu với hệ thống điểm thưởng.",
    },
    {
      icon: ChartBarIcon,
      title: "Thống kê thông minh",
      description: "Dashboard phân tích dữ liệu và tối ưu hóa quy trình hiến máu.",
    },
    {
      icon: CalendarIcon,
      title: "Lịch hiến máu",
      description: "Lên lịch hiến máu định kỳ và nhận nhắc nhở tự động.",
    },
    {
      icon: DropletsIcon,
      title: "Hỗ trợ trực tuyến",
      description: "Trung tâm hỗ trợ 24/7 qua chat, email và điện thoại.",
    },
  ]

  const handleLearnMoreClick = () => {
    navigate("/blood-types")
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-rose 50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-6">
            <HeartIcon className="w-4 h-4 mr-2" />
            Tính năng chính
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Giải pháp hiến máu
            <span className="block bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              toàn diện & thông minh
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            BloodConnect kết hợp công nghệ AI và blockchain để tạo ra hệ sinh thái hiến máu minh bạch, an toàn và hiệu quả nhất.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden border-2 hover:border-red-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
              padding="lg"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Support Features */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Công nghệ & Dịch vụ hỗ trợ</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportFeatures.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-gray-200"
                padding="lg"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-gray-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Sẵn sàng tham gia cứu sống?</h3>
              <p className="text-lg sm:text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Hãy trở thành một phần của cộng đồng hiến máu tình nguyện và góp phần cứu sống hàng ngàn người.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleLearnMoreClick}
                  className="bg-white text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-red-50 transition-colors duration-200 transform hover:scale-105"
                >
                  Tìm hiểu thêm
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 transform hover:scale-105"
                >
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection