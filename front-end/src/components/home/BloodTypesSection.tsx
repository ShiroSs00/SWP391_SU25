import React, { useState } from 'react';
import { 
  HeartIcon, 
  UserGroupIcon, 
  InformationCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Card from '../ui/card/Card';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';

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
        importance: 'Cực kỳ quan trọng - Có thể hiến cho tất cả nhóm máu'
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
        importance: 'Rất quan trọng - Nhu cầu cao nhất'
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
        importance: 'Quan trọng cho nhóm A và AB'
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
        importance: 'Quan trọng cho điều trị thường quy'
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
        importance: 'Cần thiết cho nhóm B và AB'
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
        importance: 'Quan trọng cho cộng đồng B+'
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
        importance: 'Vô cùng quý giá - Chỉ 1% dân số'
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
        importance: 'Có thể nhận từ tất cả nhóm máu'
    }
];

export function BloodTypesSection() {
    const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20 animate-slide-up">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blood-100 text-blood-700 text-sm font-medium mb-6">
                        <HeartSolidIcon className="w-4 h-4 mr-2" />
                        Kiến thức về máu
                    </div>
                    
                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark-900 mb-6">
                        Thông tin các
                        <span className="block bg-gradient-to-r from-blood-600 to-blood-800 bg-clip-text text-transparent">
                            nhóm máu
                        </span>
                    </h2>
                    
                    <p className="text-xl text-dark-600 max-w-3xl mx-auto leading-relaxed">
                        Hiểu rõ về nhóm máu của bạn và khả năng tương thích để có thể hiến máu hiệu quả nhất, 
                        cứu sống nhiều người hơn.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <Card variant="gradient" padding="lg" className="text-center">
                        <div className="w-12 h-12 bg-blood-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <HeartSolidIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-blood-800 mb-1">8</div>
                        <div className="text-sm text-blood-700">Nhóm máu chính</div>
                    </Card>

                    <Card variant="gradient" padding="lg" className="text-center">
                        <div className="w-12 h-12 bg-life-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <UserGroupIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-life-800 mb-1">O-</div>
                        <div className="text-sm text-life-700">Hiến máu vạn năng</div>
                    </Card>

                    <Card variant="gradient" padding="lg" className="text-center">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-purple-800 mb-1">AB+</div>
                        <div className="text-sm text-purple-700">Nhận máu vạn năng</div>
                    </Card>

                    <Card variant="gradient" padding="lg" className="text-center">
                        <div className="w-12 h-12 bg-emergency-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <InformationCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-emergency-800 mb-1">1%</div>
                        <div className="text-sm text-emergency-700">AB- hiếm nhất</div>
                    </Card>
                </div>

                {/* Blood Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {bloodTypes.map((bloodType, index) => (
                        <Card
                            key={bloodType.type}
                            variant="default"
                            padding="lg"
                            hover
                            glow={selectedBloodType === bloodType.type}
                            className={`cursor-pointer transition-all duration-300 group animate-slide-up ${
                                selectedBloodType === bloodType.type 
                                  ? 'ring-2 ring-blood-500 shadow-blood-lg' 
                                  : ''
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => setSelectedBloodType(
                                selectedBloodType === bloodType.type ? null : bloodType.type
                            )}
                        >
                            {/* Blood Type Icon */}
                            <div className="text-center mb-6">
                                <div className={`w-20 h-20 ${bloodType.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <span className="text-2xl font-bold text-white">{bloodType.type}</span>
                                </div>
                                <h3 className="text-lg font-bold text-dark-900 mb-1">{bloodType.name}</h3>
                                <p className="text-sm text-dark-600">{bloodType.description}</p>
                            </div>

                            {/* Percentage */}
                            <div className="text-center mb-4">
                                <Badge 
                                    variant="primary" 
                                    size="lg" 
                                    rounded
                                    className="text-base font-semibold"
                                >
                                    {bloodType.percentage}% dân số
                                </Badge>
                            </div>

                            {/* Rarity */}
                            <div className="text-center mb-4">
                                <Badge 
                                    variant={bloodType.percentage <= 2 ? 'danger' : bloodType.percentage <= 10 ? 'warning' : 'success'}
                                    size="sm"
                                >
                                    {bloodType.rarity}
                                </Badge>
                            </div>

                            {/* Expanded Info */}
                            {selectedBloodType === bloodType.type && (
                                <div className="mt-6 pt-6 border-t border-dark-200 animate-slide-down">
                                    <div className="space-y-4">
                                        <div>
                                            <h5 className="font-semibold text-dark-900 mb-2">Có thể hiến cho:</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {bloodType.canDonateTo.map((type) => (
                                                    <Badge key={type} variant="success" size="sm">
                                                        {type}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h5 className="font-semibold text-dark-900 mb-2">Có thể nhận từ:</h5>
                                            <div className="flex flex-wrap gap-1">
                                                {bloodType.canReceiveFrom.map((type) => (
                                                    <Badge key={type} variant="info" size="sm">
                                                        {type}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-3 bg-blood-50 rounded-lg">
                                            <p className="text-sm text-blood-800 font-medium">
                                                {bloodType.importance}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Compatibility Matrix */}
                <Card variant="outlined" padding="xl" className="mb-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-dark-900 mb-4">
                            Ma trận tương thích hiến máu
                        </h3>
                        <p className="text-dark-600">
                            Bảng tương thích giữa người hiến máu và người nhận máu
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-200">
                                    <th className="text-left py-3 px-4 font-semibold text-dark-900">
                                        Người hiến
                                    </th>
                                    {bloodTypes.map((type) => (
                                        <th key={type.type} className="text-center py-3 px-2 font-semibold text-dark-900">
                                            {type.type}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {bloodTypes.map((donorType) => (
                                    <tr key={donorType.type} className="border-b border-dark-100 hover:bg-dark-50">
                                        <td className="py-3 px-4 font-semibold text-dark-900">
                                            {donorType.type}
                                        </td>
                                        {bloodTypes.map((recipientType) => (
                                            <td key={recipientType.type} className="text-center py-3 px-2">
                                                {donorType.canDonateTo.includes(recipientType.type) ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-life-500 mx-auto" />
                                                ) : (
                                                    <div className="w-6 h-6 bg-dark-200 rounded-full mx-auto"></div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="w-5 h-5 text-life-500" />
                            <span className="text-dark-600">Có thể hiến</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-dark-200 rounded-full"></div>
                            <span className="text-dark-600">Không thể hiến</span>
                        </div>
                    </div>
                </Card>

                {/* CTA Section */}
                <div className="text-center animate-slide-up">
                    <Card variant="gradient" padding="xl" className="bg-gradient-to-r from-blood-600 to-blood-800 text-white">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-3xl font-bold mb-4">
                                Tìm hiểu nhóm máu của bạn
                            </h3>
                            <p className="text-xl text-blood-100 mb-8">
                                Biết nhóm máu của mình giúp bạn hiến máu hiệu quả hơn và có thể cứu sống nhiều người hơn. 
                                Hãy đăng ký xét nghiệm miễn phí ngay hôm nay!
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    leftIcon={<HeartSolidIcon className="w-5 h-5" />}
                                    rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                                    className="bg-white text-blood-600 hover:bg-blood-50"
                                >
                                    Xét nghiệm nhóm máu
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-blood-600"
                                >
                                    Tải hướng dẫn chi tiết
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

export default BloodTypesSection;