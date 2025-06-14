import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-red-600 text-xl font-bold">Blood Donation</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-red-600">Trang chủ</Link>
            <Link to="/about" className="text-gray-700 hover:text-red-600">Giới thiệu</Link>
            <Link to="/events" className="text-gray-700 hover:text-red-600">Sự kiện</Link>
            <Link to="/contact" className="text-gray-700 hover:text-red-600">Liên hệ</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-700 hover:text-red-600">
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 