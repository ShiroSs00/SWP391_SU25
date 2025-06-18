import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Phone, Calendar, Heart, Droplets, Shield, Users } from "lucide-react";
import { useAuth } from "../../pages/authPage/AuthContext";
import api from "../../api/api";
import axios from "axios";

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState(true); // true = Nam, false = Nữ
  const [address, setAddress] = useState({
    city: "",
    district: "",
    ward: "",
    street: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
    // Reset form
    setUsername("");
    setPassword("");
    setConfirm("");
    setFullname("");
    setEmail("");
    setPhone("");
    setDob("");
    setGender(true);
    setAddress({ city: "", district: "", ward: "", street: "" });
    setError(null);
  }, [location.pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const loginData = {
        username: username.trim(),
        password: password,
      };
      console.log("Login payload:", loginData);

      const response = await api.post("/auth/login", loginData);
      console.log("Login response:", response.data);

      if (response.data?.message === "Login successful" && response.data?.token) {
      localStorage.setItem("token", response.data.token);
      
      // Get role from response
      const userRole = response.data?.role;
      console.log("User role:", userRole);

      // Update auth context
      login(response.data);
      
      // Navigate based on role
      switch (userRole) {
        case "ADMIN":
          console.log("Navigating to admin");
          navigate("/admin");
          break;
        case "STAFF":
          console.log("Navigating to staff");
          navigate("/staff");
          break;
        default:
          console.log("Navigating to home");
          navigate("/");
      }
    } else {
      setError("Đăng nhập không thành công!");
    }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Login error details:", {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers,
        });
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau!");
      }
    }
  };
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!username || !password || !confirm || !fullname || !email || !phone || !dob) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ!");
      return;
    }

    // Validate phone format (Vietnamese phone)
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      setError("Số điện thoại không hợp lệ!");
      return;
    }

    try {
      const registerData = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        name: fullname.trim(),
        phone: phone.trim(),
        dob: dob, // Format: YYYY-MM-DD
        gender: gender,
        address: {
          city: address.city.trim() || "",
          district: address.district.trim() || "",
          ward: address.ward.trim() || "",
          street: address.street.trim() || ""
        }
      };

      console.log("Register payload:", registerData);

      const response = await api.post("/auth/register", registerData);
      console.log("Register response:", response.data);

      if (response.data) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        setError("Đăng ký không thành công!");
      }

    } catch (err) {
      console.error("Register error:", err);
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || 
                        err.response?.data?.error || 
                        "Đăng ký thất bại. Vui lòng thử lại!";
        setError(errorMsg);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau!");
      }
    }
  };

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex min-h-[800px]">
            {/* Left Panel - Brand & Features */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-500 to-rose-600 p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 text-white/30">
                  <Droplets size={120} />
                </div>
                <div className="absolute bottom-20 right-20 text-white/20">
                  <Heart size={80} />
                </div>
                <div className="absolute top-1/2 right-10 text-white/20">
                  <User size={60} />
                </div>
              </div>

              <div className="relative z-10 flex flex-col justify-between text-white h-full">
                {/* Header */}
                <div>
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mr-4">
                      <Droplets className="text-white" size={28} />
                    </div>
                    <span className="text-2xl font-bold">BloodCare</span>
                  </div>

                  <h1 className="text-5xl font-black leading-tight mb-6">
                    Cứu sống<br />
                    <span className="text-yellow-300">một người</span><br />
                    bằng <span className="text-rose-200">tình yêu</span>
                  </h1>

                  <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-300 to-rose-200 rounded-full mb-8"></div>

                  <p className="text-xl text-white/90 leading-relaxed mb-12">
                    Gia nhập cộng đồng hiến máu lớn nhất Việt Nam.<br />
                    Mỗi giọt máu là một cơ hội cứu sống.
                  </p>

                  {/* Features */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                        <Shield className="text-yellow-300" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">An toàn tuyệt đối</h3>
                        <p className="text-white/80 text-sm">Quy trình hiến máu đạt chuẩn quốc tế</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                        <Users className="text-rose-200" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Cộng đồng hùng mạnh</h3>
                        <p className="text-white/80 text-sm">Hơn 100,000 người hiến máu tình nguyện</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                        <Heart className="text-yellow-300" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Ý nghĩa nhân văn</h3>
                        <p className="text-white/80 text-sm">Mỗi lần hiến máu cứu được 3 người</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-white/60 text-sm">
                  <p>© 2024 BloodCare Platform</p>
                  <p className="mt-1">Được tin tưởng bởi Bộ Y tế Việt Nam</p>
                </div>
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                {/* Mobile Logo */}
                <div className="lg:hidden flex items-center justify-center mb-8">
                  <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mr-3">
                    <Droplets className="text-white" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-red-600">BloodCare</span>
                </div>

                {/* Tab Navigation */}
                <div className="flex mb-8 p-1 bg-gray-100 rounded-2xl">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      !isRegister
                        ? "bg-white text-red-600 shadow-lg shadow-red-100 scale-105"
                        : "text-gray-500 hover:text-red-600"
                    }`}
                    onClick={() => setIsRegister(false)}
                  >
                    Đăng nhập
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      isRegister
                        ? "bg-white text-red-600 shadow-lg shadow-red-100 scale-105"
                        : "text-gray-500 hover:text-red-600"
                    }`}
                    onClick={() => setIsRegister(true)}
                  >
                    Đăng ký
                  </button>
                </div>

                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-gray-800 mb-2">
                    {isRegister ? "Tạo tài khoản mới" : "Chào mừng trở lại"}
                  </h2>
                  <p className="text-gray-500">
                    {isRegister 
                      ? "Gia nhập cộng đồng hiến máu nhân ái" 
                      : "Đăng nhập để tiếp tục hành trình cứu người"
                    }
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                  {/* Username */}
                  <div className="group">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Register-only fields */}
                  {isRegister && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                      {/* Confirm Password */}
                      <div className="group">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Xác nhận mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="Nhập lại mật khẩu"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div className="group">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                          </div>
                          <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="Nhập họ và tên đầy đủ"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="group">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                          </div>
                          <input
                            type="email"
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Phone & DOB Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Số điện thoại <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input
                              type="tel"
                              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                              placeholder="0987654321"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Ngày sinh <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input
                              type="date"
                              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-3">
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <div className="flex space-x-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="true"
                              checked={gender === true}
                              onChange={() => setGender(true)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                              gender === true ? 'border-red-500 bg-red-500' : 'border-gray-300'
                            }`}>
                              {gender === true && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="text-gray-700 font-medium">Nam</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="false"
                              checked={gender === false}
                              onChange={() => setGender(false)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                              gender === false ? 'border-red-500 bg-red-500' : 'border-gray-300'
                            }`}>
                              {gender === false && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="text-gray-700 font-medium">Nữ</span>
                          </label>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-3">
                          Địa chỉ <span className="text-gray-400">(không bắt buộc)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Thành phố"
                            className="py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                            value={address.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Quận/Huyện"
                            className="py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                            value={address.district}
                            onChange={(e) => handleAddressChange('district', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Phường/Xã"
                            className="py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                            value={address.ward}
                            onChange={(e) => handleAddressChange('ward', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Số nhà, đường"
                            className="py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
                            value={address.street}
                            onChange={(e) => handleAddressChange('street', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={isRegister ? handleRegister : handleLogin}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg">
                        {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
                      </span>
                      <Heart className="h-5 w-5" />
                    </div>
                  </button>

                  {/* Toggle Link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-600">
                      {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors"
                        onClick={() => {
                          setIsRegister(!isRegister);
                          setError(null);
                        }}
                      >
                        {isRegister ? "Đăng nhập ngay" : "Đăng ký ngay"}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;