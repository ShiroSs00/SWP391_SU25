import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      <span className="ml-3 text-gray-600">Đang tải...</span>
    </div>
  );
};

export default LoadingSpinner;