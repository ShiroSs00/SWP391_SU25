// Instructions: Thiết lập routing và layout cơ bản cho ứng dụng

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';


// Pages
import Home from "./pages/homePage/home.tsx";
import Profile from "./pages/profilePage/profile.tsx";
import Blog from "./pages/blogs/blogPage";
import Contact from "./pages/contactPage/contactPage";
import AuthPage from "./pages/authPage/authPage.tsx";
import Dashboard from "./pages/dashboard/dashboard";
import StaffPage from "./pages/staffPages/staffPage.tsx";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";

// Forms
import DonorRegisterForm from "./forms/DonorRegister/DonorRegisterForm.tsx";
import RequestBloodForm from "./forms/RequestBlood/RequestBloodForm.tsx";
// BloodTypes
import BloodTypes from "./pages/booldTypes/bloodTypes";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
 
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} /> */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/donate" element={<DonorRegisterForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/need-blood-donate" element={<RequestBloodForm />} />

              <Route path="/blog" element={<Blog />} />
              <Route path="/blood-types" element={<BloodTypes />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/staff/*" element={<StaffPage />} />
              {/* Thêm các route khác nếu cần */}
            </Routes>
          </main>

        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
