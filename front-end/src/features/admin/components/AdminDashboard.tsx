import React from 'react';

const AdminDashboard: React.FC = () => {
  // Demo số liệu, có thể thay bằng props hoặc fetch API thật
  const stats = [
    { label: 'Tài khoản người dùng', value: 1200, icon: '👤', color: 'bg-blue-100 text-blue-700' },
    { label: 'Sự kiện hiến máu', value: 35, icon: '🩸', color: 'bg-red-100 text-red-700' },
    { label: 'Feedback mới', value: 18, icon: '💬', color: 'bg-green-100 text-green-700' },
    { label: 'Đơn vị máu tồn kho', value: 540, icon: '🧪', color: 'bg-purple-100 text-purple-700' },
    { label: 'Thành tựu đã trao', value: 210, icon: '🏆', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Báo cáo/thống kê', value: 12, icon: '📊', color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-[#b71c1c] mb-6 text-center">Tổng quan hệ thống</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {stats.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-4 p-6 rounded-xl shadow bg-white border-l-4 ${item.color} animate-fade-in`}>
            <span className="text-3xl">{item.icon}</span>
            <div>
              <div className="text-lg font-semibold">{item.label}</div>
              <div className="text-2xl font-bold">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;
