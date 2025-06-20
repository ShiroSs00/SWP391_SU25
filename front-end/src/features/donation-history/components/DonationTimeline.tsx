import React from 'react';
import { Calendar, Droplets, MapPin, Clock } from 'lucide-react';
import { DonationHistoryItem } from '../types/history.types';
import { formatDate, formatRelativeTime } from '../../../utils/helpers';

interface DonationTimelineProps {
  donations: DonationHistoryItem[];
}

const componentLabels = {
  whole_blood: 'Máu toàn phần',
  red_cells: 'Hồng cầu',
  plasma: 'Huyết tương',
  platelets: 'Tiểu cầu'
};

const DonationTimeline: React.FC<DonationTimelineProps> = ({ donations }) => {
  const sortedDonations = [...donations].sort(
    (a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Lịch sử hiến máu
        </h2>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {sortedDonations.map((donation, index) => (
            <div key={donation.id} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-4 border-red-600 rounded-full">
                <Droplets className="w-5 h-5 text-red-600" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {componentLabels[donation.component]} - {donation.bloodType}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {donation.unitsCollected} đơn vị
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(donation.donationDate)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(donation.donationDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{donation.location.name}</span>
                    </div>
                  </div>

                  {donation.notes && (
                    <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-400">
                      <p className="text-sm text-gray-700 italic">
                        {donation.notes}
                      </p>
                    </div>
                  )}

                  {/* Health metrics summary */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>BP: {donation.healthMetrics.bloodPressure.systolic}/{donation.healthMetrics.bloodPressure.diastolic}</span>
                    <span>HR: {donation.healthMetrics.heartRate}</span>
                    <span>Hb: {donation.healthMetrics.hemoglobin}</span>
                    <span>Cân nặng: {donation.healthMetrics.weight}kg</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedDonations.length === 0 && (
          <div className="text-center py-8">
            <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có lịch sử hiến máu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationTimeline;