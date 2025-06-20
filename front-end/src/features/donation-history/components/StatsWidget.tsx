import React from 'react';
import { Heart, Droplets, Calendar, Award } from 'lucide-react';
import { DonationStats } from '../types/history.types';
import { formatDate } from '../../../utils/helpers';

interface StatsWidgetProps {
  stats: DonationStats;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Donations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng lần hiến</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalUnits} đơn vị máu
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <Droplets className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Lives Saved */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Sinh mệnh cứu sống</p>
            <p className="text-2xl font-bold text-gray-900">{stats.lifeSaved}</p>
            <p className="text-xs text-gray-500 mt-1">
              Ước tính từ lượng máu hiến
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Heart className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Chuỗi ngày</p>
            <p className="text-2xl font-bold text-gray-900">{stats.streakDays}</p>
            <p className="text-xs text-gray-500 mt-1">
              Ngày kể từ lần hiến đầu
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Thành tích</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.achievements.badges.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Huy hiệu đạt được
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Next Eligible Date */}
      {stats.nextEligibleDate && (
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lần hiến tiếp theo</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(stats.nextEligibleDate)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Bạn có thể hiến máu trở lại
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Favorite Location */}
      {stats.favoriteLocation && (
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <div>
            <p className="text-sm font-medium text-gray-600">Địa điểm yêu thích</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {stats.favoriteLocation}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Nơi bạn hiến máu nhiều nhất
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsWidget;