// components/ProfileCard.tsx
import React from 'react';
import { User, Mail, Phone, Calendar, MapPin, Droplet, Award, Heart } from 'lucide-react';
import type {UserProfile} from "../../types/types.ts";

interface ProfileCardProps {
    profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
    const getRoleDisplay = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Quản trị viên';
            case 'staff':
                return 'Nhân viên';
            default:
                return 'Người hiến máu';
        }
    };

    const getAchievementLevel = (score: number) => {
        if (score >= 80) return { level: 'Xuất sắc', color: 'text-yellow-600 bg-yellow-100' };
        if (score >= 60) return { level: 'Giỏi', color: 'text-green-600 bg-green-100' };
        if (score >= 40) return { level: 'Khá', color: 'text-blue-600 bg-blue-100' };
        return { level: 'Cần cải thiện', color: 'text-gray-600 bg-gray-100' };
    };

    const achievement = getAchievementLevel(profile.achievement || 0);

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6">
                <h1 className="text-3xl font-bold text-white text-center">Hồ Sơ Người Hiến Máu</h1>
            </div>

            <div className="p-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <User className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
                    <p className="text-gray-500 mb-2">@{profile.name}</p>
                    <div className="px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                        {getRoleDisplay(profile.role)}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl text-center">
                        <Droplet className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">{profile.numberOfBloodDonation}</div>
                        <div className="text-sm text-red-500">Lần hiến máu</div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl text-center">
                        <div className="text-3xl font-bold text-pink-600 mb-1">{profile.bloodCode}</div>
                        <div className="text-sm text-pink-500">Nhóm máu</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl text-center">
                        <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-lg font-bold text-yellow-600">{profile.achievement}</div>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${achievement.color} inline-block`}>
                            {achievement.level}
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Email</div>
                                <div className="font-medium text-gray-800">{profile.email}</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Phone className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Số điện thoại</div>
                                <div className="font-medium text-gray-800">{profile.phone}</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Ngày sinh</div>
                                <div className="font-medium text-gray-800">{new Date(profile.dob).toLocaleDateString('vi-VN')}</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <User className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Giới tính</div>
                                <div className="font-medium text-gray-800">{profile.gender ? 'Nam' : 'Nữ'}</div>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 md:col-span-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                                <MapPin className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Địa chỉ</div>
                                <div className="font-medium text-gray-800">
                                    {`${profile.address.street}, ${profile.address.ward ? profile.address.ward + ', ' : ''}${profile.address.district}, ${profile.address.city}, ${profile.address.province}`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;