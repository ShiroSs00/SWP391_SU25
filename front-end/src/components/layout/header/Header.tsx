import React, { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  Bars3Icon, 
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../../ui/button/Button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Trang chủ', href: '/', current: true },
    { name: 'Hiến máu', href: '/donate', current: false },
    { name: 'Tìm máu', href: '/request', current: false },
    { name: 'Lịch sử', href: '/history', current: false },
    { name: 'Blog', href: '/blog', current: false },
    { name: 'Liên hệ', href: '/contact', current: false },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-dark-100' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-blood-gradient rounded-xl flex items-center justify-center shadow-blood">
                <HeartSolidIcon className="w-7 h-7 text-white animate-heartbeat" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-life-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-2xl font-display font-bold transition-colors ${
                isScrolled ? 'text-dark-900' : 'text-white'
              }`}>
                BloodConnect
              </h1>
              <p className={`text-xs transition-colors ${
                isScrolled ? 'text-dark-600' : 'text-dark-300'
              }`}>
                Kết nối sự sống
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 group ${
                  item.current
                    ? isScrolled 
                      ? 'text-blood-600' 
                      : 'text-white'
                    : isScrolled
                      ? 'text-dark-700 hover:text-blood-600'
                      : 'text-dark-300 hover:text-white'
                }`}
              >
                {item.name}
                {item.current && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blood-600 rounded-full"></div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blood-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </a>
            ))}
          </nav>

          {/* Emergency & Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Emergency Hotline */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-emergency-500/20 rounded-xl border border-emergency-500/30 backdrop-blur-sm">
              <PhoneIcon className="w-4 h-4 text-emergency-600" />
              <span className={`text-sm font-medium ${
                isScrolled ? 'text-emergency-700' : 'text-emergency-300'
              }`}>
                Khẩn cấp: 115
              </span>
            </div>

            {/* Notifications */}
            <button className={`relative p-2 rounded-xl transition-colors ${
              isScrolled 
                ? 'text-dark-700 hover:bg-dark-100' 
                : 'text-white hover:bg-white/10'
            }`}>
              <BellIcon className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blood-500 rounded-full animate-pulse"></div>
            </button>

            {/* User Menu */}
            <button className={`p-2 rounded-xl transition-colors ${
              isScrolled 
                ? 'text-dark-700 hover:bg-dark-100' 
                : 'text-white hover:bg-white/10'
            }`}>
              <UserCircleIcon className="w-6 h-6" />
            </button>

            {/* CTA Button */}
            <Button
              variant="primary"
              size="md"
              gradient
              leftIcon={<HeartSolidIcon className="w-4 h-4" />}
              className="ml-4"
            >
              Hiến máu ngay
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isScrolled 
                ? 'text-dark-700 hover:bg-dark-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-dark-100 animate-slide-down">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  item.current
                    ? 'bg-blood-50 text-blood-600 border border-blood-200'
                    : 'text-dark-700 hover:bg-dark-50'
                }`}
              >
                {item.name}
              </a>
            ))}
            
            {/* Mobile Emergency */}
            <div className="flex items-center justify-between px-4 py-3 bg-emergency-50 rounded-xl border border-emergency-200">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-5 h-5 text-emergency-600" />
                <span className="text-emergency-700 font-medium">Hotline khẩn cấp</span>
              </div>
              <span className="text-emergency-800 font-bold">115</span>
            </div>

            {/* Mobile CTA */}
            <Button
              variant="primary"
              size="lg"
              gradient
              fullWidth
              leftIcon={<HeartSolidIcon className="w-5 h-5" />}
            >
              Đăng ký hiến máu
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;