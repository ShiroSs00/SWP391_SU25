import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from '../dashboard/dashboard';
import UserManagement from './components/UserManagement';
import BloodInventory from './components/BloodInventory';
import DonationManagement from './components/DonationManagement';
import RequestManagement from './components/RequestManagement';

// Admin Page component for managing various administrative sections.
const AdminPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Quản lý người dùng', icon: '👥' },
    { path: '/admin/blood-inventory', label: 'Quản lý máu', icon: '🩸' },
    { path: '/admin/donations', label: 'Quản lý hiến máu', icon: '💉' },
    { path: '/admin/requests', label: 'Quản lý yêu cầu', icon: '📝' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            Admin Panel
          </h2>
          <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
            {isSidebarOpen ? '✖️' : '☰'}
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && (
                <span className="ml-3">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/blood-inventory" element={<BloodInventory />} />
            <Route path="/donations" element={<DonationManagement />} />
            <Route path="/requests" element={<RequestManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
