import React from 'react';
import { Award, Trophy } from 'lucide-react';
import AchievementCard from '../components/AchievementCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Achievement } from '../types/dashboard.type';

interface AchievementsPageProps {
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  loading,
  error,
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

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Thành tích</h1>
          <p className="text-gray-600">Khám phá và mở khóa các thành tích đặc biệt</p>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Đã mở khóa</p>
              <p className="text-3xl font-bold">{unlockedAchievements.length}</p>
            </div>
            <Trophy className="w-12 h-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Đang tiến hành</p>
              <p className="text-3xl font-bold">{lockedAchievements.length}</p>
            </div>
            <Award className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Tổng thành tích</p>
              <p className="text-3xl font-bold">{achievements.length}</p>
            </div>
            <Trophy className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Chưa có thành tích nào</p>
          <p className="text-gray-400 text-sm mt-2">
            Hãy tham gia hiến máu để mở khóa thành tích đầu tiên!
          </p>
        </div>
      ) : (
        <>
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Thành tích đã mở khóa ({unlockedAchievements.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unlockedAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Award className="w-5 h-5 mr-2 text-gray-500" />
                Thành tích đang tiến hành ({lockedAchievements.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AchievementsPage;