import React from 'react';
import { useAchievements } from '../hooks/useAchievements';
import type { Achievement } from '../types/achievement-manage.types';

const AchievementsManage: React.FC = () => {
  const { achievements, loading, error, refetch } = useAchievements();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const getAchievementTypeColor = (achievementName: string) => {
    const name = achievementName.toLowerCase();
    if (name.includes('blood') || name.includes('máu')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (name.includes('donation') || name.includes('hiến')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (name.includes('volunteer') || name.includes('tình nguyện')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thành tựu</h1>
          <p className="text-gray-600 mt-1">
            Tổng cộng: <span className="font-semibold text-red-600">{achievements.length}</span> thành tựu
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement: Achievement, index: number) => (
          <div
            key={`${achievement.achievementName}-${index}`}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Achievement Header */}
            <div className="p-4 border-b border-gray-100">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getAchievementTypeColor(achievement.achievementName)}`}>
                {achievement.achievementName}
              </div>
            </div>

            {/* Achievement Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {achievement.achievementName}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {achievement.description}
              </p>

              {/* Value Range */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Giá trị:</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      Min: {formatNumber(achievement.minValue)}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Max: {formatNumber(achievement.maxValue)}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar Visual */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatNumber(achievement.minValue)}</span>
                    <span>{formatNumber(achievement.maxValue)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-blue-600 font-semibold">
                    {formatNumber(achievement.maxValue - achievement.minValue)}
                  </div>
                  <div className="text-blue-500 text-xs">Khoảng cách</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-green-600 font-semibold">
                    {achievement.maxValue > 0 ? Math.round((achievement.minValue / achievement.maxValue) * 100) : 0}%
                  </div>
                  <div className="text-green-500 text-xs">Tỷ lệ Min/Max</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {achievements.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có thành tựu nào</h3>
          <p className="mt-2 text-gray-500">Hiện tại chưa có thành tựu nào được tạo trong hệ thống.</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsManage;
