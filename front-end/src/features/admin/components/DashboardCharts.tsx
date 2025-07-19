import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

const DashboardCharts: React.FC = () => {
  const { stats, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Data cho Blood Status Pie Chart
  const bloodStatusData = [
    { name: 'Còn hiệu lực', value: stats.validBloodBags, color: '#10B981' },
    { name: 'Đã sử dụng', value: stats.usedBloodBags, color: '#3B82F6' },
    { name: 'Hết hạn', value: stats.expiredBloodBags, color: '#F59E0B' },
  ];

  // Data cho System Overview Bar Chart
  const systemOverviewData = [
    { name: 'Túi máu', count: stats.totalBloodBags, color: '#EF4444' },
    { name: 'Phản hồi', count: stats.totalFeedbacks, color: '#10B981' },
    { name: 'Sự kiện', count: stats.totalEvents, color: '#3B82F6' },
    { name: 'Thành tựu', count: stats.totalAchievements, color: '#F59E0B' },
  ];

  // Custom Tooltip
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-medium">{`${label || payload[0].name}`}</p>
          <p className="text-sm text-gray-600">
            {`Số lượng: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Blood Status Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Phân bố trạng thái túi máu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bloodStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {bloodStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex justify-center mt-4 space-x-4">
            {bloodStatusData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Overview Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Tổng quan hệ thống
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={systemOverviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {systemOverviewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Blood Volume & Rating Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Volume Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Thống kê thể tích máu
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <span className="text-red-700 font-medium">Tổng thể tích</span>
              <span className="text-2xl font-bold text-red-600">
                {stats.totalVolume.toLocaleString('vi-VN')} ml
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Trung bình/túi</span>
              <span className="text-xl font-bold text-blue-600">
                {stats.totalBloodBags > 0 
                  ? Math.round(stats.totalVolume / stats.totalBloodBags)
                  : 0
                } ml
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">Hiệu quả sử dụng</span>
              <span className="text-xl font-bold text-green-600">
                {stats.totalBloodBags > 0 
                  ? ((stats.usedBloodBags / stats.totalBloodBags) * 100).toFixed(1)
                  : 0
                }%
              </span>
            </div>
          </div>
        </div>

        {/* Rating Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Đánh giá dịch vụ
          </h3>
          <div className="space-y-4">
            {/* Overall Rating */}
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.averageRating.toFixed(1)}/5
              </div>
              <div className="text-gray-600">Đánh giá trung bình</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= Math.round(stats.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            {/* Feedback Count */}
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium">Tổng phản hồi</span>
              <span className="text-xl font-bold text-purple-600">
                {stats.totalFeedbacks}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Tóm tắt hiệu suất hệ thống
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.totalBloodBags}</div>
            <div className="text-sm text-red-700">Tổng túi máu</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalBloodBags > 0 ? ((stats.validBloodBags / stats.totalBloodBags) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-sm text-green-700">Túi máu khả dụng</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalEvents}</div>
            <div className="text-sm text-blue-700">Sự kiện tổ chức</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.totalAchievements}</div>
            <div className="text-sm text-yellow-700">Thành tựu có sẵn</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
