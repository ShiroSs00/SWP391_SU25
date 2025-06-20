import Card from '../ui/card';
import { HeartIcon, UserGroupIcon, BeakerIcon, ClockIcon } from '@heroicons/react/24/outline';

export function StatsSection() {
    const stats = [
        {
            icon: UserGroupIcon,
            value: '12,456',
            label: 'Người hiến máu đăng ký',
            change: '+15%',
            changeType: 'increase',
            color: 'text-blue-600'
        },
        {
            icon: BeakerIcon, // replaced DropletIcon
            value: '45,678',
            label: 'Đơn vị máu đã hiến',
            change: '+23%',
            changeType: 'increase',
            color: 'text-red-600'
        },
        {
            icon: HeartIcon,
            value: '8,901',
            label: 'Sinh mạng được cứu',
            change: '+18%',
            changeType: 'increase',
            color: 'text-green-600'
        },
        {
            icon: ClockIcon,
            value: '24/7',
            label: 'Hoạt động liên tục',
            change: '100%',
            changeType: 'stable',
            color: 'text-purple-600'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Thành tựu của chúng ta
                    </h2>
                    <p className="text-xl text-gray-600">
                        Những con số ấn tượng từ cộng đồng hiến máu BloodConnect
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6`}>
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {stat.value}
                            </div>

                            <div className="text-gray-600 mb-3">
                                {stat.label}
                            </div>

                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                stat.changeType === 'increase'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {stat.changeType === 'increase' && (
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {stat.change} so với tháng trước
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-6">
                        Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')} lúc {new Date().toLocaleTimeString('vi-VN')}
                    </p>
                    <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Hệ thống hoạt động bình thường
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            Dữ liệu được cập nhật real-time
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}