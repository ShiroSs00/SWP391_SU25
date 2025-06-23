import React from 'react';
import { Link } from 'react-router-dom';
import {Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FooterProps {
    className?: string
    variant?: "default" | "minimal"
}

const Footer: React.FC<FooterProps> = ({ className, variant = "default" }) => {
    const currentYear = new Date().getFullYear()

    if (variant === "minimal") {
        return (
            <footer className={cn("border-t bg-background", className)}>
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Heart className="h-5 w-5 text-red-600" />
                            <span className="font-semibold">BloodDonation</span>
                        </div>
                        <p className="text-sm text-muted-foreground">© {currentYear} BloodDonation. Tất cả quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        )
    }

    return (
        <footer className={cn("border-t bg-muted/50", className)}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Heart className="h-6 w-6 text-red-600" />
                            <span className="text-xl font-bold">BloodDonation</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Hệ thống hiến máu toàn quốc, kết nối yêu thương và cứu sống những người cần được giúp đỡ.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-foreground">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Liên kết nhanh</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link to="/donate" className="text-muted-foreground hover:text-foreground">
                                    Hiến máu
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-muted-foreground hover:text-foreground">
                                    Tin tức
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-muted-foreground hover:text-foreground">
                                    Sự kiện
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/help" className="text-muted-foreground hover:text-foreground">
                                    Trợ giúp
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Liên hệ</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">123 Đường ABC, Quận XYZ, Hà Nội</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a href="tel:1900-1234" className="text-muted-foreground hover:text-foreground">
                                    1900-1234
                                </a>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href="mailto:info@blooddonation.vn" className="text-muted-foreground hover:text-foreground">
                                    info@blooddonation.vn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} BloodDonation. Tất cả quyền được bảo lưu. Được phát triển với ❤️ để cứu sống nhiều người hơn.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export { Footer }
