import React from 'react';
import HealthCheckManage from '../components/healthcheckmanage';

const HealthCheckPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with improved styling */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Hệ Thống Kiểm Tra Sức Khỏe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quản lý và theo dõi kết quả kiểm tra sức khỏe người hiến máu một cách chuyên nghiệp và hiệu quả
          </p>
        </div>

        {/* Content with enhanced design */}
        <div className="animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-2 mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Quản Lý Kiểm Tra Sức Khỏe
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Xem và quản lý tất cả các bản kiểm tra sức khỏe
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                    <span className="text-white text-sm font-medium">Hệ Thống Y Tế</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <HealthCheckManage />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default HealthCheckPage;