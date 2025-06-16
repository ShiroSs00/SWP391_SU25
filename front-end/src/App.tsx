// Instructions: Thiết lập routing và layout cơ bản cho ứng dụng

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from "./components/sections/header";

// Pages
import Home from "./pages/homePage/home.tsx";
import Profile from "./pages/profilePage/profile.tsx";
import Blog from "./pages/blogs/blogPage";
import Contact from "./pages/contactPage/contactPage";
import AuthPage from "./pages/authPage/authPage.tsx";
import Dashboard from "./pages/dashboard/dashboard";
import StaffPage from "./pages/staffPages/staffPage.tsx";
// Forms
import DonorRegisterForm from "./forms/DonorRegister/DonorRegisterForm.tsx";
import RequestBloodForm from "./forms/RequestBlood/RequestBloodForm.tsx";
// BloodTypes
import BloodTypes from "./pages/booldTypes/bloodTypes";

// Placeholder for AdminPage if it doesn't exist
const AdminPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard (Chưa có nội dung)</h1>
      <p>Đây là trang quản trị. Vui lòng phát triển nội dung tại đây.</p>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    console.log("AppContent useEffect triggered.");
    console.log("Current user state:", user);
    console.log("Current location pathname:", location.pathname);

    if (user) {
      // Chỉ chuyển hướng cho staff và admin
      if (user.role === 'staff') {
        const targetPath = '/staff';
        if (!location.pathname.startsWith(targetPath)) {
          navigate(targetPath, { replace: true });
        }
      } else if (user.role === 'admin') {
        const targetPath = '/admin';
        if (!location.pathname.startsWith(targetPath)) {
          navigate(targetPath, { replace: true });
        }
      }
      // Không chuyển hướng cho user thường
    } else {
      console.log("No user logged in. Checking public paths...");
      const publicPaths = ['/', '/login', '/register', '/blog', '/blood-types', '/contact', '/dashboard'];
      if (!publicPaths.includes(location.pathname)) {
        console.log("Current path is not public. Redirecting to /login.");
        navigate('/login', { replace: true });
      }
    }
  }, [user, navigate, location.pathname]);

  const isStaffRoute = location.pathname.startsWith('/staff');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={toggleSidebar} 
        showToggleButton={isStaffRoute || isAdminRoute}
      />
      <main className="flex-grow flex" style={{ marginTop: '64px' }}>
        {user?.role === 'STAFF' && isStaffRoute && (
          <StaffPage isSidebarOpen={isSidebarOpen} />
        )}
        <div className={`flex-1 ${user?.role === 'STAFF' && isStaffRoute ? (isSidebarOpen ? 'ml-64' : 'ml-0') : ''} p-8`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/donate" element={<DonorRegisterForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/need-blood-donate" element={<RequestBloodForm />} />

            <Route path="/blog" element={<Blog />} />
            <Route path="/blood-types" element={<BloodTypes />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff/*" element={<StaffPage isSidebarOpen={isSidebarOpen} />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
