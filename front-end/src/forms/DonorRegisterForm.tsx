import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/sections/button';
import { Mail, User, Phone, Calendar, Droplet, Layers } from 'lucide-react';

interface DonorFormProps {
  initialData?: {
    fullName?: string;
    dob?: string;
    email?: string;
    phone?: string;
    bloodType?: string;
    component?: string;
    eventId?: string;
    status?: string;
  };
  onSubmit?: (data: any) => void;
  isEdit?: boolean;
}

const DonorRegisterForm: React.FC<DonorFormProps> = ({ 
  initialData, 
  onSubmit,
  isEdit = false 
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [dob, setDob] = useState(initialData?.dob || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [bloodType, setBloodType] = useState(initialData?.bloodType || '');
  const [component, setComponent] = useState(initialData?.component || '');
  const [eventId, setEventId] = useState(initialData?.eventId || '');
  const [status, setStatus] = useState(initialData?.status || 'pending');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    }
  }, [navigate, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      fullName,
      dob,
      email,
      phone,
      bloodType,
      component,
      eventId,
      status
    };

    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Default submission behavior for new registrations
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
        {isEdit ? 'Chỉnh sửa đơn hiến máu' : 'Đăng ký hiến máu'}
      </h2>
      {success && !isEdit ? (
        <div className="text-green-600 text-center font-semibold">
          Đăng ký thành công! Cảm ơn bạn đã tham gia hiến máu.<br />
          Đang chuyển về trang chủ...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Họ và tên</label>
            <div className="flex items-center border rounded-lg px-3">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full py-2 outline-none"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Ngày sinh</label>
            <div className="flex items-center border rounded-lg px-3">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full py-2 outline-none"
                value={dob}
                onChange={e => setDob(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="flex items-center border rounded-lg px-3">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="email"
                className="w-full py-2 outline-none"
                placeholder="Nhập email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Số điện thoại</label>
            <div className="flex items-center border rounded-lg px-3">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="tel"
                className="w-full py-2 outline-none"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {(isEdit || initialData) && (
            <>
              <div>
                <label className="block text-gray-700 mb-1">Nhóm máu</label>
                <div className="flex items-center border rounded-lg px-3">
                  <Droplet className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    className="w-full py-2 outline-none bg-transparent"
                    value={bloodType}
                    onChange={e => setBloodType(e.target.value)}
                    required
                  >
                    <option value="">Chọn nhóm máu</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Thành phần máu hiến</label>
                <div className="flex items-center border rounded-lg px-3">
                  <Layers className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    className="w-full py-2 outline-none bg-transparent"
                    value={component}
                    onChange={e => setComponent(e.target.value)}
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

              <div>
                <label className="block text-gray-700 mb-1">Trạng thái đơn</label>
                <select
                  className="w-full py-2 outline-none border rounded-lg px-3"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  required
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Mã sự kiện (nếu có)</label>
            <input
              type="text"
              className="w-full py-2 outline-none border rounded-lg px-3"
              placeholder="Nhập mã sự kiện"
              value={eventId}
              onChange={e => setEventId(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            {isEdit ? 'Lưu thay đổi' : 'Đăng ký hiến máu'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default DonorRegisterForm;