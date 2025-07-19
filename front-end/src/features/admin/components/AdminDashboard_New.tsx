import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import DashboardCharts from './DashboardCharts';

const AdminDashboard: React.FC = () => {
  const { stats, loading } = useDashboard();

  if (loading) {
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#b71c1c] mb-6 text-center">Tổng quan hệ thống</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </section>
    );
  }

  const dashboardItems = [
    { 
      label: 'Tổng túi máu', 
      value: stats.totalBloodBags, 
      icon: '🩸', 
      color: 'bg-red-100 text-red-700 border-red-300',
      subtitle: `${stats.validBloodBags} còn hiệu lực`
    },
    { 
      label: 'Thể tích máu (ml)', 
      value: stats.totalVolume.toLocaleString('vi-VN'), 
      icon: '🧪', 
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      subtitle: `${stats.usedBloodBags} đã sử dụng`
    },
    { 
      label: 'Phản hồi người dùng', 
      value: stats.totalFeedbacks, 
      icon: '💬', 
      color: 'bg-green-100 text-green-700 border-green-300',
      subtitle: `Đánh giá TB: ${stats.averageRating.toFixed(1)}/5`
    },
    { 
      label: 'Sự kiện hiến máu', 
      value: stats.totalEvents, 
      icon: '📅', 
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      subtitle: 'Tổng sự kiện'
    },
    { 
      label: 'Thành tựu hệ thống', 
      value: stats.totalAchievements, 
      icon: '🏆', 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      subtitle: 'Loại thành tựu'
    },
    { 
      label: 'Túi máu hết hạn', 
      value: stats.expiredBloodBags, 
      icon: '⚠️', 
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      subtitle: 'Cần xử lý'
    },
  ];

  return (
    <div className="space-y-10">
      {/* Overview Cards */}
      <section>
        <h2 className="text-2xl font-bold text-[#b71c1c] mb-6 text-center">Tổng quan hệ thống</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {dashboardItems.map((item, idx) => (
            <div key={idx} className={`flex items-center gap-4 p-6 rounded-xl shadow-md bg-white border-l-4 ${item.color} hover:shadow-lg transition-shadow`}>
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-600 mb-1">{item.label}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                <div className="text-xs text-gray-500">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section>
        <h2 className="text-2xl font-bold text-[#b71c1c] mb-6 text-center">Biểu đồ thống kê</h2>
        <DashboardCharts />
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Thống kê chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow border-l-4 border-green-400">
            <div className="text-sm text-gray-600">Túi máu còn hiệu lực</div>
            <div className="text-xl font-bold text-green-600">{stats.validBloodBags}</div>
            <div className="text-xs text-gray-500">
              {stats.totalBloodBags > 0 ? ((stats.validBloodBags / stats.totalBloodBags) * 100).toFixed(1) : 0}% tổng số
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow border-l-4 border-blue-400">
            <div className="text-sm text-gray-600">Túi máu đã sử dụng</div>
            <div className="text-xl font-bold text-blue-600">{stats.usedBloodBags}</div>
            <div className="text-xs text-gray-500">
              {stats.totalBloodBags > 0 ? ((stats.usedBloodBags / stats.totalBloodBags) * 100).toFixed(1) : 0}% tổng số
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow border-l-4 border-orange-400">
            <div className="text-sm text-gray-600">Túi máu hết hạn</div>
            <div className="text-xl font-bold text-orange-600">{stats.expiredBloodBags}</div>
            <div className="text-xs text-gray-500">
              {stats.totalBloodBags > 0 ? ((stats.expiredBloodBags / stats.totalBloodBags) * 100).toFixed(1) : 0}% tổng số
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow border-l-4 border-purple-400">
            <div className="text-sm text-gray-600">Đánh giá trung bình</div>
            <div className="text-xl font-bold text-purple-600">{stats.averageRating.toFixed(1)}/5</div>
            <div className="text-xs text-gray-500">Từ {stats.totalFeedbacks} phản hồi</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
