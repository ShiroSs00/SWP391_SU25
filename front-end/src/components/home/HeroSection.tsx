import { Button } from '../ui/Button';
import {
  Heart as HeartIcon,
  Users as UserGroupIcon,
  Clock as ClockIcon,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';
import { Heart as HeartSolidIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle as AlertCircleIcon } from 'lucide-react';

export function HeroSection() {
  // Hook để điều hướng giữa các trang
  const navigate = useNavigate()

  // Thông tin trạng thái hệ thống - hiển thị minh bạch không có số liệu giả
  const systemStatus = {
    isActive: true,
    responseTime: "< 30 phút",
    availability: "24/7",
  }

  // Hàm xử lý khi nhấn nút "Đăng ký hiến máu"
  const handleDonateClick = () => {
    navigate("/blood-requests")
  }

  // Hàm xử lý khi nhấn nút "Yêu cầu máu khẩn cấp"
  const handleEmergencyClick = () => {
    navigate("/emergency")
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ĐÃ XÓA: Background Pattern và Animated Background Elements */}
      {/* Background Image with better contrast */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: `url('https://providencemedicalassociates.org/wp-content/uploads/2025/02/give-blood.jpg')`
        }}
      />
      {/* Gradient Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content - Nội dung chính bên trái */}
          <div className="text-center lg:text-left">
            {/* Badge thông báo */}
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-medium backdrop-blur-sm border border-red-500/30">
                <HeartIcon className="w-4 h-4 mr-2 animate-pulse text-red-400" />
                Cứu sống - Kết nối - Hy vọng
              </span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-black">
              <span>Kết nối</span>
              <br />
              <span>Sự sống</span>
            </h1>

            {/* Mô tả chi tiết */}
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
              Hệ thống hiến máu thông minh, kết nối người hiến máu và người cần máu một cách
              <span className="font-semibold"> nhanh chóng, an toàn và hiệu quả</span>.
            </p>

            {/* Thông báo minh bạch về dữ liệu */}
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center text-blue-300 text-sm">
                <AlertCircleIcon className="w-4 h-4 mr-2" />
                <span>
                  Hệ thống đang trong giai đoạn phát triển. Dữ liệu thống kê sẽ được cập nhật khi có người dùng thực tế.
                </span>
              </div>
            </div>

            {/* CTA Buttons - Các nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {/* Nút đăng ký hiến máu */}
              <Button
                variant="default"
                size="xl"
                leftIcon={<HeartIcon className="w-6 h-6" />}
                rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                className="group"
                onClick={handleDonateClick}
              >
                <span className="group-hover:mr-1 transition-all">Đăng ký hiến máu</span>
              </Button>

              {/* Nút yêu cầu máu khẩn cấp */}
              <Button
                variant="destructive"
                size="xl"
                leftIcon={<HeartIcon className="w-6 h-6" />}
                className="relative overflow-hidden"
                onClick={handleEmergencyClick}
              >
                <span className="relative z-10">Yêu cầu máu khẩn cấp</span>
              </Button>
            </div>
          </div>

          {/* Visual - Phần hiển thị bên phải */}

        </div>
      </div>

      {/* ĐÃ XÓA: Bottom Wave - Phần sóng ở cuối trang đã được loại bỏ */}
    </section>
  )
}

export default HeroSection