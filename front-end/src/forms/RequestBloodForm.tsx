import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/sections/button";
import {
  Calendar,
  Droplet,
  Hospital,
  AlertTriangle,
  Hash,
  Layers,
} from "lucide-react";

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
  const navigate = useNavigate();
    // Thêm kiểm tra đăng nhập ở đây
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên server
    setSuccess(true);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
        Yêu cầu nhận máu
      </h2>
      {success ? (
        <div className="text-green-600 text-center font-semibold">
          Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm nhất.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Mã bệnh viện</label>
            <div className="flex items-center border rounded-lg px-3">
              <Hospital className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full py-2 outline-none"
                placeholder="Nhập mã bệnh viện"
                value={hospitalID}
                onChange={(e) =>
                  setHospitalID(e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Ngày yêu cầu</label>
            <div className="flex items-center border rounded-lg px-3">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full py-2 outline-none"
                value={requestDate}
                onChange={(e) => setRequestDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Nhóm máu</label>
            <div className="flex items-center border rounded-lg px-3">
              <Droplet className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full py-2 outline-none bg-transparent"
                value={bloodCode}
                onChange={(e) => setBloodCode(e.target.value)}
                required
              >
                <option value="">Chọn nhóm máu</option>
                <option value="1">A+</option>
                <option value="2">A-</option>
                <option value="3">B+</option>
                <option value="4">B-</option>
                <option value="5">AB+</option>
                <option value="6">AB-</option>
                <option value="7">O+</option>
                <option value="8">O-</option>
              </select>
            </div>
          </div>
          {/* Hiện thành phần máu khi đã chọn nhóm máu */}
          {bloodCode && (
            <div>
              <label className="block text-gray-700 mb-1">Thành phần máu</label>
              <div className="flex items-center border rounded-lg px-3">
                <Layers className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="w-full py-2 outline-none bg-transparent"
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  required
                >
                  <option value="">Chọn thành phần</option>
                  <option value="whole_blood">Máu toàn phần</option>
                  <option value="red_blood_cells">Hồng cầu</option>
                  <option value="plasma">Huyết tương</option>
                  <option value="platelets">Tiểu cầu</option>
                </select>
              </div>
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-1">Khẩn cấp</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <input
                type="checkbox"
                checked={urgency}
                onChange={(e) => setUrgency(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">Yêu cầu khẩn cấp</span>
            </div>
          </div>
          {urgency && (
            <div>
              <label className="block text-gray-700 mb-1">Lý do khẩn cấp</label>
              <input
                type="text"
                className="w-full py-2 outline-none border rounded-lg px-3"
                placeholder="Nhập lý do khẩn cấp"
                value={urgencyReason}
                onChange={(e) => setUrgencyReason(e.target.value)}
                required
              />
            </div>
          )}
          {isStaffOrAdmin && (
            <div>
              <label className="block text-gray-700 mb-1">Trạng thái</label>
              <select
                className="w-full py-2 outline-none border rounded-lg px-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-1">Thể tích (ml)</label>
            <div className="flex items-center border rounded-lg px-3">
              <Layers className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full py-2 outline-none bg-transparent"
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
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Số lượng túi máu</label>
            <div className="flex items-center border rounded-lg px-3">
              <Hash className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full py-2 outline-none"
                placeholder="Nhập số lượng túi máu"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
                required
                min={1}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            Gửi yêu cầu
          </Button>
        </form>
      )}
    </div>
  );
};

export default RequestBloodForm;
