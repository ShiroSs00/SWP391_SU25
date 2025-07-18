import React, { useState, useEffect } from 'react';
import { Calendar, Heart, User, Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createDonation } from '../hooks/useBloodDonation';
import type { DonationCreatePayload } from '../types/donations-register.types';
import api from '../../../services/axios/api';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
}

interface FormData {
  blood_type: string;
  donation_type: string;
  event_id: string;
  preferred_date: string;
  note: string;
}

interface FormErrors {
  blood_type?: string;
  donation_type?: string;
  event_id?: string;
  preferred_date?: string;
}

const BloodDonationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    blood_type: '',
    donation_type: '',
    event_id: '',
    preferred_date: '',
    note: ''
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const bloodTypes = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const donationTypes = [
    { value: 'event', label: 'Theo sự kiện' },
    { value: 'voluntary', label: 'Tự nguyện' }
  ];

  useEffect(() => {
    if (formData.donation_type === 'event') {
      fetchEvents();
    } else {
      setEvents([]);
      setFormData(prev => ({ ...prev, event_id: '' }));
    }
  }, [formData.donation_type]);

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const response = await api.get('/events/getall');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.blood_type) {
      newErrors.blood_type = 'Vui lòng chọn nhóm máu';
    }

    if (!formData.donation_type) {
      newErrors.donation_type = 'Vui lòng chọn hình thức hiến máu';
    }

    if (formData.donation_type === 'event' && !formData.event_id) {
      newErrors.event_id = 'Vui lòng chọn sự kiện';
    }

    if (!formData.preferred_date) {
      newErrors.preferred_date = 'Vui lòng chọn ngày hiến máu mong muốn';
    } else {
      const selectedDate = new Date(formData.preferred_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferred_date = 'Ngày hiến máu không thể là ngày trong quá khứ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      setSubmitStatus('error');
      setSubmitMessage('Vui lòng đăng nhập để đăng ký hiến máu');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const payload: Partial<DonationCreatePayload> = {
        donationDate: formData.preferred_date
      };

      console.log('Token:', localStorage.getItem('authToken')); // Debug token
      console.log('Payload gửi đi:', JSON.stringify(payload, null, 2));

      await createDonation(localStorage.getItem('authToken') || '', formData.donation_type === 'event' ? formData.event_id : null, payload);

      setSubmitStatus('success');
      setSubmitMessage('Đăng ký hiến máu thành công! Chúng tôi sẽ liên hệ với bạn sớm.');

      setFormData({
        blood_type: '',
        donation_type: '',
        event_id: '',
        preferred_date: '',
        note: ''
      });
    } catch (error: any) {
      console.error('Lỗi chi tiết:', error.response ? error.response.data : error.message);
      setSubmitStatus('error');
      setSubmitMessage(
        error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau. Bạn cần đăng nhập để tạo đơn hiến máu. Cảm ơn bạn.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Kiểm tra token
  const token = localStorage.getItem('authToken');
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Cần đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để tạo yêu cầu hiến máu.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký hiến máu</h2>
        <p className="text-gray-600">Hãy cùng chúng tôi cứu sống những sinh mệnh quý giá</p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
          <p className="text-green-800">{submitMessage}</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
          <p className="text-red-800">{submitMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nhóm máu *
          </label>
          <select
            name="blood_type"
            value={formData.blood_type}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.blood_type ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          >
            <option value="">Chọn nhóm máu của bạn</option>
            {bloodTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.blood_type && <p className="mt-1 text-sm text-red-600">{errors.blood_type}</p>}
        </div> */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Heart className="w-4 h-4 inline mr-2" />
            Hình thức hiến máu *
          </label>
          <select
            name="donation_type"
            value={formData.donation_type}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.donation_type ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          >
            <option value="">Chọn hình thức hiến máu</option>
            {donationTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.donation_type && <p className="mt-1 text-sm text-red-600">{errors.donation_type}</p>}
        </div>

        {formData.donation_type === 'event' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Chọn sự kiện *
            </label>
            {isLoadingEvents ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">Đang tải danh sách sự kiện...</span>
              </div>
            ) : (
              <select
                name="event_id"
                value={formData.event_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.event_id ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">Chọn sự kiện hiến máu</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.date).toLocaleDateString('vi-VN')} - {event.location}
                  </option>
                ))}
              </select>
            )}
            {errors.event_id && <p className="mt-1 text-sm text-red-600">{errors.event_id}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Ngày hiến máu mong muốn *
          </label>
          <input
            type="date"
            name="preferred_date"
            value={formData.preferred_date}
            onChange={handleInputChange}
            min={getTodayDate()}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${errors.preferred_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.preferred_date && <p className="mt-1 text-sm text-red-600">{errors.preferred_date}</p>}
        </div>

        {/* <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Ghi chú
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            rows={4}
            placeholder="Thông tin bổ sung (tình trạng sức khỏe, yêu cầu đặc biệt...)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
          />
        </div> */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 mr-2" />
              Đăng ký hiến máu
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Bạn phải từ 18-60 tuổi và cân nặng tối thiểu 45kg</li>
          <li>• Không hiến máu nếu đang mắc bệnh hoặc dùng thuốc</li>
          <li>• Khoảng cách giữa 2 lần hiến máu tối thiểu 12 tuần</li>
          <li>• Mang theo CMND/CCCD khi đến hiến máu</li>
        </ul>
      </div>
    </div>
  );
};

export default BloodDonationForm;