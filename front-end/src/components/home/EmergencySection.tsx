import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  UserGroupIcon,
  TruckIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Card from '../ui/card/Card';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';

export function EmergencySection() {
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const bloodTypes = [
    {
      type: 'O-',
      name: 'O âm',
      urgency: 'critical',
      color: 'bg-red-600',
      textColor: 'text-red-600',
      description: 'Cần gấp - Vạn năng',
      needed: 45,
      available: 12
    },
    {
      type: 'O+',
      name: 'O dương',
      urgency: 'high',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      description: 'Nhu cầu cao',
      needed: 120,
      available: 67
    },
    {
      type: 'A-',
      name: 'A âm',
      urgency: 'high',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      description: 'Cần bổ sung',
      needed: 30,
      available: 8
    },
    {
      type: 'B-',
      name: 'B âm',
      urgency: 'critical',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      description: 'Rất cần gấp',
      needed: 25,
      available: 3
    },
    {
      type: 'AB-',
      name: 'AB âm',
      urgency: 'medium',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      description: 'Hiếm nhất',
      needed: 8,
      available: 2
    },
    {
      type: 'A+',
      name: 'A dương',
      urgency: 'medium',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      description: 'Ổn định',
      needed: 80,
      available: 95
    },
    {
      type: 'B+',
      name: 'B dương',
      urgency: 'low',
      color: 'bg-green-400',
      textColor: 'text-green-600',
      description: 'Đủ dùng',
      needed: 35,
      available: 42
    },
    {
      type: 'AB+',
      name: 'AB dương',
      urgency: 'low',
      color: 'bg-blue-400',
      textColor: 'text-blue-600',
      description: 'Dự trữ tốt',
      needed: 15,
      available: 18
    }
  ];

  const emergencyCases = [
    {
      id: 1,
      title: 'Tai nạn giao thông nghiêm trọng',
      description: 'Bệnh viện Chợ Rẫy cần máu O- khẩn cấp cho bệnh nhân đa chấn thương',
      bloodType: 'O-',
      timeFrame: '30 phút',
      priority: 'critical',
      icon: TruckIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      status: 'active',
      unitsNeeded: 8,
      location: 'BV Chợ Rẫy, Q.5',
      testimonial: 'Cần máu gấp để cứu sống bệnh nhân 25 tuổi'
    },
    {
      id: 2,
      title: 'Phẫu thuật tim khẩn cấp',
      description: 'Bệnh viện Tâm Đức cần máu A+ cho ca phẫu thuật tim cấp cứu',
      bloodType: 'A+',
      timeFrame: '1 giờ',
      priority: 'high',
      icon: HeartSolidIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      status: 'active',
      unitsNeeded: 6,
      location: 'BV Tâm Đức, Q.1',
      testimonial: 'Bệnh nhân 45 tuổi cần phẫu thuật tim ngay'
    },
    {
      id: 3,
      title: 'Điều trị ung thư máu',
      description: 'Bệnh viện Ung Bướu cần tiểu cầu cho bệnh nhân bạch cầu cấp',
      bloodType: 'AB+',
      timeFrame: '2 giờ',
      priority: 'medium',
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      status: 'pending',
      unitsNeeded: 4,
      location: 'BV Ung Bướu, Q.Bình Thạnh',
      testimonial: 'Trẻ em 8 tuổi cần tiểu cầu để điều trị'
    }
  ];

  const emergencyStats = [
    {
      icon: ClockIcon,
      value: '< 30 phút',
      label: 'Thời gian phản hồi',
      change: '+15%',
      color: 'text-life-600',
      bgColor: 'bg-life-50'
    },
    {
      icon: HeartSolidIcon,
      value: '247',
      label: 'Sinh mạng cứu sống',
      change: '+23%',
      color: 'text-blood-600',
      bgColor: 'bg-blood-50'
    },
    {
      icon: TruckIcon,
      value: '98.5%',
      label: 'Tỷ lệ thành công',
      change: '+2.1%',
      color: 'text-emergency-600',
      bgColor: 'bg-emergency-50'
    },
    {
      icon: BellIcon,
      value: '24/7',
      label: 'Hoạt động liên tục',
      change: '100%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      critical: { variant: 'danger' as const, label: 'Cực kỳ khẩn cấp', pulse: true },
      high: { variant: 'emergency' as const, label: 'Khẩn cấp', pulse: false },
      medium: { variant: 'warning' as const, label: 'Cần thiết', pulse: false },
      low: { variant: 'success' as const, label: 'Ổn định', pulse: false }
    };
    
    const config = variants[urgency as keyof typeof variants];
    return (
      <Badge 
        variant={config.variant} 
        size="sm" 
        pulse={config.pulse}
        className={config.pulse ? 'animate-pulse' : ''}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <section className="py-24 bg-gradient-to-b from-dark-900 via-dark-800 to-blood-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-emergency-500/20 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-blood-400/10 rounded-full blur-2xl animate-bounce-slow"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emergency-500/20 text-emergency-300 text-sm font-medium mb-6 backdrop-blur-sm border border-emergency-500/30">
            <ExclamationTriangleIcon className="w-4 h-4 mr-2 animate-pulse" />
            Tình huống khẩn cấp
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Yêu cầu máu
            <span className="block bg-gradient-to-r from-emergency-400 to-emergency-600 bg-clip-text text-transparent">
              Khẩn cấp
            </span>
          </h2>
          
          <p className="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed">
            Hệ thống cảnh báo và phản hồi khẩn cấp 24/7. Mỗi giây đều quan trọng 
            trong việc cứu sống bệnh nhân.
          </p>
        </div>

        {/* Emergency Hotline */}
        <div className="mb-16 animate-slide-up">
          <Card variant="glass" padding="xl" className="bg-emergency-600/20 backdrop-blur-md border-emergency-500/30">
            <div className="text-center">
              <div className="w-20 h-20 bg-emergency-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
                <PhoneIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">Hotline Khẩn Cấp</h3>
              <div className="text-5xl font-bold text-emergency-400 mb-4 animate-pulse">115</div>
              <p className="text-dark-300 mb-8">Gọi ngay khi cần máu khẩn cấp - Phản hồi trong 30 phút</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {emergencyStats.map((stat, index) => (
                  <div key={index} className={`p-4 ${stat.bgColor}/20 rounded-xl border border-white/10 backdrop-blur-sm`}>
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-dark-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Blood Types Emergency */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Nhóm máu cần khẩn cấp</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bloodTypes.map((type, index) => (
              <Card
                key={type.type}
                variant="glass"
                padding="lg"
                hover
                className={`cursor-pointer transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 animate-slide-up ${
                  selectedBloodType === type.type ? 'ring-2 ring-emergency-400 shadow-glow' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedBloodType(
                  selectedBloodType === type.type ? null : type.type
                )}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${type.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-xl font-bold text-white">{type.type}</span>
                  </div>
                  
                  <h4 className="font-semibold text-white mb-2">{type.name}</h4>
                  
                  {getUrgencyBadge(type.urgency)}
                  
                  <div className="mt-3 text-sm">
                    <div className="flex justify-between text-dark-300 mb-1">
                      <span>Cần:</span>
                      <span className="text-emergency-400 font-semibold">{type.needed}</span>
                    </div>
                    <div className="flex justify-between text-dark-300">
                      <span>Có:</span>
                      <span className={`font-semibold ${
                        type.available < type.needed * 0.3 ? 'text-red-400' : 
                        type.available < type.needed * 0.7 ? 'text-yellow-400' : 'text-life-400'
                      }`}>
                        {type.available}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          type.available < type.needed * 0.3 ? 'bg-red-500' : 
                          type.available < type.needed * 0.7 ? 'bg-yellow-500' : 'bg-life-500'
                        }`}
                        style={{ width: `${Math.min((type.available / type.needed) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Cases */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Trường hợp khẩn cấp gần đây</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {emergencyCases.map((emergencyCase, index) => (
              <Card
                key={emergencyCase.id}
                variant="glass"
                padding="lg"
                hover
                className={`cursor-pointer transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 animate-slide-up ${
                  selectedCase === emergencyCase.id.toString() ? 'ring-2 ring-emergency-400 shadow-glow' : ''
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedCase(
                  selectedCase === emergencyCase.id.toString() ? null : emergencyCase.id.toString()
                )}
              >
                <div className={`w-12 h-12 ${emergencyCase.bgColor}/20 rounded-xl flex items-center justify-center mb-4`}>
                  <emergencyCase.icon className={`w-6 h-6 ${emergencyCase.color}`} />
                </div>
                
                <h4 className="font-semibold text-white mb-2">{emergencyCase.title}</h4>
                <p className="text-dark-300 text-sm mb-4 leading-relaxed">
                  {emergencyCase.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="blood" size="sm">
                    {emergencyCase.bloodType}
                  </Badge>
                  <Badge variant="emergency" size="sm">
                    {emergencyCase.timeFrame}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-dark-300 mb-3">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{emergencyCase.location}</span>
                </div>
                
                <div className="text-sm text-dark-300 mb-4">
                  <strong>Cần:</strong> {emergencyCase.unitsNeeded} đơn vị máu
                </div>
                
                {selectedCase === emergencyCase.id.toString() && (
                  <div className="pt-4 border-t border-white/20 animate-slide-down">
                    <p className="text-sm text-emergency-300 italic">
                      "{emergencyCase.testimonial}"
                    </p>
                    <Button
                      variant="emergency"
                      size="sm"
                      fullWidth
                      className="mt-4"
                      leftIcon={<HeartSolidIcon className="w-4 h-4" />}
                    >
                      Hiến máu ngay
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="emergency"
              size="xl"
              leftIcon={<HeartSolidIcon className="w-6 h-6" />}
              className="transform hover:scale-105"
              disabled={!selectedBloodType}
            >
              {selectedBloodType ? `Yêu cầu máu ${selectedBloodType}` : 'Yêu cầu máu khẩn cấp'}
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              leftIcon={<MapPinIcon className="w-6 h-6" />}
              className="border-white text-white hover:bg-white hover:text-dark-900 transform hover:scale-105"
            >
              Tìm bệnh viện gần nhất
            </Button>
          </div>
          
          <p className="text-dark-400 text-sm mt-6">
            Mọi thông tin được mã hóa và bảo mật theo tiêu chuẩn y tế quốc tế
          </p>
        </div>
      </div>
    </section>
  );
}

export default EmergencySection;