import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/sections/button";
import { Lock, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { mockAccounts } from "../../data/mockAccount";


const AuthPage: React.FC = () => {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(
    location.pathname === "/register"
  );

  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
    setUsername("");
    setFullname("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");

  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
    setEmail("");
    setFullname("");
    setPassword("");
    setConfirm("");

  }, [location.pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const account = mockAccounts.find(
      acc => acc.username === username && acc.password === password
    );

    if (account) {
      login({
        username: account.username,
        email: account.email,
        role: account.role
      });
      navigate("/profile");
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
=======
    navigate("/")
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Xử lý đăng ký ở đây


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

    <div className="min-h-screen flex bg-white">
      {/* Bên trái: Nền đỏ, logo sát trên, slogan căn trái, giữa dọc */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-red-600">
        <div className="relative flex flex-col h-full w-full z-10">
          {/* Logo sát trên cùng bên trái */}
          <div className="pt-6 pl-8">
            <img src="/logo512.png" alt="Logo" className="w-14 h-14" />
          </div>
          {/* Slogan giữa dọc, căn trái */}
          <div className="flex-1 flex items-center">
            <div className="pl-16 text-left w-full">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Bắt đầu <br />
                <span className="text-cyan-200">hiến máu</span>
                <br />
                cùng BloodCare
              </div>
              <div className="w-16 h-1 bg-yellow-400 my-6"></div>
              <p className="text-lg text-gray-100 font-medium">
                Kết nối cộng đồng, lan tỏa yêu thương và cứu sống nhiều người hơn!
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Bên phải: Form căn giữa dọc, căn trái */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-4">
        <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-lg border border-gray-100 mx-auto">
          <div className="flex justify-start mb-8 border-b border-gray-200">
            <button
              type="button"
              className={`px-6 py-2 font-semibold transition border-b-2 ${
                !isRegister
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-red-600"
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
              className={`px-6 py-2 font-semibold transition border-b-2 ${
                isRegister
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-red-600"
              }`}
              onClick={() => {
                setIsRegister(true);
                navigate("/register");
              }}
            >
              Đăng ký
            </button>
          </div>
          <h2 className="text-2xl font-bold text-left text-red-600 mb-6">
            {isRegister ? "Đăng ký BloodCare" : "Đăng nhập BloodCare"}
          </h2>
          <form
            onSubmit={isRegister ? handleRegister : handleLogin}
            className="space-y-6"
          >
            {isRegister && (
              <div>
                <label className="block text-gray-700 mb-1 font-semibold">
                  Họ và tên
                </label>
                <div className="flex items-center border border-gray-300 rounded px-3 focus-within:border-red-600 bg-gray-50">
                  <User className="h-5 w-5 text-red-600 mr-2" />
                  <input
                    type="text"
                    className="w-full py-2 outline-none bg-transparent"
                    placeholder="Nhập họ và tên"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}

                    required
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">
                    Email
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-red-600 bg-gray-50">
                    <User className="h-5 w-5 text-red-600 mr-2" />
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
                  Mật khẩu
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-red-600 bg-gray-50">
                  <Lock className="h-5 w-5 text-red-600 mr-2" />
                  <input
                    type="password"
                    className="w-full py-2 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

            )}
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded px-3 focus-within:border-red-600 bg-gray-50">
                <Mail className="h-5 w-5 text-red-600 mr-2" />
                <input
                  type="email"
                  className="w-full py-2 outline-none bg-transparent"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">
                Mật khẩu
              </label>
              <div className="flex items-center border border-gray-300 rounded px-3 focus-within:border-red-600 bg-gray-50">
                <Lock className="h-5 w-5 text-red-600 mr-2" />
                <input
                  type="password"
                  className="w-full py-2 outline-none bg-transparent"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {isRegister && (
              <div>
                <label className="block text-gray-700 mb-1 font-semibold">
                  Nhập lại mật khẩu
                </label>
                <div className="flex items-center border border-gray-300 rounded px-3 focus-within:border-red-600 bg-gray-50">
                  <Lock className="h-5 w-5 text-red-600 mr-2" />
                  <input
                    type="password"
                    className="w-full py-2 outline-none bg-transparent"
                    placeholder="Nhập lại mật khẩu"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-gray-700 mb-1 font-semibold">
                    Nhập lại mật khẩu
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:border-red-600 bg-gray-50">
                    <Lock className="h-5 w-5 text-red-600 mr-2" />
                    <input
                      type="password"
                      className="w-full py-2 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                      placeholder="Nhập lại mật khẩu"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg shadow hover:bg-red-700 transition text-lg mt-2"
              >
                {isRegister ? "Đăng ký" : "Đăng nhập"}
              </Button>
              {!isRegister && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tài khoản mẫu để thử:</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Admin:</span>
                      <span className="font-mono">admin / admin123</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Staff:</span>
                      <span className="font-mono">staff / staff123</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>User:</span>
                      <span className="font-mono">user / user123</span>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-center text-gray-500 mt-2">
                {isRegister ? (
                  <>
                    Đã có tài khoản?{' '}
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
                    Chưa có tài khoản?{' '}
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
=======
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
  );
};

export default AuthPage;