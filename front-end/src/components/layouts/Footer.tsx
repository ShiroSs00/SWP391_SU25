
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Users, Shield, Clock } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 text-white overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Heart className="w-8 h-8 text-red-500 animate-pulse" fill="currentColor" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping"></div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                BloodCare
              </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                            Hệ thống hiến máu toàn quốc, kết nối yêu thương và cứu sống những người cần được giúp đỡ.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                { icon: Facebook, color: 'from-blue-500 to-blue-600' },
                                { icon: Twitter, color: 'from-sky-500 to-sky-600' },
                                { icon: Instagram, color: 'from-pink-500 to-purple-600' }
                            ].map((social, index) => (
                                <div key={index} className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl`}>
                                    <social.icon className="w-5 h-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg text-red-300 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Liên kết nhanh
                        </h3>
                        <ul className="space-y-2">
                            {[
                                'Về chúng tôi',
                                'Đăng ký hiến máu',
                                'Tin tức & Sự kiện',
                                'Câu hỏi thường gặp'
                            ].map((link, index) => (
                                <li key={index}>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 transform group-hover:scale-150 transition-transform duration-300"></div>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg text-red-300 flex items-center">
                            <Phone className="w-5 h-5 mr-2" />
                            Liên hệ
                        </h3>
                        <div className="space-y-3">
                            {[
                                { icon: Phone, text: '1900-1234', href: 'tel:1900-1234' },
                                { icon: Mail, text: 'info@bloodhope.vn', href: 'mailto:info@bloodhope.vn' },
                                { icon: MapPin, text: '123 Đường ABC, Quận 1, TP.HCM', href: '#' }
                            ].map((contact, index) => (
                                <a key={index} href={contact.href} className="flex items-center group cursor-pointer">
                                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-500/30 transition-all duration-300">
                                        <contact.icon className="w-4 h-4 text-red-400" />
                                    </div>
                                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm">
                    {contact.text}
                  </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg text-red-300 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            Thời gian hoạt động
                        </h3>
                        <div className="space-y-2">
                            {[
                                { day: 'T2-T6', time: '7:00-17:00', active: true },
                                { day: 'T7', time: '7:00-12:00', active: true },
                                { day: 'CN', time: 'Nghỉ', active: false }
                            ].map((schedule, index) => (
                                <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors duration-300">
                                    <span className="text-gray-300 text-sm">{schedule.day}:</span>
                                    <span className={`text-sm ${schedule.active ? 'text-red-300 font-semibold' : 'text-gray-500'}`}>
                    {schedule.time}
                  </span>
                                </div>
                            ))}
                            <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30 backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                  <span className="text-red-300 font-semibold flex items-center text-sm">
                    <Shield className="w-3 h-3 mr-1" />
                    Cấp cứu:
                  </span>
                                    <span className="text-red-200 font-bold text-sm">24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700/50 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
                            &copy; {currentYear} BloodCare. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex items-center text-gray-400">
                            <span>Được phát triển với </span>
                            <Heart className="w-4 h-4 mx-2 text-red-400 animate-pulse" fill="currentColor" />
                            <span> để cứu sống nhiều người hơn</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 animate-pulse"></div>

            {/* Custom CSS for additional animations */}
            <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-20px) rotate(180deg); }
                }

                .animate-float {
                  animation: float 6s ease-in-out infinite;
                }

                @keyframes heartbeat {
                  0%, 50%, 100% { transform: scale(1); }
                  25%, 75% { transform: scale(1.1); }
                }

                .animate-heartbeat {
                  animation: heartbeat 2s ease-in-out infinite;
                }
            `}</style>
        </footer>
    );
};


export default Footer;