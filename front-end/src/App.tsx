// Instructions: Thiết lập routing và layout cơ bản cho ứng dụng

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/authPage/AuthContext.tsx";
import { Header } from "./components/sections/header";
import ProtectedRoutes from "./routes/ProtectedRoutes";

// Pages
import Home from "./pages/homePage/home.tsx";
import Blog from "./pages/blogs/blogPage";
import Contact from "./pages/contactPage/contactPage";
import AuthPage from "./pages/authPage/authPage.tsx";
import BloodTypes from "./pages/booldTypes/bloodTypes";
import StaffPage from "./pages/staffPages/staffPage";

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
    } else {
      console.log("No user logged in. Checking public paths...");
      console.log("Current user state (for guest):", user);
      console.log("Current location pathname when checking public paths:", location.pathname);
      const publicPaths = ['/', '/login', '/register', '/blog', '/blood-types', '/contact'];
      console.log("Public paths array:", publicPaths);
      console.log("Is current path included in public paths?:", publicPaths.includes(location.pathname.toLowerCase()));
      if (!publicPaths.includes(location.pathname.toLowerCase())) {
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
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blood-types" element={<BloodTypes />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Routes */}
            <Route path="/*" element={<ProtectedRoutes isSidebarOpen={isSidebarOpen} />} />
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
