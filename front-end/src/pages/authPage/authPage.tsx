import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/sections/button";
import { useAuth } from "../../pages/authPage/AuthContext";
import { mockAccounts } from "../../data/mockAccount";

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
    setUsername("");
    setPassword("");
    setConfirm("");
    setFullname("");
    setEmail("");
    setError(null);
  }, [location.pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const account = mockAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      login({
        username: account.username,
        email: account.email,
        role: account.role,
        fullName: account.fullName,
      }, "mock-token");

      if (account.role.toLowerCase() === "staff") {
        navigate("/staff");
      } else if (account.role.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Xử lý đăng ký ở đây, giả lập thành công
    console.log("Đăng ký thành công:", { username, fullname, email });
    // Sau khi đăng ký thành công, chuyển về trang đăng nhập
    setIsRegister(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-cyan-100">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-gray-100">
        {/* Left: Slogan & Logo */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-red-600 to-red-400 p-10 w-1/2 text-white relative">
          <div>
            <img src="/logo512.png" alt="Logo" className="w-16 h-16 mb-8" />
            <div className="text-4xl font-extrabold leading-tight mb-4">
              Bắt đầu <br />
              <span className="text-yellow-200">hiến máu</span>
              <br />
              cùng BloodCare
            </div>
            <div className="w-20 h-1 bg-yellow-400 my-6 rounded"></div>
            <p className="text-lg font-medium text-white/90">
              Kết nối cộng đồng, lan tỏa yêu thương và cứu sống nhiều người hơn!
            </p>
          </div>
          <div className="text-xs text-white/60 mt-8">© 2024 BloodCare</div>
        </div>
        {/* Right: Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
          <div className="w-full max-w-md">
            <div className="flex mb-8 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <button
                type="button"
                className={`flex-1 py-3 text-lg font-semibold transition-all duration-200 focus:outline-none ${
                  !isRegister
                    ? "bg-white text-red-600 shadow border-b-2 border-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
                onClick={() => {
                  setIsRegister(false);
                  navigate("/login");
                }}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-lg font-semibold transition-all duration-200 focus:outline-none ${
                  isRegister
                    ? "bg-white text-red-600 shadow border-b-2 border-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
                onClick={() => {
                  setIsRegister(true);
                  navigate("/register");
                }}
              >
                Đăng ký
              </button>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-8 text-center">
              {isRegister ? "Đăng ký BloodCare" : "Đăng nhập BloodCare"}
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            <form
              onSubmit={isRegister ? handleRegister : handleLogin}
              className="space-y-6"
            >
              {isRegister && (
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">
                    Họ và tên
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-red-600 bg-gray-50">
                    <User className="h-5 w-5 text-red-600 mr-2" />
                    <input
                      type="text"
                      className="w-full py-2 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                      placeholder="Nhập họ và tên"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              {isRegister && (
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">
                    Email
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-red-600 bg-gray-50">
                    <Mail className="h-5 w-5 text-red-600 mr-2" />
                    <input
                      type="email"
                      className="w-full py-2 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                      placeholder="Nhập email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-gray-700 mb-1 font-semibold">
                  Tên đăng nhập
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-red-600 bg-gray-50">
                  <User className="h-5 w-5 text-red-600 mr-2" />
                  <input
                    type="text"
                    className="w-full py-2 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-semibold">
                  Mật khẩu
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-red-600 bg-gray-50">
                  <Lock className="h-5 w-5 text-red-600 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full py-2 outline-none bg-transparent text-gray-800 placeholder-gray-400 pr-10"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {isRegister && (
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-red-600 bg-gray-50">
                    <Lock className="h-5 w-5 text-red-600 mr-2" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full py-2 outline-none bg-transparent text-gray-800 placeholder-gray-400 pr-10"
                      placeholder="Nhập lại mật khẩu"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-2 rounded shadow hover:bg-red-700 transition"
              >
                {isRegister ? "Đăng ký" : "Đăng nhập"}
              </Button>
              <p className="text-left text-gray-500 mt-2">
                {isRegister ? (
                  <>
                    Đã có tài khoản?{" "}
                    <button
                      type="button"
                      className="text-red-600 hover:underline font-semibold"
                      onClick={() => {
                        setIsRegister(false);
                        navigate("/login");
                      }}
                    >
                      Đăng nhập ngay
                    </button>
                  </>
                ) : (
                  <>
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      className="text-red-600 hover:underline font-semibold"
                      onClick={() => {
                        setIsRegister(true);
                        navigate("/register");
                      }}
                    >
                      Đăng ký ngay
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;