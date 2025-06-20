import React from 'react';
import { Heart, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, Shield, Award, Users, Droplet } from 'lucide-react';

export interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { label: 'Đăng ký hiến máu', href: '/register-donation' },
        // { label: 'Tìm kiếm máu', href: '/blood-search' },
        // { label: 'Lịch sử hiến máu', href: '/donation-history' },
        { label: 'Thông tin nhóm máu', href: '/blood-types' },
        { label: 'Blog y tế', href: '/blog' },
        { label: 'Liên hệ', href: '/contact' }
    ];

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const emergencyContacts = [
        { label: 'Hotline 24/7', number: '+84 28 1234 5678', icon: Phone },
        { label: 'Email khẩn cấp', email: 'emergency@bloodcenter.vn', icon: Mail }
    ];

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
        { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
        { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
        { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' }
    ];

    const achievements = [
        { icon: Users, number: '50,000+', label: 'Người hiến máu' },
        { icon: Droplet, number: '100,000+', label: 'Đơn vị máu thu được' },
        { icon: Heart, number: '200,000+', label: 'Sinh mạng được cứu' },
        { icon: Award, number: '15+', label: 'Năm kinh nghiệm' }
    ];

    return (
        <footer className={`bg-gray-900 text-white ${className}`}>
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Organization Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">BloodCenter</h3>
                                <p className="text-sm text-gray-400">Trung tâm hiến máu</p>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Chúng tôi cam kết cung cấp dịch vụ hiến máu an toàn, chuyên nghiệp và nhân văn,
                            góp phần cứu sống hàng ngàn người bệnh mỗi năm.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-gray-300">123 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-gray-300">+84 28 1234 5678</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-gray-300">info@bloodcenter.vn</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-gray-300">24/7 - Phục vụ khẩn cấp</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Liên kết nhanh</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-300 hover:text-red-400 transition-colors duration-200 text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Operating Hours */}
                        <div className="mt-8">
                            <h5 className="font-semibold mb-3 text-white">Giờ làm việc</h5>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between">
                                    <span>Thứ 2 - Thứ 6:</span>
                                    <span>7:00 - 17:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Thứ 7:</span>
                                    <span>8:00 - 15:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Chủ nhật:</span>
                                    <span>9:00 - 15:00</span>
                                </div>
                                <div className="flex justify-between text-red-400 font-medium">
                                    <span>Khẩn cấp:</span>
                                    <span>24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blood Types & Emergency */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Nhóm máu cần thiết</h4>

                        {/* Blood Types Grid */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {bloodTypes.map(type => (
                                <div
                                    key={type}
                                    className="bg-red-600 text-white text-center py-2 px-1 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                                >
                                    {type}
                                </div>
                            ))}
                        </div>

                        {/* Emergency Contacts */}
                        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
                            <h5 className="font-semibold mb-3 text-red-400 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Liên hệ khẩn cấp
                            </h5>
                            <div className="space-y-2">
                                {emergencyContacts.map((contact, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <contact.icon className="w-4 h-4 text-red-400" />
                                        <div>
                                            <div className="text-gray-300">{contact.label}</div>
                                            <div className="text-white font-medium">
                                                {contact.number || contact.email}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Achievements & Social */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Thành tựu</h4>

                        {/* Achievement Stats */}
                        <div className="space-y-4 mb-8">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <achievement.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{achievement.number}</div>
                                        <div className="text-xs text-gray-400">{achievement.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Media */}
                        <div>
                            <h5 className="font-semibold mb-4 text-white">Theo dõi chúng tôi</h5>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-colors duration-200`}
                                        aria-label={social.name}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Signup */}
                        <div className="mt-6">
                            <h5 className="font-semibold mb-3 text-white">Nhận thông báo</h5>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 text-sm focus:outline-none focus:border-red-500"
                                />
                                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium">
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-400">
                            © {currentYear} BloodCenter. Tất cả quyền được bảo lưu.
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                            <a href="/privacy" className="hover:text-red-400 transition-colors duration-200">
                                Chính sách bảo mật
                            </a>
                            <a href="/terms" className="hover:text-red-400 transition-colors duration-200">
                                Điều khoản sử dụng
                            </a>
                            <a href="/cookies" className="hover:text-red-400 transition-colors duration-200">
                                Chính sách Cookie
                            </a>
                            <a href="/accessibility" className="hover:text-red-400 transition-colors duration-200">
                                Hỗ trợ tiếp cận
                            </a>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>Được chứng nhận bởi Bộ Y tế</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Emergency Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group">
                    <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Gọi khẩn cấp: +84 28 1234 5678
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
                    </div>
                </button>
            </div>
        </footer>
    );
};

export default Footer;