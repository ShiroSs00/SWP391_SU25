import React from 'react';
import { HeartIcon, UserGroupIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../ui/button/Button';

export function HeroSection() {
  const stats = [
    { value: '50,000+', label: 'Người hiến máu', icon: UserGroupIcon },
    { value: '125,000+', label: 'Đơn vị máu', icon: HeartSolidIcon },
    { value: '200,000+', label: 'Sinh mạng được cứu', icon: HeartIcon },
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-dark-900 via-dark-800 to-blood-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blood-500/20 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-blood-400/10 rounded-full blur-2xl animate-bounce-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-life-500/20 rounded-full blur-lg animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blood-500/20 text-blood-300 text-sm font-medium backdrop-blur-sm border border-blood-500/30">
                <HeartSolidIcon className="w-4 h-4 mr-2 animate-heartbeat" />
                Cứu sống - Kết nối - Hy vọng
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6">
              <span className="text-white">Kết nối</span>
              <br />
              <span className="bg-gradient-to-r from-blood-400 to-blood-600 bg-clip-text text-transparent">
                Sự sống
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-dark-300 mb-8 leading-relaxed max-w-2xl">
              Hệ thống hiến máu thông minh, kết nối người hiến máu và người cần máu một cách 
              <span className="text-blood-400 font-semibold"> nhanh chóng, an toàn và hiệu quả</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                variant="primary"
                size="xl"
                gradient
                leftIcon={<HeartSolidIcon className="w-6 h-6" />}
                rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                className="group"
              >
                <span className="group-hover:mr-1 transition-all">Đăng ký hiến máu</span>
              </Button>
              
              <Button
                variant="emergency"
                size="xl"
                leftIcon={<ClockIcon className="w-6 h-6" />}
                className="relative overflow-hidden"
              >
                <span className="relative z-10">Yêu cầu máu khẩn cấp</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emergency-600 to-emergency-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-blood-400 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-dark-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative animate-scale-in">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blood-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <HeartSolidIcon className="w-10 h-10 text-white animate-heartbeat" />
                  </div>
                  <h3 className="text-2xl font-bold text-dark-900 mb-2">BloodConnect</h3>
                  <p className="text-dark-600">Hệ thống hiến máu thông minh</p>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-life-500 text-white p-4 rounded-2xl shadow-xl animate-bounce-slow">
                <UserGroupIcon className="w-6 h-6 mb-1" />
                <div className="text-sm font-semibold">24/7</div>
                <div className="text-xs">Sẵn sàng</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-emergency-500 text-white p-4 rounded-2xl shadow-xl animate-pulse">
                <ClockIcon className="w-6 h-6 mb-1" />
                <div className="text-sm font-semibold">&lt; 30 phút</div>
                <div className="text-xs">Phản hồi</div>
              </div>

              {/* Background Decoration */}
              <div className="absolute inset-0 bg-blood-gradient rounded-3xl transform rotate-6 scale-105 -z-10 opacity-20 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;