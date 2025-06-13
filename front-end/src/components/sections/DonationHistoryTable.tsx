// components/DonationHistoryTable.tsx
import React, { useState } from 'react';
import { Calendar, MapPin, Droplet, User, CheckCircle, Clock, XCircle, Activity } from 'lucide-react';
import type { BloodDonationHistory, BloodComponent, DonationStatus } from '../../types/types.ts';

interface DonationHistoryTableProps {
    donations: BloodDonationHistory[];
}

const DonationHistoryTable: React.FC<DonationHistoryTableProps> = ({ donations }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(donations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentDonations = donations.slice(startIndex, startIndex + itemsPerPage);

    const getStatusIcon = (status: DonationStatus) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'scheduled':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
    };

    const getStatusStyle = (status: DonationStatus) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    const getStatusText = (status: DonationStatus) => {
        switch (status) {
            case 'completed':
                return 'Hoàn thành';
            case 'scheduled':
                return 'Đã lên lịch';
            case 'cancelled':
                return 'Đã hủy bỏ';
            default:
                return 'Hoàn thành';
        }
    };

    const getComponentText = (component: BloodComponent) => {
        switch (component) {
            case 'whole_blood':
                return 'Máu toàn phần';
            case 'red_blood_cells':
                return 'Hồng cầu';
            case 'plasma':
                return 'Huyết tương';
            case 'platelets':
                return 'Tiểu cầu';
            default:
                return 'Máu toàn phần';
        }
    };

    const getHealthStatusStyle = (healthStatus: string) => {
        const status = healthStatus.toLowerCase();
        if (status.includes('tốt') || status.includes('good') || status.includes('healthy')) {
            return 'bg-green-100 text-green-800 border-green-200';
        } else if (status.includes('bình thường') || status.includes('normal')) {
            return 'bg-blue-100 text-blue-800 border-blue-200';
        } else {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Lịch Sử Hiến Máu</h2>
                    <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                        <span className="text-white font-medium">Tổng: {donations.length} lần</span>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            STT
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Nhóm máu
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Thành phần
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Ngày tạo
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Địa điểm
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Thể tích (ml)
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Tình trạng sức khỏe
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Trạng thái
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Mã sự kiện
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentDonations.map((donation, index) => (
                        <tr key={donation.historyId} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                                    <span className="text-sm font-medium text-red-600">
                                        {startIndex + index + 1}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                        <Droplet className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-lg font-bold text-red-600">{donation.bloodType}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900 font-medium">
                                    {getComponentText(donation.component)}
                                </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-900">
                                        {new Date(donation.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-start space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <span className="text-sm text-gray-900 leading-tight">
                                        {donation.locationDonated}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-center">
                                    <span className="text-lg font-semibold text-gray-900">{donation.bloodVolume}</span>
                                    <span className="text-sm text-gray-500 ml-1">ml</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getHealthStatusStyle(donation.healthStatus)}`}>
                                    <Activity className="h-4 w-4" />
                                    <span>{donation.healthStatus}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(donation.status)}`}>
                                    {getStatusIcon(donation.status)}
                                    <span>{getStatusText(donation.status)}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {donation.eventId || 'Không có'}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
                            <span className="font-medium">
                                {Math.min(startIndex + itemsPerPage, donations.length)}
                            </span>{' '}
                            trong tổng số <span className="font-medium">{donations.length}</span> bản ghi
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Trước
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            currentPage === page
                                                ? 'bg-red-500 text-white'
                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {donations.length === 0 && (
                <div className="text-center py-12">
                    <Droplet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử hiến máu</h3>
                    <p className="text-gray-500">Bạn chưa thực hiện lần hiến máu nào.</p>
                </div>
            )}
        </div>
    );
};

export default DonationHistoryTable;