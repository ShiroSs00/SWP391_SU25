import React from 'react';
import { 
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const quickLinks = [
    { label: 'Đăng ký hiến máu', href: '/donate' },
    { label: 'Yêu cầu máu khẩn cấp', href: '/request' },
    { label: 'Thông tin nhóm máu', href: '/blood-types' },
    { label: 'Lịch sử hiến máu', href: '/history' },
    { label: 'Blog y tế', href: '/blog' },
    { label: 'Câu hỏi thường gặp', href: '/faq' },
    { label: 'Hướng dẫn sử dụng', href: '/guide' },
    { label: 'Liên hệ hỗ trợ', href: '/contact' }
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const emergencyContacts = [
    { 
      label: 'Hotline 24/7', 
      value: '+84 123 456 789', 
      icon: PhoneIcon,
      href: 'tel:+84123456789'
    },
    { 
      label: 'Email khẩn cấp', 
      value: 'emergency@bloodconnect.vn', 
      icon: EnvelopeIcon,
      href: 'mailto:emergency@bloodconnect.vn'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: TwitterIcon, href: '#', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: InstagramIcon, href: '#', color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: YoutubeIcon, href: '#', color: 'hover:text-red-600' }
  ];

  const achievements = [
    { icon: UserGroupIcon, number: '50,000+', label: 'Người hiến máu' },
    { icon: HeartSolidIcon, number: '125,000+', label: 'Đơn vị máu thu được' },
    { icon: ChartBarIcon, number: '200,000+', label: 'Sinh mạng được cứu' },
    { icon: CalendarIcon, number: '5+', label: 'Năm kinh nghiệm' }
  ];

  return (
    <footer className={`bg-dark-900 text-white ${className}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blood-gradient rounded-xl flex items-center justify-center shadow-glow">
                <HeartSolidIcon className="w-7 h-7 text-white animate-heartbeat" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold">BloodConnect</h3>
                <p className="text-dark-400 text-sm">Kết nối sự sống</p>
              </div>
            </div>
            
            <p className="text-dark-300 mb-6 leading-relaxed">
              Hệ thống hiến máu thông minh, kết nối người hiến máu và người cần máu 
              một cách nhanh chóng, an toàn và hiệu quả.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-blood-400" />
                <span className="text-dark-300 text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-blood-400" />
                <span className="text-dark-300 text-sm">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-blood-400" />
                <span className="text-dark-300 text-sm">info@bloodconnect.vn</span>
              </div>
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5 text-blood-400" />
                <span className="text-dark-300 text-sm">24/7 - Luôn sẵn sàng</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Liên kết nhanh</h4>
            <div className="grid grid-cols-1 gap-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-dark-300 hover:text-blood-400 transition-colors duration-200 text-sm py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Blood Types & Emergency */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Nhóm máu & Khẩn cấp</h4>
            
            {/* Blood Types */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-dark-400 mb-3">Các nhóm máu</h5>
              <div className="grid grid-cols-4 gap-2">
                {bloodTypes.map((type) => (
                  <div
                    key={type}
                    className="bg-blood-600 text-white text-center py-2 rounded-lg text-sm font-semibold hover:bg-blood-700 transition-colors cursor-pointer"
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <ShieldCheckIcon className="w-5 h-5 text-emergency-400" />
                <h5 className="text-sm font-medium text-emergency-400">Liên hệ khẩn cấp</h5>
              </div>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className="flex items-center space-x-3 p-3 bg-emergency-900/30 rounded-lg hover:bg-emergency-900/50 transition-colors group"
                  >
                    <contact.icon className="w-4 h-4 text-emergency-400 group-hover:text-emergency-300" />
                    <div>
                      <div className="text-xs text-emergency-400">{contact.label}</div>
                      <div className="text-sm text-white font-medium">{contact.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Thành tích & Kết nối</h4>
            
            {/* Achievements */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors group"
                >
                  <achievement.icon className="w-6 h-6 mx-auto mb-2 text-blood-400 group-hover:scale-110 transition-transform" />
                  <div className="text-lg font-bold text-white">{achievement.number}</div>
                  <div className="text-xs text-dark-400">{achievement.label}</div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h5 className="text-sm font-medium text-dark-400 mb-3">Theo dõi chúng tôi</h5>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center text-dark-400 hover:bg-dark-700 transition-all duration-200 transform hover:scale-110 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-dark-400 mb-3">Nhận thông báo</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-dark-800 border border-dark-700 rounded-l-lg text-white text-sm focus:outline-none focus:border-blood-500"
                />
                <button className="px-4 py-2 bg-blood-600 text-white rounded-r-lg hover:bg-blood-700 transition-colors">
                  <EnvelopeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-dark-400 text-sm">
              © 2024 BloodConnect. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-dark-400 hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="/terms" className="text-dark-400 hover:text-white transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="/cookies" className="text-dark-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="/accessibility" className="text-dark-400 hover:text-white transition-colors">
                Hỗ trợ tiếp cận
              </a>
            </div>

            <div className="flex items-center space-x-2 text-dark-400 text-sm">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Chứng nhận ISO 27001</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Emergency Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-16 h-16 bg-emergency-600 hover:bg-emergency-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 animate-pulse">
          <PhoneIcon className="w-8 h-8" />
        </button>
      </div>
    </footer>
  );
}

export default Footer;