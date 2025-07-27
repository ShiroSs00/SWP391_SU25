import React, { useState } from 'react';
import { Calendar, Heart, User, FileText, Loader2, CheckCircle, AlertCircle, MapPin, Clock, Users, Info, HelpCircle, Droplets, Shield, Award } from 'lucide-react';
import { createDonation } from '../hooks/useBloodDonation';
import type { DonationCreatePayload } from '../types/donations-register.types';
import type { AdminEvent } from '../../admin/types/admin.types';

interface Event {
  eventId: string;
  nameOfEvent: string;
  eventDate: string;
  location: string;
}

interface DonationCreateProps {
  events: AdminEvent[];
  accountId: string;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  hideStatus?: boolean;
}

interface FormData {
  bloodType: string;
  donationType: string;
  eventId: string;
  donationDate: string;
  note: string;
}

interface FormErrors {
  bloodType?: string;
  donationType?: string;
  eventId?: string;
  donationDate?: string;
}

const DonationCreate: React.FC<DonationCreateProps> = ({ 
  events, 
  accountId, 
  showToast, 
  hideStatus = false 
}) => {
  const [formData, setFormData] = useState<FormData>({
    bloodType: '',
    donationType: '',
    eventId: '',
    donationDate: '',
    note: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showBloodTypeGuide, setShowBloodTypeGuide] = useState(false);
  const [showBenefitsInfo, setShowBenefitsInfo] = useState(false);

  const bloodTypes = [
    { value: 'A+', label: 'A+', color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200', description: 'Có thể hiến cho A+, AB+', compatibility: 'Tương thích với 34% dân số', rarity: 'Phổ biến' },
    { value: 'A-', label: 'A-', color: 'bg-red-200 text-red-900 border-red-300 hover:bg-red-300', description: 'Có thể hiến cho A+, A-, AB+, AB-', compatibility: 'Tương thích với 42% dân số', rarity: 'Ít gặp' },
    { value: 'B+', label: 'B+', color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200', description: 'Có thể hiến cho B+, AB+', compatibility: 'Tương thích với 21% dân số', rarity: 'Phổ biến' },
    { value: 'B-', label: 'B-', color: 'bg-blue-200 text-blue-900 border-blue-300 hover:bg-blue-300', description: 'Có thể hiến cho B+, B-, AB+, AB-', compatibility: 'Tương thích với 23% dân số', rarity: 'Hiếm' },
    { value: 'AB+', label: 'AB+', color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200', description: 'Chỉ hiến cho AB+', compatibility: 'Người nhận vạn năng', rarity: 'Hiếm nhất' },
    { value: 'AB-', label: 'AB-', color: 'bg-purple-200 text-purple-900 border-purple-300 hover:bg-purple-300', description: 'Có thể hiến cho AB+, AB-', compatibility: 'Rất quý hiếm', rarity: 'Cực hiếm' },
    { value: 'O+', label: 'O+', color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200', description: 'Có thể hiến cho tất cả nhóm máu dương', compatibility: 'Hiến cho 85% dân số', rarity: 'Phổ biến nhất' },
    { value: 'O-', label: 'O-', color: 'bg-green-200 text-green-900 border-green-300 hover:bg-green-300', description: 'Hiến cho tất cả nhóm máu', compatibility: 'Người hiến vạn năng', rarity: 'Quý giá nhất' }
  ];

  const donationTypes = [
    { value: 'event', label: 'Tham gia sự kiện', description: 'Hiến máu tại các sự kiện được tổ chức', benefits: ['Có bác sĩ chuyên khoa', 'Môi trường an toàn', 'Nhiều người tham gia'], icon: Calendar, color: 'border-blue-500 bg-blue-50' },
    { value: 'voluntary', label: 'Hiến máu tự nguyện', description: 'Đăng ký hiến máu theo lịch trình cá nhân', benefits: ['Linh hoạt thời gian', 'Tư vấn riêng biệt', 'Ưu tiên xử lý'], icon: Heart, color: 'border-red-500 bg-red-50' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // if (!formData.bloodType) {
    //   newErrors.bloodType = 'Vui lòng chọn nhóm máu của bạn';
    // }

    if (!formData.donationType) {
      newErrors.donationType = 'Vui lòng chọn hình thức hiến máu';
    }

    if (formData.donationType === 'event' && !formData.eventId) {
      newErrors.eventId = 'Vui lòng chọn sự kiện hiến máu';
    }

    if (!formData.donationDate) {
      newErrors.donationDate = 'Vui lòng chọn ngày hiến máu mong muốn';
    } else {
      const selectedDate = new Date(formData.donationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.donationDate = 'Ngày hiến máu không thể là ngày trong quá khứ';
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

    if (name === 'donationType' && value !== 'event') {
      setFormData(prev => ({
        ...prev,
        eventId: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const payload: Partial<DonationCreatePayload> = {
        donationDate: formData.donationDate,
      };

      console.log('Token:', localStorage.getItem('token')); // Debug token
      console.log('Payload gửi đi:', JSON.stringify(payload, null, 2));

      await createDonation(localStorage.getItem('token') || '', formData.donationType === 'event' ? formData.eventId : null, payload);

      setSubmitStatus('success');
      showToast('🎉 Đăng ký hiến máu thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');

      setFormData({
        bloodType: '',
        donationType: '',
        eventId: '',
        donationDate: '',
        note: ''
      });
    } catch (error: any) {
      console.error('Lỗi chi tiết:', error.response ? error.response.data : error.message);
      setSubmitStatus('error');
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.';
      showToast(`❌ ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
                <div className="relative p-6 bg-white bg-opacity-10 rounded-full backdrop-blur-sm">
                  <Droplets className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Hiến máu cứu người</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              Mỗi giọt máu của bạn có thể cứu sống 3 người. Hãy cùng chúng tôi lan tỏa yêu thương và mang lại hy vọng cho những sinh mệnh quý giá.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Info className="w-6 h-6 mr-3" />
                    Tìm hiểu nhóm máu của bạn
                  </h2>
                  <p className="text-blue-100 mt-2">Không biết nhóm máu? Đừng lo lắng, chúng tôi sẽ giúp bạn!</p>
                </div>
                <button
                  onClick={() => setShowBloodTypeGuide(!showBloodTypeGuide)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showBloodTypeGuide && (
              <div className="p-8 bg-blue-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cách xác định nhóm máu:</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Kiểm tra giấy tờ y tế (bệnh án, kết quả xét nghiệm cũ)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Hỏi gia đình (cha mẹ, anh chị em)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Xét nghiệm tại bệnh viện hoặc phòng khám</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Chúng tôi sẽ xét nghiệm miễn phí khi bạn đến hiến máu</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tại sao cần biết nhóm máu?</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Đảm bảo an toàn cho người nhận máu</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Tối ưu hóa việc phân phối máu</span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Chuẩn bị tốt nhất cho quá trình hiến máu</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FileText className="w-6 h-6 mr-3" />
              Đăng ký hiến máu
            </h2>
            <p className="text-red-100 mt-2">Vui lòng điền đầy đủ thông tin để hoàn tất đăng ký</p>
          </div>

          {!hideStatus && submitStatus === 'success' && (
            <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center animate-slide-down">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-semibold">Đăng ký thành công!</p>
                <p className="text-green-700 text-sm">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
              </div>
            </div>
          )}

          {!hideStatus && submitStatus === 'error' && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center animate-slide-down">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-semibold">Có lỗi xảy ra!</p>
                <p className="text-red-700 text-sm">Vui lòng kiểm tra lại thông tin và thử lại.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-xl font-bold text-gray-800">
                  <Droplets className="w-6 h-6 inline mr-3 text-red-500" />
                  Nhóm máu của bạn *
                </label>
                <div className="text-sm text-gray-500">
                  Không biết? 
                  <button 
                    type="button"
                    onClick={() => setShowBloodTypeGuide(true)}
                    className="text-blue-600 hover:text-blue-700 ml-1 underline"
                  >
                    Xem hướng dẫn
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bloodTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'bloodType', value: type.value } } as any)}
                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      formData.bloodType === type.value
                        ? `${type.color} border-current shadow-lg scale-105`
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">{type.label}</div>
                      <div className="text-xs text-gray-600 mb-2">{type.rarity}</div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg p-3 whitespace-nowrap shadow-lg">
                          <div className="font-semibold">{type.description}</div>
                          <div className="text-gray-300">{type.compatibility}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-800">
                    <p className="font-semibold">Không biết nhóm máu của mình?</p>
                    <p className="text-sm mt-1">Đừng lo lắng! Chúng tôi sẽ xét nghiệm miễn phí và thông báo kết quả cho bạn khi đến hiến máu.</p>
                  </div>
                </div>
              </div>
              
              {errors.bloodType && (
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.bloodType}
                </p>
              )}
            </div> */}

            <div className="space-y-6">
              <label className="block text-xl font-bold text-gray-800">
                <Heart className="w-6 h-6 inline mr-3 text-red-500" />
                Hình thức hiến máu *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {donationTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'donationType', value: type.value } } as any)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-left ${
                        formData.donationType === type.value
                          ? `${type.color} shadow-lg scale-105`
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <IconComponent className={`w-8 h-8 mr-4 ${
                          formData.donationType === type.value ? 'text-current' : 'text-gray-500'
                        }`} />
                        <span className="text-xl font-bold">{type.label}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{type.description}</p>
                      <div className="space-y-2">
                        {type.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.donationType && (
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.donationType}
                </p>
              )}
            </div>

            {formData.donationType === 'event' && (
              <div className="space-y-6 animate-slide-down">
                <label className="block text-xl font-bold text-gray-800">
                  <Calendar className="w-6 h-6 inline mr-3 text-red-500" />
                  Chọn sự kiện hiến máu *
                </label>
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">Hiện tại chưa có sự kiện nào được tổ chức</p>
                      <p className="text-gray-400 text-sm mt-2">Vui lòng chọn "Hiến máu tự nguyện" hoặc quay lại sau</p>
                    </div>
                  ) : (
                    events.map(event => (
                      <button
                        key={event.eventId}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: 'eventId', value: event.eventId } } as any)}
                        className={`w-full p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-left ${
                          formData.eventId === event.eventId
                            ? 'border-red-500 bg-red-50 shadow-lg scale-105'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">{event.nameOfEvent}</h3>
                            <div className="space-y-2">
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{new Date(event.creationDate).toLocaleDateString('vi-VN', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {formData.eventId === event.eventId && (
                            <CheckCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
                {errors.eventId && (
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.eventId}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-xl font-bold text-gray-800">
                <Calendar className="w-6 h-6 inline mr-3 text-red-500" />
                Ngày hiến máu mong muốn *
              </label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleInputChange}
                min={getTodayDate()}
                className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-lg ${
                  errors.donationDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.donationDate && (
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.donationDate}
                </p>
              )}
            </div>

            {/* <div className="space-y-4">
              <label className="block text-xl font-bold text-gray-800">
                <FileText className="w-6 h-6 inline mr-3 text-red-500" />
                Ghi chú thêm
              </label>
              <textarea
                name="note" 
                value={formData.note}
                onChange={handleInputChange}
                rows={4}
                placeholder="Chia sẻ thêm về tình trạng sức khỏe, yêu cầu đặc biệt hoặc câu hỏi của bạn..."
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 resize-none text-lg"
              />
            </div> */}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-8 rounded-xl transition-all duration-200 flex items-center justify-center text-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    Đang xử lý đăng ký...
                  </>
                ) : (
                  <>
                    <Heart className="w-6 h-6 mr-3" />
                    Đăng ký hiến máu ngay
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Award className="w-6 h-6 mr-3" />
                    Lợi ích khi hiến máu
                  </h2>
                  <p className="text-green-100 mt-2">Hiến máu không chỉ cứu người mà còn tốt cho chính bạn</p>
                </div>
                <button
                  onClick={() => setShowBenefitsInfo(!showBenefitsInfo)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  {showBenefitsInfo ? 'Thu gọn' : 'Xem thêm'}
                </button>
              </div>
            </div>

            {showBenefitsInfo && (
              <div className="p-8 bg-green-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Heart className="w-5 h-5 text-red-500 mr-2" />
                      Lợi ích sức khỏe
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Giảm nguy cơ bệnh tim mạch</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Kích thích tạo máu mới</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Kiểm tra sức khỏe miễn phí</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Đốt cháy calories</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Users className="w-5 h-5 text-blue-500 mr-2" />
                      Lợi ích xã hội
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Cứu sống 3 người/lần hiến</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Góp phần xây dựng cộng đồng</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Kết nối với người khác</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Tạo cảm giác hạnh phúc</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Award className="w-5 h-5 text-yellow-500 mr-2" />
                      Ưu đãi đặc biệt
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Giấy chứng nhận hiến máu</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Ưu tiên cấp cứu khi cần</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Quà tặng tri ân</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>Tham gia cộng đồng hiến máu</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 mr-3" />
            Điều kiện và lưu ý quan trọng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-800 text-lg">Điều kiện hiến máu:</h4>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Tuổi từ 18-60, cân nặng tối thiểu 45kg</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Sức khỏe tốt, không mắc bệnh truyền nhiễm</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Không dùng thuốc kháng sinh trong 7 ngày</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Khoảng cách giữa 2 lần hiến máu tối thiểu 12 tuần</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-800 text-lg">Chuẩn bị trước khi hiến:</h4>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-start">
                  <Heart className="w-5 h-5 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>Mang theo CMND/CCCD gốc</span>
                </li>
                <li className="flex items-start">
                  <Heart className="w-5 h-5 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>Ăn uống đầy đủ, uống nhiều nước</span>
                </li>
                <li className="flex items-start">
                  <Heart className="w-5 h-5 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>Ngủ đủ giấc, không uống rượu bia</span>
                </li>
                <li className="flex items-start">
                  <Heart className="w-5 h-5 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                  <span>Thông báo tình trạng sức khỏe thật</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            Có thắc mắc? Liên hệ hotline: 
            <a href="tel:19008080" className="text-red-600 font-bold ml-2 hover:text-red-700 text-xl">
              1900 8080
            </a>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Hoặc email: 
            <a href="mailto:support@hienmaucucuoi.vn" className="text-blue-600 hover:text-blue-700 ml-1">
              support@hienmaucucuoi.vn
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default DonationCreate;