import { useState} from "react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/Button";
import {
    Users as UserGroupIcon,
    Info as InformationCircleIcon,
    ArrowRight as ArrowRightIcon,
    CheckCircle as CheckCircleIcon,
    Heart as HeartSolidIcon,
    BookOpen,
    Download,
    Share2,
    AlertCircle,
    Clock,
    Shield,
    Activity,
    Zap,
    Target,
    Calendar,
    MapPin,
    Phone
} from 'lucide-react';
import { useNavigate} from "react-router-dom";

const bloodTypes = [
    {
        type: 'O-',
        name: 'O âm',
        description: 'Người hiến máu vạn năng',
        canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        canReceiveFrom: ['O-'],
        percentage: 7,
        color: 'bg-red-600',
        rarity: 'Rất hiếm',
        importance: 'Cực kỳ quan trọng - Có thể hiến cho tất cả nhóm máu',
        characteristics: [
            'Máu hiếm nhất và quý giá nhất',
            'Có thể cứu sống bất kỳ ai',
            'Luôn trong tình trạng thiếu hụt',
            'Ưu tiên cao nhất trong cấp cứu'
        ],
        medicalInfo: {
            antibodies: 'Có kháng thể Anti-A và Anti-B',
            antigens: 'Không có kháng nguyên A, B, Rh',
            compatibility: 'Tương thích với mọi nhóm máu khi hiến',
            storage: 'Bảo quản 35-42 ngày ở 1-6°C',
            uses: ['Cấp cứu khẩn cấp', 'Phẫu thuật lớn', 'Tai nạn nghiêm trọng']
        },
        donationTips: [
            'Nên hiến máu định kỳ 3-4 tháng/lần',
            'Ăn nhiều thực phẩm giàu sắt',
            'Uống đủ nước trước khi hiến máu',
            'Tránh stress và nghỉ ngơi đầy đủ'
        ]
    },
    {
        type: 'O+',
        name: 'O dương',
        description: 'Nhóm máu phổ biến nhất',
        canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
        canReceiveFrom: ['O-', 'O+'],
        percentage: 38,
        color: 'bg-red-500',
        rarity: 'Phổ biến',
        importance: 'Rất quan trọng - Nhu cầu cao nhất',
        characteristics: [
            'Nhóm máu phổ biến nhất',
            'Nhu cầu sử dụng cao',
            'Hiến cho 4 nhóm máu dương',
            'Dễ tìm người hiến'
        ],
        medicalInfo: {
            antibodies: 'Có kháng thể Anti-A và Anti-B',
            antigens: 'Có kháng nguyên Rh(D)',
            compatibility: 'Hiến cho các nhóm máu dương tính',
            storage: 'Bảo quản 35-42 ngày ở 1-6°C',
            uses: ['Điều trị thường quy', 'Phẫu thuật', 'Chấn thương']
        },
        donationTips: [
            'Có thể hiến máu thường xuyên',
            'Bổ sung vitamin C để hấp thụ sắt tốt hơn',
            'Kiểm tra sức khỏe định kỳ',
            'Duy trì chế độ ăn cân bằng'
        ]
    },
    {
        type: 'A-',
        name: 'A âm',
        description: 'Hiếm và có giá trị',
        canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
        canReceiveFrom: ['O-', 'A-'],
        percentage: 6,
        color: 'bg-blue-600',
        rarity: 'Hiếm',
        importance: 'Quan trọng cho nhóm A và AB',
        characteristics: [
            'Nhóm máu hiếm thứ hai',
            'Quan trọng cho phẫu thuật',
            'Hiến cho nhóm A và AB',
            'Cần dự trữ thường xuyên'
        ],
        medicalInfo: {
            antibodies: 'Có kháng thể Anti-B',
            antigens: 'Có kháng nguyên A, không có Rh(D)',
            compatibility: 'Hiến cho nhóm A và AB',
            storage: 'Bảo quản 35-42 ngày ở 1-6°C',
            uses: ['Phẫu thuật tim', 'Điều trị ung thư', 'Cấp cứu']
        },
        donationTips: [
            'Hiến máu định kỳ để duy trì nguồn cung',
            'Ăn nhiều rau xanh và trái cây',
            'Tránh căng thẳng trước khi hiến máu',
            'Theo dõi chỉ số hemoglobin'
        ]
    },
    {
        type: 'A+',
        name: 'A dương',
        description: 'Nhóm máu thường gặp',
        canDonateTo: ['A+', 'AB+'],
        canReceiveFrom: ['O-', 'O+', 'A-', 'A+'],
        percentage: 34,
        color: 'bg-blue-500',
        rarity: 'Phổ biến',
        importance: 'Quan trọng cho điều trị thường quy',
        characteristics: [
            'Nhóm máu phổ biến thứ hai',
            'Dùng nhiều trong điều trị',
            'Có thể nhận từ 4 nhóm',
            'Ổn định về nguồn cung'
        ],
        medicalInfo: {
            antibodies: 'Có kháng thể Anti-B',
            antigens: 'Có kháng nguyên A và Rh(D)',
            compatibility: 'Hiến cho A+ và AB+',
            storage: 'Bảo quản 35-42 ngày ở 1-6°C',
            uses: ['Điều trị nội khoa', 'Phẫu thuật thường quy', 'Truyền máu định kỳ']
        },
        donationTips: [
            'Hiến máu 3-4 lần/năm',
            'Duy trì chế độ ăn giàu protein',
            'Tập thể dục nhẹ nhàng',
            'Uống nhiều nước sau hiến máu'
        ]
    },
    {
        type: 'B-',
        name: 'B âm',
        description: 'Nhóm máu hiếm',
        canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
        canReceiveFrom: ['O-', 'B-'],
        percentage: 2,
        color: 'bg-green-600',
        rarity: 'Rất hiếm',
        importance: 'Cần thiết cho nhóm B và AB',
        characteristics: [
            'Một trong những nhóm hiếm nhất',
            'Khó tìm người hiến',
            'Quan trọng cho cấp cứu',
            'Cần ưu tiên dự trữ'
        ],
        medicalInfo: {
            antibodies: 'Có kháng thể Anti-A',
            antigens: 'Có kháng nguyên B, không có Rh(D)',
            compatibility: 'Hiến cho nhóm B và AB',
            storage: 'Bảo quản 35-42 ngày ở 1-6°C',
            uses: ['Cấp cứu hiếm', 'Phẫu thuật đặc biệt', 'Điều trị bệnh hiếm']
        },
        donationTips: [
            'Hiến máu thường xuyên do hiếm',
            'Tham gia chương trình hiến máu định kỳ',
            'Khuyến khích người thân cùng nhóm máu',
            'Đăng ký danh sách hiến máu khẩn cấp'
        ]
    },
    {
        type: 'B+',
        name: 'B dương',
        description: 'Ít phổ biến hơn A và O',
        canDonateTo: ['B+', 'AB+'],
        canReceiveFrom: ['O-', 'O+', 'B-', 'B+'],
        percentage: 9,
        color: 'bg-green-500',
        rarity: 'Ít phổ biến',
        importance: 'Quan trọng cho cộng đồng B+',
        characteristics: [
            'Ít phổ biến nhưng ổn định',
            'Có thể nhận từ 4 nhóm',
            'Hiến cho B+ và AB+',
            'Cân bằng cung cầu'
        ],
        medicalInfo: {
            antibodies: 'Có kháng thể Anti-A',
            antigens: 'Có kháng nguyên B và Rh(D)',
            compatibility: 'Hiến cho B+ và AB+',
            storage: 'Bảo quản 35-42 ngày ở 1-6°C',
            uses: ['Điều trị chuyên khoa', 'Phẫu thuật', 'Cấp cứu']
        },
        donationTips: [
            'Hiến máu định kỳ 3 tháng/lần',
            'Ăn thực phẩm giàu folate',
            'Kiểm tra sức khỏe trước hiến máu',
            'Nghỉ ngơi đầy đủ sau hiến máu'
        ]
    },
    {
        type: 'AB-',
        name: 'AB âm',
        description: 'Nhóm máu hiếm nhất',
        canDonateTo: ['AB-', 'AB+'],
        canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'],
        percentage: 1,
        color: 'bg-purple-600',
        rarity: 'Cực hiếm',
        importance: 'Vô cùng quý giá - Chỉ 1% dân số',
        characteristics: [
            'Hiếm nhất trong 8 nhóm',
            'Chỉ 1% dân số có',
            'Có thể nhận từ 4 nhóm âm',
            'Cực kỳ khó tìm'
        ],
        medicalInfo: {
            antibodies: 'Không có kháng thể Anti-A, Anti-B',
            antigens: 'Có kháng nguyên A, B, không có Rh(D)',
            compatibility: 'Hiến cho AB- và AB+',
            storage: 'Bảo quản 35-42 ngày ở 1-6°C',
            uses: ['Cấp cứu đặc biệt', 'Phẫu thuật phức tạp', 'Điều trị hiếm']
        },
        donationTips: [
            'Hiến máu càng thường xuyên càng tốt',
            'Tham gia mạng lưới hiến máu hiếm',
            'Thông báo sẵn sàng hiến máu khẩn cấp',
            'Duy trì sức khỏe tối ưu'
        ]
    },
    {
        type: 'AB+',
        name: 'AB dương',
        description: 'Người nhận máu vạn năng',
        canDonateTo: ['AB+'],
        canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        percentage: 3,
        color: 'bg-purple-500',
        rarity: 'Hiếm',
        importance: 'Có thể nhận từ tất cả nhóm máu',
        characteristics: [
            'Người nhận vạn năng',
            'Có thể nhận từ mọi nhóm',
            'Chỉ hiến cho AB+',
            'Thuận lợi khi cần máu'
        ],
        medicalInfo: {
            antibodies: 'Không có kháng thể Anti-A, Anti-B',
            antigens: 'Có kháng nguyên A, B, Rh(D)',
            compatibility: 'Chỉ hiến cho AB+',
            storage: 'Bảo quản 35-42 ngày ở 1-6°C',
            uses: ['Cấp cứu AB+', 'Phẫu thuật AB+', 'Điều trị đặc biệt']
        },
        donationTips: [
            'Hiến máu để giúp cộng đồng AB+',
            'Tận dụng lợi thế nhận máu đa dạng',
            'Tham gia hiến tiểu cầu',
            'Hiến plasma cho nghiên cứu y học'
        ]
    }
];

const donationRequirements = [
    {
        category: 'Tuổi tác',
        icon: Calendar,
        requirements: [
            'Từ 18-60 tuổi (lần đầu)',
            'Từ 18-65 tuổi (đã hiến trước đó)',
            'Cân nặng tối thiểu 45kg',
            'Sức khỏe tổng quát tốt'
        ]
    },
    {
        category: 'Sức khỏe',
        icon: Activity,
        requirements: [
            'Huyết áp: 90-160/60-100 mmHg',
            'Mạch: 60-100 lần/phút',
            'Hemoglobin: Nam ≥125g/L, Nữ ≥120g/L',
            'Không mắc bệnh truyền nhiễm'
        ]
    },
    {
        category: 'Thời gian',
        icon: Clock,
        requirements: [
            'Cách lần hiến trước ≥12 tuần',
            'Không uống rượu bia 24h trước',
            'Không hút thuốc 2h trước',
            'Ngủ đủ giấc 6-8 tiếng'
        ]
    },
    {
        category: 'Chế độ ăn',
        icon: Target,
        requirements: [
            'Ăn sáng đầy đủ',
            'Tránh thức ăn nhiều dầu mỡ',
            'Uống đủ nước 2-3 ly',
            'Bổ sung thực phẩm giàu sắt'
        ]
    }
];

const bloodComponents = [
    {
        name: 'Hồng cầu',
        description: 'Vận chuyển oxy đến các cơ quan',
        uses: ['Thiếu máu', 'Mất máu cấp', 'Phẫu thuật'],
        storage: '35-42 ngày ở 1-6°C',
        volume: '200-250ml',
        color: 'bg-red-500'
    },
    {
        name: 'Tiểu cầu',
        description: 'Đông máu và cầm máu',
        uses: ['Ung thư máu', 'Hóa trị', 'Phẫu thuật'],
        storage: '5-7 ngày ở 20-24°C',
        volume: '50-70ml',
        color: 'bg-yellow-500'
    },
    {
        name: 'Plasma',
        description: 'Chứa protein và kháng thể',
        uses: ['Bỏng nặng', 'Sốc', 'Rối loạn đông máu'],
        storage: '12 tháng ở -18°C',
        volume: '200-250ml',
        color: 'bg-blue-500'
    },
    {
        name: 'Bạch cầu',
        description: 'Chống nhiễm trùng',
        uses: ['Suy giảm miễn dịch', 'Nhiễm trùng nặng'],
        storage: '24 giờ ở 20-24°C',
        volume: '50-100ml',
        color: 'bg-green-500'
    }
];

export function BloodTypesPage() {
    const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'compatibility' | 'guide' | 'components' | 'requirements'>('overview');
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-r from-red-600 to-red-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
                        <HeartSolidIcon className="w-4 h-4 mr-2" />
                        Kiến thức chuyên môn về máu
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                        Hệ thống phân loại
                        <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            nhóm máu ABO-Rh
                        </span>
                    </h1>

                    <p className="text-xl text-red-100 max-w-4xl mx-auto leading-relaxed mb-8">
                        Tìm hiểu sâu về hệ thống phân loại nhóm máu, cơ chế tương thích miễn dịch,
                        và ứng dụng lâm sàng trong y học hiện đại. Kiến thức chuyên môn giúp bạn
                        hiểu rõ tầm quan trọng của việc hiến máu đúng cách.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="secondary"
                            size="lg"
                            leftIcon={<BookOpen className="w-5 h-5" />}
                            className="bg-white text-red-600 hover:bg-red-50"
                            onClick={() => navigate('/donation')}
                        >
                            Hãy bắt đầu khám phá nhóm ma trong cơ thể của mình đây
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            leftIcon={<Download className="w-5 h-5" />}
                            className="border-white text-white hover:bg-white hover:text-red-600"
                        >
                            Tải tài liệu chuyên môn
                        </Button>
                    </div>
                </div>
            </section>

            {/* Navigation Tabs */}
            <section className="py-8 bg-white border-b sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center space-x-2 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Tổng quan', icon: HeartSolidIcon },
                            { id: 'compatibility', label: 'Ma trận tương thích', icon: CheckCircleIcon },
                            { id: 'components', label: 'Thành phần máu', icon: Activity },
                            { id: 'requirements', label: 'Điều kiện hiến máu', icon: Shield },
                            { id: 'guide', label: 'Hướng dẫn chuyên môn', icon: BookOpen }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {activeTab === 'overview' && (
                        <div className="space-y-16">
                            {/* Scientific Overview */}
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Hệ thống phân loại nhóm máu ABO-Rh
                                </h2>
                                <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed">
                                    <p className="mb-4">
                                        Hệ thống ABO được phát hiện bởi Karl Landsteiner năm 1901, dựa trên sự hiện diện
                                        của kháng nguyên A và B trên bề mặt hồng cầu. Hệ thống Rh được phát hiện năm 1940,
                                        bổ sung yếu tố D tạo nên 8 nhóm máu chính.
                                    </p>
                                    <p>
                                        Việc hiểu rõ tương thích miễn dịch giữa các nhóm máu là then chốt trong y học
                                        truyền máu, giúp đảm bảo an toàn cho người nhận và tối ưu hóa hiệu quả điều trị.
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                                <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-transform">
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <HeartSolidIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">8</div>
                                    <div className="text-gray-600">Nhóm máu chính</div>
                                    <div className="text-sm text-gray-500 mt-1">ABO + Rh</div>
                                </Card>

                                <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-transform">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <UserGroupIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">O-</div>
                                    <div className="text-gray-600">Hiến máu vạn năng</div>
                                    <div className="text-sm text-gray-500 mt-1">7% dân số</div>
                                </Card>

                                <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-transform">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <CheckCircleIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">AB+</div>
                                    <div className="text-gray-600">Nhận máu vạn năng</div>
                                    <div className="text-sm text-gray-500 mt-1">3% dân số</div>
                                </Card>

                                <Card variant="elevated" padding="lg" className="text-center group hover:scale-105 transition-transform">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <InformationCircleIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">AB-</div>
                                    <div className="text-gray-600">Hiếm nhất</div>
                                    <div className="text-sm text-gray-500 mt-1">1% dân số</div>
                                </Card>
                            </div>

                            {/* Blood Types Grid */}
                            <div>
                                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                                    Phân tích chi tiết 8 nhóm máu
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {bloodTypes.map((bloodType) => (
                                        <Card
                                            key={bloodType.type}
                                            variant="elevated"
                                            padding="lg"
                                            className={`cursor-pointer transition-all duration-300 group ${
                                                selectedBloodType === bloodType.type
                                                    ? 'ring-2 ring-red-500 shadow-2xl scale-105'
                                                    : 'hover:shadow-xl hover:scale-105'
                                            }`}
                                            onClick={() => setSelectedBloodType(
                                                selectedBloodType === bloodType.type ? null : bloodType.type
                                            )}
                                        >
                                            {/* Blood Type Icon */}
                                            <div className="text-center mb-6">
                                                <div className={`w-20 h-20 ${bloodType.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                    <span className="text-2xl font-bold text-white">{bloodType.type}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">{bloodType.name}</h3>
                                                <p className="text-sm text-gray-600">{bloodType.description}</p>
                                            </div>

                                            {/* Percentage */}
                                            <div className="text-center mb-4">
                                                <Badge
                                                    variant="success"
                                                    size="lg"
                                                    className="text-base font-semibold"
                                                >
                                                    {bloodType.percentage}% dân số
                                                </Badge>
                                            </div>

                                            {/* Rarity */}
                                            <div className="text-center mb-4">
                                                <Badge
                                                    variant={bloodType.percentage <= 2 ? 'destructive' : bloodType.percentage <= 10 ? 'warning' : 'success'}
                                                    size="sm"
                                                >
                                                    {bloodType.rarity}
                                                </Badge>
                                            </div>

                                            {/* Expanded Info */}
                                            {selectedBloodType === bloodType.type && (
                                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                                                    {/* Medical Information */}
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                            <Activity className="w-4 h-4 mr-2" />
                                                            Thông tin y học:
                                                        </h5>
                                                        <div className="space-y-2 text-sm">
                                                            <div><strong>Kháng thể:</strong> {bloodType.medicalInfo.antibodies}</div>
                                                            <div><strong>Kháng nguyên:</strong> {bloodType.medicalInfo.antigens}</div>
                                                            <div><strong>Bảo quản:</strong> {bloodType.medicalInfo.storage}</div>
                                                        </div>
                                                    </div>

                                                    {/* Clinical Uses */}
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 mb-2">Ứng dụng lâm sàng:</h5>
                                                        <div className="flex flex-wrap gap-1">
                                                            {bloodType.medicalInfo.uses.map((use, idx) => (
                                                                <Badge key={idx} variant="info" size="sm">
                                                                    {use}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Donation Tips */}
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 mb-2">Lời khuyên hiến máu:</h5>
                                                        <ul className="space-y-1">
                                                            {bloodType.donationTips.map((tip, idx) => (
                                                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                                    <CheckCircleIcon className="w-3 h-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                                                    {tip}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="p-3 bg-red-50 rounded-lg">
                                                        <p className="text-sm text-red-800 font-medium">
                                                            {bloodType.importance}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'compatibility' && (
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Ma trận tương thích miễn dịch
                                </h2>
                                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                                    Bảng tương thích dựa trên phản ứng kháng nguyên-kháng thể.
                                    Việc truyền máu không tương thích có thể gây phản ứng tan máu nghiêm trọng.
                                </p>
                            </div>

                            <Card variant="elevated" padding="lg">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-4 px-4 font-bold text-gray-900 text-lg">
                                                Người hiến
                                            </th>
                                            {bloodTypes.map((type) => (
                                                <th key={type.type} className="text-center py-4 px-3 font-bold text-gray-900">
                                                    <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mx-auto mb-1`}>
                                                        <span className="text-white font-bold text-sm">{type.type}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-600">{type.percentage}%</div>
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {bloodTypes.map((donorType) => (
                                            <tr key={donorType.type} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center">
                                                        <div className={`w-10 h-10 ${donorType.color} rounded-lg flex items-center justify-center mr-3`}>
                                                            <span className="text-white font-bold text-sm">{donorType.type}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-gray-900">{donorType.name}</span>
                                                            <div className="text-xs text-gray-500">{donorType.percentage}% dân số</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {bloodTypes.map((recipientType) => (
                                                    <td key={recipientType.type} className="text-center py-4 px-3">
                                                        {donorType.canDonateTo.includes(recipientType.type) ? (
                                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto group relative">
                                                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                    Tương thích
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 bg-red-100 rounded-full mx-auto flex items-center justify-center group relative">
                                                                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                                                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                    Không tương thích
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Tương thích - An toàn truyền máu</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-700 font-medium">Không tương thích - Nguy hiểm</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                                        <span className="text-gray-700 font-medium">Luôn kiểm tra chéo trước truyền</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Emergency Compatibility */}
                            <Card variant="outlined" padding="lg" className="bg-yellow-50 border-yellow-200">
                                <div className="flex items-start space-x-4">
                                    <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-bold text-yellow-800 mb-2">
                                            Nguyên tắc truyền máu cấp cứu
                                        </h3>
                                        <div className="text-yellow-700 space-y-2">
                                            <p><strong>O- (Universal Donor):</strong> Có thể hiến cho tất cả nhóm máu trong tình huống khẩn cấp</p>
                                            <p><strong>AB+ (Universal Recipient):</strong> Có thể nhận từ tất cả nhóm máu</p>
                                            <p><strong>Lưu ý:</strong> Trong cấp cứu, ưu tiên cứu sống hơn tương thích hoàn hảo</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'components' && (
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Thành phần máu và ứng dụng lâm sàng
                                </h2>
                                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                                    Máu toàn phần có thể được tách thành các thành phần riêng biệt,
                                    mỗi thành phần có ứng dụng điều trị cụ thể và điều kiện bảo quản khác nhau.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {bloodComponents.map((component, index) => (
                                    <Card key={index} variant="elevated" padding="lg" className="group hover:scale-105 transition-transform">
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-16 h-16 ${component.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                <Activity className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{component.name}</h3>
                                                <p className="text-gray-600 mb-4">{component.description}</p>

                                                <div className="space-y-3">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-1">Ứng dụng điều trị:</h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {component.uses.map((use, idx) => (
                                                                <Badge key={idx} variant="info" size="sm">
                                                                    {use}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-700">Bảo quản:</span>
                                                            <div className="text-gray-600">{component.storage}</div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-700">Thể tích:</span>
                                                            <div className="text-gray-600">{component.volume}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Blood Processing */}
                            <Card variant="outlined" padding="lg" className="bg-blue-50 border-blue-200">
                                <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                                    <Zap className="w-6 h-6 mr-2" />
                                    Quy trình xử lý máu hiện đại
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <span className="text-white font-bold">1</span>
                                        </div>
                                        <h4 className="font-semibold text-blue-900 mb-2">Thu thập</h4>
                                        <p className="text-blue-700 text-sm">Máu được thu thập trong túi chứa chất chống đông</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <span className="text-white font-bold">2</span>
                                        </div>
                                        <h4 className="font-semibold text-blue-900 mb-2">Tách thành phần</h4>
                                        <p className="text-blue-700 text-sm">Ly tâm để tách hồng cầu, plasma, tiểu cầu</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <span className="text-white font-bold">3</span>
                                        </div>
                                        <h4 className="font-semibold text-blue-900 mb-2">Bảo quản</h4>
                                        <p className="text-blue-700 text-sm">Mỗi thành phần được bảo quản ở điều kiện tối ưu</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'requirements' && (
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Tiêu chuẩn y tế hiến máu an toàn
                                </h2>
                                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                                    Các tiêu chuẩn được thiết lập để đảm bảo an toàn cho cả người hiến và người nhận máu,
                                    tuân thủ theo hướng dẫn của Tổ chức Y tế Thế giới (WHO).
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {donationRequirements.map((req, index) => (
                                    <Card key={index} variant="elevated" padding="lg" className="group hover:scale-105 transition-transform">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <req.icon className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">{req.category}</h3>
                                                <ul className="space-y-2">
                                                    {req.requirements.map((requirement, idx) => (
                                                        <li key={idx} className="flex items-start">
                                                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-700">{requirement}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Medical Screening */}
                            <Card variant="outlined" padding="lg" className="bg-green-50 border-green-200">
                                <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center">
                                    <Shield className="w-6 h-6 mr-2" />
                                    Quy trình sàng lọc y tế
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-green-900 mb-3">Khám sàng lọc:</h4>
                                        <ul className="space-y-2 text-green-700">
                                            <li>• Đo huyết áp, mạch, nhiệt độ</li>
                                            <li>• Kiểm tra hemoglobin</li>
                                            <li>• Hỏi tiền sử bệnh</li>
                                            <li>• Đánh giá tình trạng sức khỏe</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-green-900 mb-3">Xét nghiệm máu:</h4>
                                        <ul className="space-y-2 text-green-700">
                                            <li>• HIV, HBV, HCV</li>
                                            <li>• Giang mai (Syphilis)</li>
                                            <li>• Nhóm máu ABO-Rh</li>
                                            <li>• Kháng thể bất thường</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>

                            {/* Contraindications */}
                            <Card variant="outlined" padding="lg" className="bg-red-50 border-red-200">
                                <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center">
                                    <AlertCircle className="w-6 h-6 mr-2" />
                                    Chống chỉ định hiến máu
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-red-900 mb-3">Chống chỉ định tuyệt đối:</h4>
                                        <ul className="space-y-2 text-red-700">
                                            <li>• Nhiễm HIV, HBV, HCV</li>
                                            <li>• Bệnh tim mạch nghiêm trọng</li>
                                            <li>• Ung thư đang điều trị</li>
                                            <li>• Rối loạn đông máu</li>
                                            <li>• Sử dụng ma túy</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-red-900 mb-3">Chống chỉ định tạm thời:</h4>
                                        <ul className="space-y-2 text-red-700">
                                            <li>• Cảm cúm, sốt</li>
                                            <li>• Uống thuốc kháng sinh</li>
                                            <li>• Phẫu thuật gần đây</li>
                                            <li>• Có thai, cho con bú</li>
                                            <li>• Tiêm vaccine gần đây</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'guide' && (
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Hướng dẫn hiến máu chuyên nghiệp
                                </h2>
                                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                                    Quy trình hiến máu chuẩn quốc tế đảm bảo an toàn tối đa cho người hiến
                                    và chất lượng máu tối ưu cho người nhận.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card variant="elevated" padding="lg">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                        Chuẩn bị trước hiến máu (24-48h)
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Ngủ đủ giấc 7-8 tiếng/đêm',
                                            'Uống nhiều nước (2-3 lít/ngày)',
                                            'Ăn thực phẩm giàu sắt (thịt đỏ, rau xanh)',
                                            'Tránh rượu bia 24h trước',
                                            'Không hút thuốc 2h trước',
                                            'Mang theo CMND/CCCD',
                                            'Thông báo thuốc đang sử dụng',
                                            'Ăn sáng nhẹ nhàng'
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                <Card variant="elevated" padding="lg">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <Activity className="w-5 h-5 mr-2 text-red-600" />
                                        Sau khi hiến máu (24-48h)
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Nghỉ ngơi 10-15 phút tại chỗ',
                                            'Uống nhiều nước (3-4 lít/ngày)',
                                            'Ăn đầy đủ các bữa trong ngày',
                                            'Tránh vận động mạnh 24h',
                                            'Không nâng vật nặng >5kg',
                                            'Giữ băng gạc khô ráo 4-6h',
                                            'Bổ sung thực phẩm giàu sắt',
                                            'Liên hệ y tế nếu có triệu chứng bất thường'
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </div>

                            {/* Emergency Contact */}
                            <Card variant="outlined" padding="lg" className="bg-yellow-50 border-yellow-200">
                                <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center">
                                    <Phone className="w-5 h-5 mr-2" />
                                    Liên hệ khẩn cấp sau hiến máu
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-yellow-900 mb-2">Triệu chứng cần chú ý:</h4>
                                        <ul className="space-y-1 text-yellow-700">
                                            <li>• Chảy máu không ngừng tại vị trí chích</li>
                                            <li>• Choáng váng, ngất xỉu</li>
                                            <li>• Buồn nôn, nôn mửa</li>
                                            <li>• Đau ngực, khó thở</li>
                                            <li>• Sốt cao &gt;38°C</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-yellow-900 mb-2">Hotline hỗ trợ 24/7:</h4>
                                        <div className="space-y-2 text-yellow-700">
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                <span className="font-semibold">115</span> - Cấp cứu
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                <span className="font-semibold">1900-1234</span> - Tư vấn hiến máu
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span>Trung tâm Huyết học gần nhất</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-red-600 to-red-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Trở thành người hùng cứu người
                    </h2>
                    <p className="text-xl text-red-100 mb-8">
                        Mỗi lần hiến máu có thể cứu sống tới 3 người. Với kiến thức chuyên môn,
                        bạn có thể hiến máu an toàn và hiệu quả nhất.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="secondary"
                            size="lg"
                            leftIcon={<HeartSolidIcon className="w-5 h-5" />}
                            rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                            className="bg-white text-red-600 hover:bg-red-50"
                        >
                            Đăng ký hiến máu ngay
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            leftIcon={<Share2 className="w-5 h-5" />}
                            className="border-white text-white hover:bg-white hover:text-red-600"
                        >
                            Chia sẻ kiến thức
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BloodTypesPage;