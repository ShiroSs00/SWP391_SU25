import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/sections/button';
import { 
  Hospital, 
  Calendar, 
  Droplet, 
  AlertCircle, 
  Layers,
  AlertTriangle
} from 'lucide-react';

interface RequestFormData {
  hospitalID: string;
  requestDate: string;
  bloodType: string;
  component: string;
  urgency: boolean;
  urgencyReason: string;
  status: string;
  volume: string;
  quantity: string;
}

interface RequestFormProps {
  initialData?: Partial<RequestFormData>;
  onSubmit?: (data: RequestFormData) => void;
  isEdit?: boolean;
}


const RequestBloodForm: React.FC<RequestFormProps> = ({
  initialData,
  onSubmit,
  isEdit = false
}) => {
  const [hospitalID, setHospitalID] = useState(initialData?.hospitalID || '');
  const [requestDate, setRequestDate] = useState(initialData?.requestDate || '');
  const [bloodType, setBloodType] = useState(initialData?.bloodType || '');
  const [component, setComponent] = useState(initialData?.component || '');
  const [urgency, setUrgency] = useState(initialData?.urgency || false);
  const [urgencyReason, setUrgencyReason] = useState(initialData?.urgencyReason || '');
  const [status, setStatus] = useState(initialData?.status || 'pending');
  const [volume, setVolume] = useState(initialData?.volume || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || '');
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
  const formData: RequestFormData = {
    hospitalID,
    requestDate,
    bloodType,
    component,
    urgency,
    urgencyReason,
    status,
    volume,
    quantity
  };

  if (onSubmit) {
    onSubmit(formData);
  } else {
    setSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }
};

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
        {isEdit ? 'Chỉnh sửa đơn nhận máu' : 'Đăng ký nhận máu'}
      </h2>
      {success && !isEdit ? (
        <div className="text-green-600 text-center font-semibold">
          Đăng ký thành công! Chúng tôi sẽ xử lý yêu cầu của bạn sớm nhất.<br />
          Đang chuyển về trang chủ...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Bệnh viện</label>
            <div className="flex items-center border rounded-lg px-3">
              <Hospital className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full py-2 outline-none bg-transparent"
                value={hospitalID}
                onChange={e => setHospitalID(e.target.value)}
                required
              >
                <option value="">Chọn bệnh viện</option>
                <option value="bv_cho_ray">Bệnh viện Chợ Rẫy</option>
                <option value="bv_115">Bệnh viện 115</option>
                <option value="bv_thong_nhat">Bệnh viện Thống Nhất</option>
              </select>
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
                onChange={e => setRequestDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Nhóm máu cần</label>
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
            <label className="block text-gray-700 mb-1">Thành phần máu</label>
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
            <label className="block text-gray-700 mb-1">Thể tích (ml)</label>
            <input
              type="number"
              className="w-full py-2 outline-none border rounded-lg px-3"
              placeholder="Nhập thể tích cần"
              value={volume}
              onChange={e => setVolume(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Số lượng đơn vị</label>
            <input
              type="number"
              className="w-full py-2 outline-none border rounded-lg px-3"
              placeholder="Nhập số lượng đơn vị"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgency"
              checked={urgency}
              onChange={e => setUrgency(e.target.checked)}
              className="rounded text-red-600"
            />
            <label htmlFor="urgency" className="flex items-center gap-1">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Khẩn cấp
            </label>
          </div>

          {urgency && (
            <div>
              <label className="block text-gray-700 mb-1">Lý do khẩn cấp</label>
              <div className="flex items-center border rounded-lg px-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <input
                  type="text"
                  className="w-full py-2 outline-none"
                  placeholder="Nhập lý do khẩn cấp"
                  value={urgencyReason}
                  onChange={e => setUrgencyReason(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {isEdit && (
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
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
          )}

          <Button 
            type="submit"
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            {isEdit ? 'Lưu thay đổi' : 'Gửi yêu cầu'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default RequestBloodForm;