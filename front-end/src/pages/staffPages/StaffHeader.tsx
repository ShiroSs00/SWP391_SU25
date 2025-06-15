import React from 'react';
import { Menu, X } from 'lucide-react';

interface StaffHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white shadow-md z-30 flex items-center px-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      <div className="ml-4">
        <h1 className="text-xl font-semibold text-gray-800">Staff Dashboard</h1>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <span className="text-gray-600">Welcome, Staff</span>
      </div>
    </header>
  );
};

export default StaffHeader; 