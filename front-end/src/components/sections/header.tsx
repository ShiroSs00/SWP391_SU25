import type React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, User, LogIn, LogOut, Bell } from "lucide-react";
import { Button } from "./button.tsx";
import { useAuth } from "../../pages/authPage/AuthContext.tsx";
import axios from "axios";
import api from "../../api/api.ts"; // Adjust the import path as necessary

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  showToggleButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar, showToggleButton }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
  try {
    // Call logout API
    await api.post('/auth/logout');

    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Call context logout to update state
    logout();
    
    // Close dropdown
    setIsDropdownOpen(false);
    
    // Navigate to login
    navigate('/login');
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Logout error:', err.response?.data);
    } else {
      console.error('Unexpected error:', err);
    }
    // Still perform logout even if API fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  }
};

  // Navigation links for different roles
  const userNavigation = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/Blog" },
    { name: "Need-blood", href: "/need-blood-donate" },
    { name: "Donation", href: "/donate" },
    { name: "Contact", href: "/contact" },
  ];

  const staffNavigation = [
    { name: "Tổng quan", href: "/staff" },
    { name: "Quản lý đơn", href: "/staff/donation-applications" },
    { name: "Thông tin hiến máu", href: "/staff/blood-donation-info" },
    { name: "Gửi lời khuyên", href: "/staff/advice" },
    { name: "Tìm kiếm yêu cầu", href: "/staff/search-blood-request" },
  ];

  const adminNavigation = [
    { name: "Dashboard", href: "/admin" },
    { name: "Quản lý người dùng", href: "/admin/users" }, // Example admin link
    { name: "Quản lý sự kiện", href: "/admin/events" }, // Example admin link
  ];

  const currentNavigation = user?.role?.toLowerCase() === 'staff' 
    ? staffNavigation
    : user?.role?.toLowerCase() === 'admin'
      ? adminNavigation
      : userNavigation;

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));

  console.log("User Role:", user?.role?.toLowerCase());
  console.log("Current Navigation:", currentNavigation);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className={`py-4 ${showToggleButton ? 'pl-4 pr-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        <div className="flex justify-between items-center">
          {/* Left side - Toggle Button for Staff and Logo */}
          <div className="flex items-center space-x-4">
            {showToggleButton && (
              <button
                onClick={onToggleSidebar}
                className="text-gray-700 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-2"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
            <Link to={user?.role?.toLowerCase() === 'staff' ? "/staff" : user?.role?.toLowerCase() === 'admin' ? "/admin" : "/"} className="flex items-center space-x-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BloodCare</h1>
                <p className="text-xs text-gray-500">
                  {user?.role?.toLowerCase() === 'staff' ? 'Staff Dashboard' : user?.role?.toLowerCase() === 'admin' ? 'Admin Dashboard' : 'Hệ thống hiến máu'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex space-x-8 ml-auto">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-red-600 border-b-2 border-red-600 pb-1"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4 ml-auto">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.username}
                  </Button>
                  <div className={`absolute right-0 top-full w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 -mt-px ${isDropdownOpen ? 'block' : 'hidden'}`}>
                    <Link to="/profile">
                      <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Hồ sơ</span>
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Ẩn nút Hồ sơ khi chưa đăng nhập */}
                {/* <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Hồ sơ
                  </Button>
                </Link> */}
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Đăng ký</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
