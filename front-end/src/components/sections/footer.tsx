import type React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';
import { DEFAULT_FACILITY } from '../../utils/constants.tsx';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">BloodCare</h2>
                <p className="text-sm text-gray-400">Hệ thống hỗ trợ hiến máu</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Kết nối những người hiến máu với những người cần máu.
              Mỗi giọt máu đều có thể cứu sống một mạng người.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{DEFAULT_FACILITY.address.street}, {DEFAULT_FACILITY.address.city}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{DEFAULT_FACILITY.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>{DEFAULT_FACILITY.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Đăng ký hiến máu
                </Link>
              </li>
              <li>
                <Link to="/need-blood" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Cần máu khẩn cấp
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin hữu ích</h3>
            <ul className="space-y-2">
              <li>
                <a href="/conditions" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Điều kiện hiến máu
                </a>
              </li>
              <li>
                <a href="/process" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Quy trình hiến máu
                </a>
              </li>
              <li>
                <a href="/compatibility" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Tương thích nhóm máu
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="bg-red-900 bg-opacity-50 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-red-200 mb-2">
              Đường dây nóng cấp cứu 24/7
            </h3>
            <p className="text-red-100 mb-2">
              Liên hệ ngay nếu cần máu khẩn cấp
            </p>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-red-200" />
              <span className="text-xl font-bold text-red-200">115</span>
              <span className="text-red-300">hoặc</span>
              <span className="text-xl font-bold text-red-200">{DEFAULT_FACILITY.phone}</span>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © 2024 BloodCare. Tất cả quyền được bảo lưu.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Hệ thống được phát triển bởi {DEFAULT_FACILITY.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
