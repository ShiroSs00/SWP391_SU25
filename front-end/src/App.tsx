// Instructions: Thiết lập routing và layout cơ bản cho ứng dụng

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/sections/header";
import { Footer } from "./components/sections/footer";

// Pages
import Home from "./pages/home";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/profile";
import MapPage from "./pages/Map";
import Blog from "./pages/blogs/blogPage";
import Contact from "./pages/contactPage/contactPage";
import AuthPage from "./pages/authPage";
// Forms
import DonorRegisterForm from "./forms/DonorRegisterForm";
import RequestBloodForm from "./forms/RequestBloodForm";
// BloodTypes
import BloodTypes from "./pages/booldTypes/bloodTypes";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
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
            <Route path="/map" element={<MapPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blood-types" element={<BloodTypes />} />
            <Route path="/contact" element={<Contact />} />
            {/* Thêm các route khác nếu cần */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
