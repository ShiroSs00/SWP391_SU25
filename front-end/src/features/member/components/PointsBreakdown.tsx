import React, { useState } from 'react';
import { Coins, Gift, Calendar, TrendingUp, Star, Award, Zap } from 'lucide-react';
import type { PointsData } from '../types/dashboard.type';

interface PointsBreakdownProps {
  pointsData: PointsData;
  onRedeem: (rewardId: string) => void;
}

const PointsBreakdown: React.FC<PointsBreakdownProps> = ({ pointsData, onRedeem }) => {
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  const handleRedeem = async (rewardId: string) => {
    setIsRedeeming(rewardId);
    try {
      await onRedeem(rewardId);
    } catch (error) {
      console.error('Error redeeming reward:', error);
    } finally {
      setIsRedeeming(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getSourceIcon = (source: string) => {
    if (source.includes('Hiến máu')) return <Star className="w-4 h-4 text-red-500" />;
    if (source.includes('Thành tích')) return <Award className="w-4 h-4 text-yellow-500" />;
    if (source.includes('Sự kiện')) return <Calendar className="w-4 h-4 text-blue-500" />;
    return <Zap className="w-4 h-4 text-purple-500" />;
  };

  const getRewardIcon = (title: string) => {
    if (title.includes('Voucher')) return '🏥';
    if (title.includes('Áo')) return '👕';
    if (title.includes('Cốc')) return '☕';
    if (title.includes('Túi')) return '👜';
    return '🎁';
  };

  return (
    <div className="space-y-6">
      {/* Total Points Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Tổng điểm thưởng</h2>
              <p className="text-red-100">Điểm tích lũy từ các hoạt động hiến máu</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">{pointsData.totalPoints.toLocaleString()}</div>
              <div className="flex items-center justify-end space-x-1 text-red-100">
                <Coins className="w-5 h-5" />
                <span className="text-lg">điểm</span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">{pointsData.breakdown.length}</div>
              <div className="text-sm text-red-100">Hoạt động tích điểm</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-2xl font-bold">{pointsData.availableRewards.length}</div>
              <div className="text-sm text-red-100">Phần thưởng có thể đổi</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">Lịch sử tích điểm</h3>
          </div>

          {pointsData.breakdown.length === 0 ? (
            <div className="text-center py-8">
              <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có hoạt động tích điểm</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pointsData.breakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getSourceIcon(item.source)}
                    <div>
                      <p className="font-medium text-gray-800">{item.source}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">+{item.points}</span>
                    <p className="text-xs text-gray-500">điểm</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Gift className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-800">Phần thưởng có thể đổi</h3>
          </div>

          {pointsData.availableRewards.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có phần thưởng</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pointsData.availableRewards.map((reward) => {
                const canAfford = pointsData.totalPoints >= reward.cost;
                const isCurrentlyRedeeming = isRedeeming === reward.id;
                
                return (
                  <div key={reward.id} className={`border rounded-lg p-4 transition-all ${
                    canAfford ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="text-2xl">{getRewardIcon(reward.title)}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{reward.title}</h4>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{reward.description}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-lg font-bold ${canAfford ? 'text-purple-600' : 'text-gray-500'}`}>
                          {reward.cost.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">điểm</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            canAfford ? 'bg-purple-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min((pointsData.totalPoints / reward.cost) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {canAfford ? 'Đủ điểm để đổi' : `Còn thiếu ${(reward.cost - pointsData.totalPoints).toLocaleString()} điểm`}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRedeem(reward.id)}
                      disabled={!canAfford || isCurrentlyRedeeming}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        canAfford && !isCurrentlyRedeeming
                          ? 'bg-purple-500 text-white hover:bg-purple-600 transform hover:scale-105'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isCurrentlyRedeeming ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Đang đổi...</span>
                        </div>
                      ) : canAfford ? (
                        'Đổi thưởng ngay'
                      ) : (
                        'Không đủ điểm'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Mẹo tích điểm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
            <span className="text-blue-700">Hiến máu định kỳ để tích điểm ổn định</span>
          </div>
          <div className="flex items-start space-x-2">
            <Award className="w-4 h-4 text-purple-500 mt-0.5" />
            <span className="text-blue-700">Hoàn thành thành tích để nhận điểm thưởng</span>
          </div>
          <div className="flex items-start space-x-2">
            <Calendar className="w-4 h-4 text-green-500 mt-0.5" />
            <span className="text-blue-700">Tham gia sự kiện đặc biệt có điểm cao hơn</span>
          </div>
          <div className="flex items-start space-x-2">
            <Gift className="w-4 h-4 text-red-500 mt-0.5" />
            <span className="text-blue-700">Theo dõi phần thưởng mới được cập nhật</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsBreakdown;