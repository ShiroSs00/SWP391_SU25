import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/sections/button";
import {
  Calendar,
  Droplet,
  Hospital,
  AlertTriangle,
  Hash,
  Layers,
  CheckCircle,
  Clock,
  Shield,
  Activity,
  Heart,
  Bell,
  MapPin,
  // Phone,
  // User,
  FileText,
  Send,
  // AlertCircle,
} from "lucide-react";
import "./RequestBloodFrom.css";

const RequestBloodForm: React.FC = () => {
  // Đổi thành true để test giao diện cho staff/admin
  const isStaffOrAdmin = false;
  const [urgencyReason, setUrgencyReason] = useState("");
  const [hospitalID, setHospitalID] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [bloodCode, setBloodCode] = useState("");
  const [component, setComponent] = useState("");
  const [urgency, setUrgency] = useState(false);
  const [status, setStatus] = useState("pending");
  const [volumn, setVolumn] = useState("");
  const [quantity, setQuantity] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Thêm kiểm tra đăng nhập ở đây
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  // Set ngày hiện tại mặc định
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setRequestDate(today);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
    }, 2000);
  };

  const bloodTypes = [
    { value: "1", label: "A+", color: "#ef4444" },
    { value: "2", label: "A-", color: "#dc2626" },
    { value: "3", label: "B+", color: "#f97316" },
    { value: "4", label: "B-", color: "#ea580c" },
    { value: "5", label: "AB+", color: "#8b5cf6" },
    { value: "6", label: "AB-", color: "#7c3aed" },
    { value: "7", label: "O+", color: "#10b981" },
    { value: "8", label: "O-", color: "#059669" },
  ];

  const components = [
    { value: "whole_blood", label: "Máu toàn phần", icon: <Droplet className="w-4 h-4" /> },
    { value: "red_blood_cells", label: "Hồng cầu", icon: <Heart className="w-4 h-4" /> },
    { value: "plasma", label: "Huyết tương", icon: <Activity className="w-4 h-4" /> },
    { value: "platelets", label: "Tiểu cầu", icon: <Shield className="w-4 h-4" /> },
  ];

  if (success) {
    return (
        <div className="blood-form-container">
          <div className="success-animation">
            <div className="success-icon">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <div className="success-content">
              <h2 className="success-title">Yêu cầu đã được gửi thành công!</h2>
              <p className="success-message">
                Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ trong thời gian sớm nhất.
                Mã yêu cầu: <span className="request-id">#BRQ{Date.now().toString().slice(-6)}</span>
              </p>
              <div className="success-actions">
                <Button
                    onClick={() => setSuccess(false)}
                    className="btn-secondary"
                >
                  Tạo yêu cầu mới
                </Button>
                <Button
                    onClick={() => navigate("/dashboard")}
                    className="btn-primary"
                >
                  Về trang chủ
                </Button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="blood-form-container">
        <div className="form-header">
          <div className="header-background">
            <div className="header-pattern"></div>
          </div>
          <div className="header-content">
            <div className="header-icon">
              <Droplet className="w-8 h-8" />
            </div>
            <h1 className="header-title">Yêu cầu Nhận Máu</h1>
            <p className="header-subtitle">
              Hệ thống quản lý hiến máu chuyên nghiệp
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="blood-form">
          <div className="form-section">
            <div className="section-header">
              <Hospital className="w-5 h-5" />
              <h3>Thông tin bệnh viện</h3>
            </div>

            <div className="form-group">
              <label className="form-label">
                <MapPin className="w-4 h-4" />
                Mã bệnh viện
              </label>
              <div className="input-group">
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-input"
                    placeholder="Nhập mã bệnh viện"
                    value={hospitalID}
                    onChange={(e) =>
                        setHospitalID(e.target.value.replace(/\D/g, ""))
                    }
                    required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar className="w-4 h-4" />
                Ngày yêu cầu
              </label>
              <div className="input-group">
                <input
                    type="date"
                    className="form-input"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <Droplet className="w-5 h-5" />
              <h3>Thông tin máu cần thiết</h3>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Activity className="w-4 h-4" />
                Nhóm máu
              </label>
              <div className="blood-type-grid">
                {bloodTypes.map((type) => (
                    <div
                        key={type.value}
                        className={`blood-type-option ${bloodCode === type.value ? 'selected' : ''}`}
                        onClick={() => setBloodCode(type.value)}
                        style={{ '--blood-color': type.color } as React.CSSProperties}
                    >
                      <Droplet className="w-4 h-4" />
                      <span>{type.label}</span>
                    </div>
                ))}
              </div>
            </div>

            {bloodCode && (
                <div className="form-group slide-in">
                  <label className="form-label">
                    <Layers className="w-4 h-4" />
                    Thành phần máu
                  </label>
                  <div className="component-grid">
                    {components.map((comp) => (
                        <div
                            key={comp.value}
                            className={`component-option ${component === comp.value ? 'selected' : ''}`}
                            onClick={() => setComponent(comp.value)}
                        >
                          {comp.icon}
                          <span>{comp.label}</span>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Layers className="w-4 h-4" />
                  Thể tích (ml)
                </label>
                <select
                    className="form-select"
                    value={volumn}
                    onChange={(e) => setVolumn(e.target.value)}
                    required
                >
                  <option value="">Chọn thể tích</option>
                  <option value="250">250 ml</option>
                  <option value="350">350 ml</option>
                  <option value="450">450 ml</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Hash className="w-4 h-4" />
                  Số lượng túi
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-input"
                    placeholder="Số lượng"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
                    required
                    min={1}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <AlertTriangle className="w-5 h-5" />
              <h3>Mức độ ưu tiên</h3>
            </div>

            <div className="urgency-toggle">
              <div
                  className={`urgency-option ${!urgency ? 'selected' : ''}`}
                  onClick={() => setUrgency(false)}
              >
                <Clock className="w-4 h-4" />
                <span>Bình thường</span>
              </div>
              <div
                  className={`urgency-option urgent ${urgency ? 'selected' : ''}`}
                  onClick={() => setUrgency(true)}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Khẩn cấp</span>
              </div>
            </div>

            {urgency && (
                <div className="form-group slide-in">
                  <label className="form-label">
                    <FileText className="w-4 h-4" />
                    Lý do khẩn cấp
                  </label>
                  <textarea
                      className="form-textarea"
                      placeholder="Mô tả chi tiết lý do cần máu khẩn cấp..."
                      value={urgencyReason}
                      onChange={(e) => setUrgencyReason(e.target.value)}
                      rows={3}
                      required
                  />
                </div>
            )}
          </div>

          {isStaffOrAdmin && (
              <div className="form-section staff-section">
                <div className="section-header">
                  <Shield className="w-5 h-5" />
                  <h3>Khu vực Staff/Admin</h3>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Bell className="w-4 h-4" />
                    Trạng thái yêu cầu
                  </label>
                  <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                  >
                    <option value="pending">🕐 Chờ duyệt</option>
                    <option value="approved">✅ Đã duyệt</option>
                    <option value="rejected">❌ Từ chối</option>
                  </select>
                </div>
              </div>
          )}

          <div className="form-actions">
            <Button
                type="submit"
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
            >
              {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Đang gửi...
                  </>
              ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gửi yêu cầu
                  </>
              )}
            </Button>
          </div>
        </form>
      </div>
  );
};

export default RequestBloodForm;