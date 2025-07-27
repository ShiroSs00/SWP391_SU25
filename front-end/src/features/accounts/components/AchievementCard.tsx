import React from 'react';
import { Award, Star, Calendar, Heart, Trophy, Medal, Droplet, Users } from 'lucide-react';
import type { Achievement } from '../types/dashboard.type';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return Heart;
      case 'Award':
        return Award;
      case 'Calendar':
        return Calendar;
      case 'Star':
        return Star;
      case 'Trophy':
        return Trophy;
      case 'Medal':
        return Medal;
      case 'Droplet':
        return Droplet;
      case 'Users':
        return Users;
      default:
        return Award;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'from-amber-600 to-amber-800';
      case 'Silver':
        return 'from-gray-400 to-gray-600';
      case 'Gold':
        return 'from-yellow-400 to-yellow-600';
      case 'Platinum':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getTierBg = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-amber-50 border-amber-200';
      case 'Silver':
        return 'bg-gray-50 border-gray-200';
      case 'Gold':
        return 'bg-yellow-50 border-yellow-200';
      case 'Platinum':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTierTextColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'text-amber-800';
      case 'Silver':
        return 'text-gray-800';
      case 'Gold':
        return 'text-yellow-800';
      case 'Platinum':
        return 'text-purple-800';
      default:
        return 'text-gray-800';
    }
  };

  const Icon = getIcon(achievement.icon);
  const progressPercentage = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);

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

  return (
    <div className={`relative border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
      achievement.isUnlocked 
        ? `${getTierBg(achievement.tier)} hover:scale-105 shadow-md` 
        : 'bg-gray-50 border-gray-200 opacity-75 hover:opacity-90'
    }`}>
      {/* Tier Badge */}
      <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-r ${getTierColor(achievement.tier)} flex items-center justify-center shadow-lg`}>
        <Trophy className="w-5 h-5 text-white" />
      </div>

      {/* Achievement Icon */}
      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getTierColor(achievement.tier)} flex items-center justify-center mb-4 mx-auto shadow-lg`}>
        <Icon className="w-10 h-10 text-white" />
      </div>

      {/* Achievement Info */}
      <div className="text-center">
        <h3 className={`text-lg font-bold mb-2 ${achievement.isUnlocked ? getTierTextColor(achievement.tier) : 'text-gray-600'}`}>
          {achievement.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{achievement.description}</p>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Tiến độ</span>
            <span className="font-medium">
              {achievement.progress}/{achievement.maxProgress}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getTierColor(achievement.tier)} transition-all duration-700 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            >
              {achievement.isUnlocked && (
                <div className="h-full bg-white bg-opacity-30 animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {progressPercentage.toFixed(0)}% hoàn thành
          </div>
        </div>

        {/* Tier Display */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${getTierBg(achievement.tier)} ${getTierTextColor(achievement.tier)}`}>
            <Medal className="w-3 h-3 mr-1" />
            {achievement.tier}
          </span>
        </div>

        {/* Status */}
        {achievement.isUnlocked ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Đã mở khóa</span>
            </div>
            {achievement.dateUnlocked && (
              <div className="text-xs text-gray-500">
                {formatDate(achievement.dateUnlocked)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">
            <span className="text-sm">
              Còn {achievement.maxProgress - achievement.progress} để hoàn thành
            </span>
          </div>
        )}
      </div>

      {/* Unlock Effect */}
      {achievement.isUnlocked && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse pointer-events-none"></div>
      )}

      {/* Glow Effect for Unlocked Achievements */}
      {achievement.isUnlocked && (
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${getTierColor(achievement.tier)} opacity-10 blur-sm -z-10`}></div>
      )}
    </div>
  );
};

export default AchievementCard;