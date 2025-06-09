import React, { useState } from "react";
import Pagination from "../../components/sections/pagination";

const Dashboard: React.FC = () => {
  // Ví dụ dữ liệu
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Dashboard</h1>
        {/* Thông tin tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600">120</div>
            <div className="text-gray-600 mt-2">Lượt hiến máu</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600">35</div>
            <div className="text-gray-600 mt-2">Yêu cầu cần máu</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-red-600">8</div>
            <div className="text-gray-600 mt-2">Bài viết Blog</div>
          </div>
        </div>
        {/* Danh sách mẫu (có phân trang) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách hoạt động</h2>
          <ul className="mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i + (currentPage - 1) * 5} className="py-2 border-b last:border-b-0">
                Hoạt động #{i + 1 + (currentPage - 1) * 5}
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;