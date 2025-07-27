import React from 'react';
import { Coins, Zap } from 'lucide-react';
import PointsBreakdown from '../components/PointsBreakdown';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { PointsData } from '../types/dashboard.type';

interface PointsPageProps {
  pointsData: PointsData | null;
  loading: boolean;
  error: string | null;
  onRedeem: (rewardId: string) => Promise<void>;
  onRetry: () => void;
}

const PointsPage: React.FC<PointsPageProps> = ({
  pointsData,
  loading,
  error,
  onRedeem,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!pointsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorMessage message="Không thể tải dữ liệu điểm thưởng" onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
          <Coins className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Điểm thưởng</h1>
          <p className="text-gray-600">Tích lũy điểm và đổi những phần thưởng hấp dẫn</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold text-purple-800">
                Bạn có {pointsData.totalPoints.toLocaleString()} điểm
              </h3>
              <p className="text-purple-600 text-sm">
                {pointsData.availableRewards.filter(r => pointsData.totalPoints >= r.cost).length} phần thưởng có thể đổi
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {pointsData.breakdown.length}
            </div>
            <div className="text-sm text-purple-500">hoạt động tích điểm</div>
          </div>
        </div>
      </div>

      <PointsBreakdown pointsData={pointsData} onRedeem={onRedeem} />
    </div>
  );
};

export default PointsPage;