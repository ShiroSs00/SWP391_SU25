import React from 'react';
import {
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import Card from '../ui/card/Card';

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
    {
      icon: DevicePhoneMobileIcon,
      title: 'Ứng dụng di động',
      description: 'App mobile tối ưu với offline mode, GPS tracking và push notification thời gian thực.',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
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
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-6">
            Công nghệ tiên tiến cho
            <span className="block bg-gradient-to-r from-blood-600 to-blood-800 bg-clip-text text-transparent">
              sứ mệnh cứu người
            </span>
          </h2>
          
          <p className="text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed">
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
              hover
              glow
              className={`group relative overflow-hidden border-2 ${feature.borderColor} hover:${feature.borderColor} transition-all duration-300 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-dark-900 mb-4 group-hover:text-dark-800 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-dark-600 leading-relaxed group-hover:text-dark-700 transition-colors">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 animate-slide-up">
          <div className="bg-gradient-to-r from-blood-600 to-blood-800 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                Sẵn sàng tham gia cứu sống?
              </h3>
              <p className="text-xl text-blood-100 mb-8 max-w-2xl mx-auto">
                Hãy trở thành một phần của cộng đồng hiến máu tình nguyện và góp phần cứu sống hàng ngàn người.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blood-600 px-8 py-4 rounded-xl font-semibold hover:bg-blood-50 transition-colors duration-200 transform hover:scale-105">
                  Tìm hiểu thêm
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blood-600 transition-all duration-200 transform hover:scale-105">
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