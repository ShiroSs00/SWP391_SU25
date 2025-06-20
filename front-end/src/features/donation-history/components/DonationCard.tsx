import React from 'react';
import { Calendar, MapPin, User, Activity, FileText } from 'lucide-react';
import { DonationHistoryItem } from '../types/history.types';
import { formatDate, cn } from '../../../utils/helpers';

interface DonationCardProps {
  donation: DonationHistoryItem;
  onClick?: () => void;
}

const statusLabels = {
  completed: 'Hoàn thành',
  incomplete: 'Chưa hoàn thành',
  adverse_reaction: 'Phản ứng phụ',
  cancelled: 'Đã hủy'
};

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  incomplete: 'bg-yellow-100 text-yellow-800',
  adverse_reaction: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const componentLabels = {
  whole_blood: 'Máu toàn phần',
  red_cells: 'Hồng cầu',
  plasma: 'Huyết tương',
  platelets: 'Tiểu cầu'
};

const DonationCard: React.FC<DonationCardProps> = ({ donation, onClick }) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md p-6 border border-gray-200 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:border-red-300"
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Hiến {componentLabels[donation.component]}
            </h3>
            <p className="text-sm text-gray-600">
              {donation.unitsCollected} đơn vị • Nhóm máu {donation.bloodType}
            </p>
          </div>
        </div>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          statusColors[donation.status]
        )}>
          {statusLabels[donation.status]}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(donation.donationDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{donation.location.name}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Nhân viên: {donation.staffName}</span>
        </div>

        {/* Health Metrics */}
        <div className="bg-gray-50 rounded-lg p-3 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Chỉ số sức khỏe</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">Cân nặng:</span>
              <span className="ml-1 font-medium">{donation.healthMetrics.weight} kg</span>
            </div>
            <div>
              <span className="text-gray-500">Huyết áp:</span>
              <span className="ml-1 font-medium">
                {donation.healthMetrics.bloodPressure.systolic}/{donation.healthMetrics.bloodPressure.diastolic}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Nhịp tim:</span>
              <span className="ml-1 font-medium">{donation.healthMetrics.heartRate} bpm</span>
            </div>
            <div>
              <span className="text-gray-500">Hemoglobin:</span>
              <span className="ml-1 font-medium">{donation.healthMetrics.hemoglobin} g/dL</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {donation.notes && (
          <div className="flex items-start gap-2 text-sm">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
            <p className="text-gray-600 italic">{donation.notes}</p>
          </div>
        )}

        {/* Next Eligible Date */}
        <div className="bg-blue-50 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Có thể hiến lại:</span> {formatDate(donation.nextEligibleDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;