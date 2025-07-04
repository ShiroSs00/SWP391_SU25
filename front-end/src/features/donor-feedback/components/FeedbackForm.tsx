import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { FeedbackCategory } from '../types/feedback.types';
import type { CreateFeedbackRequest} from '../types/feedback.types';
interface FeedbackFormProps {
  registrationId: string;
  onSubmit: (feedback: CreateFeedbackRequest) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

interface FormData {
  fullName: string;
  age: string;
  email: string;
  phone: string;
  donationDate: string;
  donationLocation: string;
  overallExperience: number;
  staffFriendliness: number;
  facilityComfort: number;
  donationProcess: number;
  waitingTime: number;
  wouldDonateAgain: string;
  wouldRecommend: string;
  experienceDescription: string;
  suggestions: string;
  allowContact: boolean;
}

const initialFormData: FormData = {
  fullName: '',
  age: '',
  email: '',
  phone: '',
  donationDate: '',
  donationLocation: '',
  overallExperience: 0,
  staffFriendliness: 0,
  facilityComfort: 0,
  donationProcess: 0,
  waitingTime: 0,
  wouldDonateAgain: '',
  wouldRecommend: '',
  experienceDescription: '',
  suggestions: '',
  allowContact: false
};

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  registrationId,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRatingChange = (field: keyof FormData, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
  };

  const StarRating: React.FC<{ 
    value: number; 
    onChange: (rating: number) => void; 
    label: string;
  }> = ({ value, onChange, label }) => {
    return (
      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-2">{label}</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none hover:scale-110 transition-transform"
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.donationDate) newErrors.donationDate = 'Vui lòng chọn ngày';
    if (!formData.donationLocation.trim()) newErrors.donationLocation = 'Vui lòng nhập địa điểm';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const detailedComment = `
THÔNG TIN CÁ NHÂN:
- Họ tên: ${formData.fullName}
- Tuổi: ${formData.age}
- Email: ${formData.email}
- Số điện thoại: ${formData.phone}
- Ngày hiến máu: ${formData.donationDate}
- Địa điểm: ${formData.donationLocation}

ĐÁNH GIÁ TRẢI NGHIỆM:
- Đánh giá tổng thể: ${formData.overallExperience}/5 sao
- Thái độ nhân viên: ${formData.staffFriendliness}/5 sao
- Cơ sở vật chất: ${formData.facilityComfort}/5 sao
- Quy trình hiến máu: ${formData.donationProcess}/5 sao
- Thời gian chờ: ${formData.waitingTime}/5 sao

CÂU HỎI KHÁC:
- Bạn có muốn hiến máu lần tiếp theo không? ${formData.wouldDonateAgain}
- Bạn có muốn giới thiệu bạn bè hiến máu không? ${formData.wouldRecommend}

MÔ TẢ TRẢI NGHIỆM: ${formData.experienceDescription}
NHẬN XÉT KHÁC: ${formData.suggestions}
      `.trim();

      const feedbackRequest: CreateFeedbackRequest = {
        registrationId,
        rating: formData.overallExperience || 5,
        comment: detailedComment,
        category: FeedbackCategory.OVERALL_EXPERIENCE,
        isAnonymous: false
      };

      await onSubmit(feedbackRequest);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-2xl mx-auto">
      {/* Header with red background */}
      <div className="bg-red-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="w-6 h-6" />
          <div>
            <h3 className="text-xl font-semibold">Feedback Sau Hiến Máu</h3>
            <p className="text-red-100 text-sm">Chia sẻ trải nghiệm hiến máu của bạn để giúp chúng tôi cải thiện dịch vụ</p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 hover:bg-red-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên mình <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Nhập họ tên của bạn"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@example.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tuổi của bạn
            </label>
            <input
              type="text"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="Nhập tuổi của bạn"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Nhập số điện thoại"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày hiến máu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.donationDate}
              onChange={(e) => handleInputChange('donationDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.donationDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.donationDate && <p className="mt-1 text-sm text-red-600">{errors.donationDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa điểm hiến máu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.donationLocation}
              onChange={(e) => handleInputChange('donationLocation', e.target.value)}
              placeholder="Nơi bạn hiến máu (bệnh viện, trung tâm y tế...)"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.donationLocation ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.donationLocation && <p className="mt-1 text-sm text-red-600">{errors.donationLocation}</p>}
          </div>
        </div>

        {/* Rating Section */}
        <div>
          <h4 className="text-lg font-semibold text-red-600 mb-4">Đánh Giá Trải Nghiệm</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StarRating
              value={formData.overallExperience}
              onChange={(rating) => handleRatingChange('overallExperience', rating)}
              label="Đánh giá tổng thể"
            />
            <StarRating
              value={formData.staffFriendliness}
              onChange={(rating) => handleRatingChange('staffFriendliness', rating)}
              label="Thái độ nhân viên"
            />
            <StarRating
              value={formData.facilityComfort}
              onChange={(rating) => handleRatingChange('facilityComfort', rating)}
              label="Cơ sở vật chất"
            />
            <StarRating
              value={formData.donationProcess}
              onChange={(rating) => handleRatingChange('donationProcess', rating)}
              label="Quy trình hiến máu"
            />
            <StarRating
              value={formData.waitingTime}
              onChange={(rating) => handleRatingChange('waitingTime', rating)}
              label="Thời gian chờ đợi"
            />
          </div>
        </div>

        {/* Yes/No Questions */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bạn có muốn hiến máu lần tiếp theo không? <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wouldDonateAgain"
                  value="Có"
                  checked={formData.wouldDonateAgain === 'Có'}
                  onChange={(e) => handleInputChange('wouldDonateAgain', e.target.value)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Có</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wouldDonateAgain"
                  value="Không"
                  checked={formData.wouldDonateAgain === 'Không'}
                  onChange={(e) => handleInputChange('wouldDonateAgain', e.target.value)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Không</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wouldDonateAgain"
                  value="Có thể"
                  checked={formData.wouldDonateAgain === 'Có thể'}
                  onChange={(e) => handleInputChange('wouldDonateAgain', e.target.value)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Có thể</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bạn có muốn giới thiệu bạn bè hiến máu không? <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wouldRecommend"
                  value="Có"
                  checked={formData.wouldRecommend === 'Có'}
                  onChange={(e) => handleInputChange('wouldRecommend', e.target.value)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Có</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wouldRecommend"
                  value="Không"
                  checked={formData.wouldRecommend === 'Không'}
                  onChange={(e) => handleInputChange('wouldRecommend', e.target.value)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Không</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wouldRecommend"
                  value="Có thể"
                  checked={formData.wouldRecommend === 'Có thể'}
                  onChange={(e) => handleInputChange('wouldRecommend', e.target.value)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Có thể</span>
              </label>
            </div>
          </div>
        </div>

        {/* Text Areas */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả trải nghiệm
            </label>
            <textarea
              value={formData.experienceDescription}
              onChange={(e) => handleInputChange('experienceDescription', e.target.value)}
              placeholder="Mô tả chi tiết về trải nghiệm hiến máu của bạn"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét khác
            </label>
            <textarea
              value={formData.suggestions}
              onChange={(e) => handleInputChange('suggestions', e.target.value)}
              placeholder="Có điều gì bạn muốn chia sẻ thêm không?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Privacy Checkbox */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.allowContact}
              onChange={(e) => handleInputChange('allowContact', e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Tôi đồng ý để được liên hệ lại về các chương trình hiến máu trong tương lai
            </span>
          </label>
        </div>

        {/* Submit button */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang gửi...
              </>
            ) : (
              <>
                ❤️ Gửi Phản Hồi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};