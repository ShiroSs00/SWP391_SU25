import { useState} from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/Button";
import {
    Phone as PhoneIcon,
    MapPin as MapPinIcon,
    Clock as ClockIcon,
    Users as UserGroupIcon,
    Truck as TruckIcon,
    Heart as HeartSolidIcon,
    Activity,
    Zap,
    Shield,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Minus,
    User,
    Building,
    Siren,
    Timer,
    Target,
    Award,
    Navigation
} from 'lucide-react';

export function EmergencyPage() {
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
            available: 12,
            trend: 'down',
            lastUpdate: '5 phút trước',
            criticalLevel: 'Cực kỳ thiếu',
            estimatedDays: 2,
            hospitals: ['BV Chợ Rẫy', 'BV Bình Dan', 'BV 115'],
            emergencyUses: ['Tai nạn giao thông', 'Phẫu thuật cấp cứu', 'Chấn thương nặng']
        },
        {
            type: 'O+',
            name: 'O dương',
            urgency: 'high',
            color: 'bg-orange-500',
            textColor: 'text-orange-600',
            description: 'Nhu cầu cao',
            needed: 120,
            available: 67,
            trend: 'stable',
            lastUpdate: '10 phút trước',
            criticalLevel: 'Thiếu',
            estimatedDays: 5,
            hospitals: ['BV Chợ Rẫy', 'BV Tâm Đức', 'BV Ung Bướu'],
            emergencyUses: ['Phẫu thuật tim', 'Điều trị ung thư', 'Cấp cứu nội khoa']
        },
        {
            type: 'A-',
            name: 'A âm',
            urgency: 'high',
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            description: 'Cần bổ sung',
            needed: 30,
            available: 8,
            trend: 'down',
            lastUpdate: '15 phút trước',
            criticalLevel: 'Rất thiếu',
            estimatedDays: 3,
            hospitals: ['BV Tâm Đức', 'BV Nhi Đồng 1'],
            emergencyUses: ['Phẫu thuật nhi', 'Điều trị máu', 'Cấp cứu sản khoa']
        },
        {
            type: 'B-',
            name: 'B âm',
            urgency: 'critical',
            color: 'bg-red-500',
            textColor: 'text-red-600',
            description: 'Rất cần gấp',
            needed: 25,
            available: 3,
            trend: 'critical',
            lastUpdate: '2 phút trước',
            criticalLevel: 'Cực kỳ thiếu',
            estimatedDays: 1,
            hospitals: ['BV Chợ Rẫy', 'BV Ung Bướu'],
            emergencyUses: ['Cấp cứu hiếm', 'Phẫu thuật đặc biệt', 'Điều trị bệnh hiếm']
        },
        {
            type: 'AB-',
            name: 'AB âm',
            urgency: 'medium',
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            description: 'Hiếm nhất',
            needed: 8,
            available: 2,
            trend: 'stable',
            lastUpdate: '30 phút trước',
            criticalLevel: 'Thiếu',
            estimatedDays: 4,
            hospitals: ['BV Tâm Đức'],
            emergencyUses: ['Cấp cứu đặc biệt', 'Phẫu thuật phức tạp']
        },
        {
            type: 'A+',
            name: 'A dương',
            urgency: 'medium',
            color: 'bg-green-500',
            textColor: 'text-green-600',
            description: 'Ổn định',
            needed: 80,
            available: 95,
            trend: 'up',
            lastUpdate: '1 giờ trước',
            criticalLevel: 'Đủ',
            estimatedDays: 12,
            hospitals: ['Tất cả bệnh viện'],
            emergencyUses: ['Điều trị thường quy', 'Phẫu thuật']
        },
        {
            type: 'B+',
            name: 'B dương',
            urgency: 'low',
            color: 'bg-green-400',
            textColor: 'text-green-600',
            description: 'Đủ dùng',
            needed: 35,
            available: 42,
            trend: 'up',
            lastUpdate: '2 giờ trước',
            criticalLevel: 'Dư thừa',
            estimatedDays: 15,
            hospitals: ['Tất cả bệnh viện'],
            emergencyUses: ['Điều trị chuyên khoa', 'Phẫu thuật']
        },
        {
            type: 'AB+',
            name: 'AB dương',
            urgency: 'low',
            color: 'bg-blue-400',
            textColor: 'text-blue-600',
            description: 'Dự trữ tốt',
            needed: 15,
            available: 18,
            trend: 'stable',
            lastUpdate: '3 giờ trước',
            criticalLevel: 'Đủ',
            estimatedDays: 10,
            hospitals: ['Tất cả bệnh viện'],
            emergencyUses: ['Cấp cứu AB+', 'Phẫu thuật AB+']
        }
    ];

    const emergencyCases = [
        {
            id: 1,
            title: 'Tai nạn giao thông nghiêm trọng - Cao tốc TP.HCM - Long Thành',
            description: 'Va chạm liên hoàn 4 xe tại km 15, 3 nạn nhân nguy kịch cần máu O- và A+ khẩn cấp',
            bloodType: 'O-',
            timeFrame: '15 phút',
            priority: 'critical',
            icon: TruckIcon,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            status: 'active',
            unitsNeeded: 12,
            location: 'BV Chợ Rẫy, Q.5',
            district: 'Quận 5',
            testimonial: 'Cần máu gấp để cứu sống 3 bệnh nhân đa chấn thương',
            timePosted: '2 phút trước',
            urgencyLevel: 'CODE RED',
            patientInfo: {
                count: 3,
                ages: ['25 tuổi', '34 tuổi', '42 tuổi'],
                conditions: ['Chấn thương sọ não', 'Vỡ lách', 'Gãy xương đùi']
            },
            medicalTeam: 'Đội cấp cứu A - BS. Nguyễn Văn An',
            estimatedSurgeryTime: '3-4 giờ',
            bloodTypesNeeded: ['O-', 'A+'],
            distance: '2.5 km từ trung tâm'
        },
        {
            id: 2,
            title: 'Phẫu thuật tim cấp cứu - Bệnh nhi 8 tuổi',
            description: 'Trẻ em bị tim bẩm sinh cần phẫu thuật khẩn cấp tại BV Nhi Đồng 1, cần máu A- và tiểu cầu',
            bloodType: 'A-',
            timeFrame: '45 phút',
            priority: 'high',
            icon: HeartSolidIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            status: 'active',
            unitsNeeded: 6,
            location: 'BV Nhi Đồng 1, Q.1',
            district: 'Quận 1',
            testimonial: 'Em bé 8 tuổi cần phẫu thuật tim để cứu sống',
            timePosted: '8 phút trước',
            urgencyLevel: 'CODE YELLOW',
            patientInfo: {
                count: 1,
                ages: ['8 tuổi'],
                conditions: ['Tim bẩm sinh phức tạp']
            },
            medicalTeam: 'Đội phẫu thuật tim nhi - BS. Trần Thị Bình',
            estimatedSurgeryTime: '6-8 giờ',
            bloodTypesNeeded: ['A-', 'Tiểu cầu'],
            distance: '1.2 km từ trung tâm'
        },
        {
            id: 3,
            title: 'Biến chứng sản khoa - Chảy máu sau sinh',
            description: 'Sản phụ 28 tuổi chảy máu nặng sau sinh tại BV Từ Dũ, cần máu O+ và plasma khẩn cấp',
            bloodType: 'O+',
            timeFrame: '30 phút',
            priority: 'high',
            icon: UserGroupIcon,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            status: 'active',
            unitsNeeded: 8,
            location: 'BV Từ Dũ, Q.1',
            district: 'Quận 1',
            testimonial: 'Sản phụ trẻ cần máu gấp để cứu sống',
            timePosted: '12 phút trước',
            urgencyLevel: 'CODE RED',
            patientInfo: {
                count: 1,
                ages: ['28 tuổi'],
                conditions: ['Chảy máu sau sinh']
            },
            medicalTeam: 'Đội sản khoa cấp cứu - BS. Lê Văn Cường',
            estimatedSurgeryTime: '2-3 giờ',
            bloodTypesNeeded: ['O+', 'Plasma'],
            distance: '0.8 km từ trung tâm'
        },
        {
            id: 4,
            title: 'Điều trị ung thư máu cấp tính',
            description: 'Bệnh nhân 45 tuổi bị bạch cầu cấp tại BV Ung Bướu, cần tiểu cầu và hồng cầu AB+',
            bloodType: 'AB+',
            timeFrame: '2 giờ',
            priority: 'medium',
            icon: Activity,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            status: 'pending',
            unitsNeeded: 4,
            location: 'BV Ung Bướu, Q.Bình Thạnh',
            district: 'Quận Bình Thạnh',
            testimonial: 'Bệnh nhân ung thư máu cần điều trị liên tục',
            timePosted: '45 phút trước',
            urgencyLevel: 'CODE BLUE',
            patientInfo: {
                count: 1,
                ages: ['45 tuổi'],
                conditions: ['Bạch cầu cấp tính']
            },
            medicalTeam: 'Khoa Huyết học - BS. Phạm Thị Dung',
            estimatedSurgeryTime: 'Điều trị dài hạn',
            bloodTypesNeeded: ['AB+', 'Tiểu cầu'],
            distance: '8.5 km từ trung tâm'
        }
    ];

    const emergencyStats = [
        {
            icon: ClockIcon,
            value: '< 12 phút',
            label: 'Thời gian phản hồi',
            change: '+30%',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            description: 'Thời gian trung bình từ khi nhận yêu cầu đến khi có máu tại TP.HCM',
            trend: 'up'
        },
        {
            icon: HeartSolidIcon,
            value: '156',
            label: 'Sinh mạng cứu sống',
            change: '+22%',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: 'Số người được cứu sống trong tháng qua tại TP.HCM',
            trend: 'up'
        },
        {
            icon: TruckIcon,
            value: '99.8%',
            label: 'Tỷ lệ thành công',
            change: '+1.8%',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: 'Tỷ lệ đáp ứng thành công các yêu cầu khẩn cấp tại TP.HCM',
            trend: 'up'
        },
        {
            icon: Building,
            value: '28',
            label: 'Bệnh viện kết nối',
            change: '+3',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            description: 'Số bệnh viện tham gia mạng lưới cấp cứu tại TP.HCM',
            trend: 'up'
        }
    ];


    const emergencyProtocols = [
        {
            level: 'CODE RED',
            description: 'Nguy hiểm tính mạng - Cần máu trong 15 phút',
            color: 'bg-red-600',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
            actions: ['Kích hoạt tất cả nguồn máu TP.HCM', 'Liên hệ hiến máu khẩn cấp', 'Ưu tiên vận chuyển']
        },
        {
            level: 'CODE YELLOW',
            description: 'Khẩn cấp - Cần máu trong 1 giờ',
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            actions: ['Kiểm tra kho máu các BV', 'Liên hệ bệnh viện khác', 'Chuẩn bị vận chuyển']
        },
        {
            level: 'CODE BLUE',
            description: 'Cần thiết - Cần máu trong 4 giờ',
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            actions: ['Lên kế hoạch thu thập', 'Thông báo tình trạng', 'Dự trữ máu']
        }
    ];

    const getUrgencyBadge = (urgency: string) => {
        const variants = {
            critical: { variant: 'destructive' as const, label: 'Cực kỳ khẩn cấp', pulse: true },
            high: { variant: 'warning' as const, label: 'Khẩn cấp', pulse: false },
            medium: { variant: 'warning' as const, label: 'Cần thiết', pulse: false },
            low: { variant: 'success' as const, label: 'Ổn định', pulse: false }
        };

        const config = variants[urgency as keyof typeof variants];
        return (
            <Badge
                variant={config.variant}
                size="sm"
                className={config.pulse ? 'animate-pulse' : ''}
            >
                {config.label}
            </Badge>
        );
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'down':
                return <TrendingDown className="w-4 h-4 text-red-500" />;
            case 'critical':
                return <AlertCircle className="w-4 h-4 text-red-600 animate-pulse" />;
            default:
                return <Minus className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-red-600 to-red-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-400/20 text-yellow-200 text-sm font-medium mb-6 backdrop-blur-sm border border-yellow-400/30">
                        <Siren className="w-4 h-4 mr-2 animate-pulse" />
                        Trung tâm cấp cứu TP. Hồ Chí Minh
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                        Mạng lưới cấp cứu
                        <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            máu khẩn cấp
                        </span>
                    </h1>

                    <p className="text-xl text-red-100 max-w-4xl mx-auto leading-relaxed mb-8">
                        Hệ thống giám sát và điều phối máu khẩn cấp 24/7 tại TP. Hồ Chí Minh.
                        Kết nối trực tiếp với bệnh viện lớn, đảm bảo phản hồi trong 12 phút
                        cho các trường hợp nguy hiểm tính mạng.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="secondary"
                            size="lg"
                            leftIcon={<PhoneIcon className="w-5 h-5" />}
                            className="bg-white text-red-600 hover:bg-red-50"
                        >
                            Hotline 115 - Cấp cứu
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            leftIcon={<Navigation className="w-5 h-5" />}
                            className="border-white text-white hover:bg-white hover:text-red-600"
                        >
                            Bản đồ bệnh viện TP.HCM
                        </Button>
                    </div>
                </div>
            </section>

            {/* Emergency Control Center */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Emergency Hotline */}
                    <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-red-600 to-red-800 text-white mb-12">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                <PhoneIcon className="w-12 h-12 text-white animate-pulse" />
                            </div>
                            <h2 className="text-4xl font-bold mb-2">Trung tâm cấp cứu 115 TP.HCM</h2>
                            <div className="text-6xl font-bold text-yellow-300 mb-4 animate-pulse">115</div>
                            <p className="text-red-100 text-lg mb-8">
                                Đường dây nóng 24/7 - Kết nối trực tiếp với bệnh viện
                            </p>

                            {/* Real-time Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {emergencyStats.map((stat, index) => (
                                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {getTrendIcon(stat.trend)}
                                                <span className="ml-1 text-green-300">{stat.change}</span>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-red-100 text-sm mb-2">{stat.label}</div>
                                        <div className="text-xs text-red-200">{stat.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>


                    {/* Emergency Protocols */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quy trình ứng phó khẩn cấp tại TP.HCM</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {emergencyProtocols.map((protocol, index) => (
                                <Card key={index} variant="outlined" padding="lg" className={`${protocol.bgColor} border-2`}>
                                    <div className="text-center">
                                        <div className={`w-16 h-16 ${protocol.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                            <Siren className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className={`text-xl font-bold ${protocol.textColor} mb-2`}>
                                            {protocol.level}
                                        </h3>
                                        <p className={`${protocol.textColor} mb-4`}>
                                            {protocol.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {protocol.actions.map((action, idx) => (
                                                <li key={idx} className={`text-sm ${protocol.textColor} flex items-center`}>
                                                    <Target className="w-4 h-4 mr-2" />
                                                    {action}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blood Types Emergency Status */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Tình trạng máu khẩn cấp tại TP. Hồ Chí Minh
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Cập nhật liên tục từ 28 bệnh viện trong mạng lưới cấp cứu
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {bloodTypes.map((type) => (
                            <Card
                                key={type.type}
                                variant="elevated"
                                padding="lg"
                                className={`cursor-pointer transition-all duration-300 group ${
                                    selectedBloodType === type.type ? 'ring-2 ring-red-500 shadow-2xl scale-105' : 'hover:shadow-xl hover:scale-105'
                                }`}
                                onClick={() => setSelectedBloodType(
                                    selectedBloodType === type.type ? null : type.type
                                )}
                            >
                                <div className="text-center">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-16 h-16 ${type.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                            <span className="text-xl font-bold text-white">{type.type}</span>
                                        </div>
                                        <div className="text-right">
                                            {getTrendIcon(type.trend)}
                                            <div className="text-xs text-gray-500 mt-1">{type.lastUpdate}</div>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-gray-900 mb-2">{type.name}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>

                                    {getUrgencyBadge(type.urgency)}

                                    <div className="mt-4 space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-700">
                                            <span>Cần:</span>
                                            <span className="font-semibold text-red-600">{type.needed} đơn vị</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Có:</span>
                                            <span className={`font-semibold ${
                                                type.available < type.needed * 0.3 ? 'text-red-500' :
                                                    type.available < type.needed * 0.7 ? 'text-yellow-500' : 'text-green-500'
                                            }`}>
                                                {type.available} đơn vị
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Dự kiến hết:</span>
                                            <span className={`font-semibold ${
                                                type.estimatedDays <= 3 ? 'text-red-500' :
                                                    type.estimatedDays <= 7 ? 'text-yellow-500' : 'text-green-500'
                                            }`}>
                                                {type.estimatedDays} ngày
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-500 ${
                                                    type.available < type.needed * 0.3 ? 'bg-red-500' :
                                                        type.available < type.needed * 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${Math.min((type.available / type.needed) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 text-center">
                                            {Math.round((type.available / type.needed) * 100)}% đáp ứng
                                        </div>
                                    </div>

                                    {/* Expanded Info */}
                                    {selectedBloodType === type.type && (
                                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                                            <div>
                                                <h5 className="font-semibold text-gray-900 mb-2">Bệnh viện cần gấp:</h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {type.hospitals.map((hospital, idx) => (
                                                        <Badge key={idx} variant="destructive" size="sm">
                                                            {hospital}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="font-semibold text-gray-900 mb-2">Ứng dụng khẩn cấp:</h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {type.emergencyUses.map((use, idx) => (
                                                        <Badge key={idx} variant="warning" size="sm">
                                                            {use}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-3 bg-red-50 rounded-lg">
                                                <p className="text-sm text-red-800 font-medium">
                                                    <strong>Mức độ:</strong> {type.criticalLevel}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Emergency Cases */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Trường hợp khẩn cấp đang xử lý tại TP.HCM
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {emergencyCases.filter(c => c.status === 'active').length} trường hợp đang cần máu khẩn cấp
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {emergencyCases.map((emergencyCase) => (
                            <Card
                                key={emergencyCase.id}
                                variant="elevated"
                                padding="lg"
                                className={`cursor-pointer transition-all duration-300 group ${
                                    selectedCase === emergencyCase.id.toString() ? 'ring-2 ring-red-500 shadow-2xl' : 'hover:shadow-xl'
                                } ${emergencyCase.priority === 'critical' ? 'border-l-4 border-red-500' : ''}`}
                                onClick={() => setSelectedCase(
                                    selectedCase === emergencyCase.id.toString() ? null : emergencyCase.id.toString()
                                )}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 ${emergencyCase.bgColor} rounded-xl flex items-center justify-center`}>
                                        <emergencyCase.icon className={`w-6 h-6 ${emergencyCase.color}`} />
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={emergencyCase.priority === 'critical' ? 'destructive' : 'warning'}
                                            size="sm"
                                            className={emergencyCase.priority === 'critical' ? 'animate-pulse' : ''}
                                        >
                                            {emergencyCase.urgencyLevel}
                                        </Badge>
                                        <div className="text-xs text-gray-500 mt-1">{emergencyCase.timePosted}</div>
                                    </div>
                                </div>

                                <h3 className="font-bold text-gray-900 mb-2 text-lg">{emergencyCase.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {emergencyCase.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Timer className="w-4 h-4 mr-2 text-red-500" />
                                        <span>Cần trong {emergencyCase.timeFrame}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPinIcon className="w-4 h-4 mr-2 text-blue-500" />
                                        <span>{emergencyCase.district}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <Badge variant="blood" size="md">
                                        Cần {emergencyCase.unitsNeeded} đơn vị {emergencyCase.bloodType}
                                    </Badge>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <User className="w-4 h-4 mr-1" />
                                        {emergencyCase.patientInfo.count} bệnh nhân
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <Navigation className="w-4 h-4 mr-2 text-green-500" />
                                        <span>{emergencyCase.distance}</span>
                                    </div>
                                </div>

                                {selectedCase === emergencyCase.id.toString() && (
                                    <div className="pt-4 border-t border-gray-200 space-y-4">
                                        {/* Patient Details */}
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-900 mb-2">Thông tin bệnh nhân:</h4>
                                            <div className="space-y-2 text-sm text-blue-800">
                                                {emergencyCase.patientInfo.ages.map((age, idx) => (
                                                    <div key={idx} className="flex justify-between">
                                                        <span>{age}</span>
                                                        <span>{emergencyCase.patientInfo.conditions[idx]}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Medical Team */}
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-900 mb-2">Đội ngũ y tế:</h4>
                                            <p className="text-sm text-green-800">{emergencyCase.medicalTeam}</p>
                                            <p className="text-xs text-green-600 mt-1">
                                                Thời gian phẫu thuật dự kiến: {emergencyCase.estimatedSurgeryTime}
                                            </p>
                                        </div>

                                        {/* Blood Types Needed */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Loại máu cần thiết:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {emergencyCase.bloodTypesNeeded.map((type, idx) => (
                                                    <Badge key={idx} variant="destructive" size="sm">
                                                        {type}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-red-50 rounded-lg p-4">
                                            <p className="text-sm text-red-800 italic">
                                                "{emergencyCase.testimonial}"
                                            </p>
                                        </div>

                                        <div className="flex space-x-3">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                leftIcon={<HeartSolidIcon className="w-4 h-4" />}
                                                className="flex-1"
                                            >
                                                Hiến máu ngay
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                leftIcon={<PhoneIcon className="w-4 h-4" />}
                                            >
                                                Liên hệ BV
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                leftIcon={<Navigation className="w-4 h-4" />}
                                            >
                                                Chỉ đường
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-16 bg-gradient-to-r from-red-600 to-red-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Hành động cứu người tại TP. Hồ Chí Minh
                    </h2>
                    <p className="text-xl text-red-100 mb-8">
                        Mỗi phút trễ có thể ảnh hưởng đến tính mạng của bệnh nhân.
                        Hệ thống của chúng tôi đảm bảo phản hồi nhanh nhất trong vòng 12 phút.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                        <Button
                            variant="secondary"
                            size="xl"
                            leftIcon={<HeartSolidIcon className="w-6 h-6" />}
                            className="bg-white text-red-600 hover:bg-red-50 transform hover:scale-105"
                        >
                            {selectedBloodType ? `Hiến máu ${selectedBloodType} tại TP.HCM` : 'Đăng ký hiến máu khẩn cấp'}
                        </Button>

                        <Button
                            variant="outline"
                            size="xl"
                            leftIcon={<Navigation className="w-6 h-6" />}
                            className="border-white text-white hover:bg-white hover:text-red-600 transform hover:scale-105"
                        >
                            Tìm bệnh viện gần nhất
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-red-100">
                        <div className="flex items-center justify-center">
                            <Shield className="w-5 h-5 mr-2" />
                            <span>Bảo mật y tế tuyệt đối</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <Zap className="w-5 h-5 mr-2" />
                            <span>Phản hồi trong 12 phút</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <Award className="w-5 h-5 mr-2" />
                            <span>Chứng nhận hiến máu TP.HCM</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default EmergencyPage;