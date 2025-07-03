import type React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Clock, ArrowRight, Phone, CheckCircle } from 'lucide-react';
import { Button } from '../components/button';
import { BLOOD_TYPES, BLOOD_TYPE_COLORS, TRANSLATIONS } from '../utils/constants';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Mỗi giọt máu <br />
                <span className="text-red-200">cứu một mạng sống</span>
              </h1>
              <p className="text-xl text-red-100 mb-8 leading-relaxed">
                Kết nối những trái tim nhân ái với những người cần được cứu giúp.
                Hãy trở thành người anh hùng thầm lặng trong cuộc chiến cứu sống.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 w-full sm:w-auto">
                    <Heart className="h-5 w-5 mr-2" />
                    Đăng ký hiến máu
                  </Button>
                </Link>
                <Link to="/need-blood">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600 w-full sm:w-auto">
                    Cần máu khẩn cấp
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6">Thống kê hệ thống</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-200">2,543</div>
                    <div className="text-sm text-red-100">Người hiến máu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-200">8,921</div>
                    <div className="text-sm text-red-100">Lần hiến máu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-200">1,205</div>
                    <div className="text-sm text-red-100">Người được cứu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-200">24/7</div>
                    <div className="text-sm text-red-100">Hỗ trợ khẩn cấp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-50 border-l-4 border-red-500 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <p className="text-red-800 font-medium">
                  Đường dây nóng cấp cứu 24/7: <span className="font-bold">115</span>
                </p>
                <p className="text-red-600 text-sm">
                  Liên hệ ngay nếu cần máu khẩn cấp
                </p>
              </div>
            </div>
            <Link to="/need-blood">
              <Button variant="danger" size="sm">
                Báo cáo khẩn cấp
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn BloodCare?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hệ thống hiện đại, an toàn và hiệu quả nhất để kết nối người hiến máu với người cần máu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cộng đồng rộng lớn</h3>
              <p className="text-gray-600">
                Hàng nghìn người hiến máu sẵn sàng giúp đỡ trong cộng đồng
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">An toàn tuyệt đối</h3>
              <p className="text-gray-600">
                Quy trình kiểm tra nghiêm ngặt đảm bảo an toàn cho cả người hiến và nhận
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phản hồi nhanh</h3>
              <p className="text-gray-600">
                Hệ thống thông báo tức thời và xử lý yêu cầu khẩn cấp trong 15 phút
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Miễn phí hoàn toàn</h3>
              <p className="text-gray-600">
                Tất cả dịch vụ đều miễn phí, vì mục đích nhân đạo cao cả
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nhóm máu và tương thích
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hiểu rõ về nhóm máu của bạn và ai có thể nhận máu từ bạn
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {BLOOD_TYPES.map((bloodType) => (
              <div
                key={bloodType}
                className={`text-center p-4 rounded-lg ${BLOOD_TYPE_COLORS[bloodType]} shadow-md hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="text-2xl font-bold mb-1">{bloodType}</div>
                <div className="text-sm opacity-90">
                  {TRANSLATIONS.bloodTypes[bloodType]}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Thông tin quan trọng về hiến máu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Điều kiện hiến máu:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tuổi từ 18-65
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Cân nặng tối thiểu 45kg
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Sức khỏe tốt
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Không mắc các bệnh truyền nhiễm
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Lợi ích khi hiến máu:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Kiểm tra sức khỏe miễn phí
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Tái tạo máu mới
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Giảm nguy cơ bệnh tim mạch
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Cảm giác hạnh phúc khi giúp đỡ
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Hãy trở thành người anh hùng ngày hôm nay!
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Chỉ cần 10 phút của bạn có thể cứu sống 3 người.
            Đăng ký ngay để tham gia vào cộng đồng những người có trái tim nhân ái.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                <Heart className="h-5 w-5 mr-2" />
                Đăng ký hiến máu ngay
              </Button>
            </Link>
            <Link to="/need-blood">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600">
                Tôi cần máu khẩn cấp
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
