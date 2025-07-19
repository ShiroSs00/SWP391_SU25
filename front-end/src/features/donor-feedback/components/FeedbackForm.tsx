import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle, Heart, Star, Info, Clock, RefreshCw } from 'lucide-react';
import RatingStars from './RatingStars';
import type { CreateFeedbackRequest, DonorFeedback } from '../types/feedback.types';
import { validateFeedbackForm, type ValidationError, sanitizeInput, formatErrorMessage } from '../utils/validation';
import { canSubmitFeedback, getFeedbackByRegistrationId } from '../services/feedback.service';
import toast from "react-hot-toast";

interface FeedbackFormProps {
  onSubmit: (data: CreateFeedbackRequest) => Promise<void>;
  initialData?: DonorFeedback,
  onSubmitSuccess?: () => void; // Callback khi gửi thành công
  loading?: boolean;
  registrationId: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  loading = false,
  onSubmitSuccess,
  initialData,
  registrationId,
}) => {
  const [formData, setFormData] = useState<CreateFeedbackRequest>({
    process: 0,
    bloodTest: 0,
    postDonationCare: 0,
    comfortable: 0,
    description: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [canSubmit, setCanSubmit] = useState<boolean | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [existingFeedback, setExistingFeedback] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  const ratingCategories = [
    {
      key: 'process' as keyof CreateFeedbackRequest,
      label: 'Quy trình hiến máu',
      description: 'Đánh giá về quy trình đăng ký, kiểm tra sức khỏe và hiến máu',
      icon: '🩺',
    },
    {
      key: 'bloodTest' as keyof CreateFeedbackRequest,
      label: 'Xét nghiệm máu',
      description: 'Đánh giá về quá trình xét nghiệm và thông báo kết quả',
      icon: '🔬',
    },
    {
      key: 'postDonationCare' as keyof CreateFeedbackRequest,
      label: 'Chăm sóc sau hiến máu',
      description: 'Đánh giá về việc chăm sóc và hướng dẫn sau khi hiến máu',
      icon: '💊',
    },
    {
      key: 'comfortable' as keyof CreateFeedbackRequest,
      label: 'Sự thoải mái',
      description: 'Đánh giá về môi trường, cơ sở vật chất và sự thoải mái',
      icon: '🏥',
    },
  ];

  // Check if user can submit feedback
  const checkFeedbackEligibility = async () => {
    try {
      setCheckingEligibility(true);
      setRetryCount(0);
      
      
      // Check if feedback already exists
      const existing = await getFeedbackByRegistrationId(registrationId);
      if (existing) {
        setExistingFeedback(existing);
        setCanSubmit(false);
        return;
      }

      // Check if user can submit feedback
      const eligibility = await canSubmitFeedback(registrationId);
      setCanSubmit(eligibility.canSubmit);
      
      if (!eligibility.canSubmit && eligibility.reason) {
        toast.error(eligibility.reason);
      }
    } catch (error: any) {
      console.error('Error checking feedback eligibility:', error);
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
      setCanSubmit(false);
      setRetryCount(prev => prev + 1);
    } finally {
      setCheckingEligibility(false);
    }
  };


  useEffect(() => {
    if (registrationId) {
      checkFeedbackEligibility();
    }

    if(initialData){
      setFormData({
        process: initialData.process || 0,
        bloodTest: initialData.bloodTest || 0,
        postDonationCare: initialData.postDonationCare || 0,
        comfortable: initialData.comfortable || 0,
        description: initialData.description || "",
      })
    }
  }, [registrationId, initialData]);

  const handleRatingChange = (category: keyof CreateFeedbackRequest, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: rating,
    }));
    
    // Clear error for this field when user makes a selection
    setErrors(prev => prev.filter(error => error.field !== category));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData(prev => ({
      ...prev,
      description: sanitizedValue,
    }));
    
    // Clear error when user starts typing
    if (sanitizedValue.trim().length > 0) {
      setErrors(prev => prev.filter(error => error.field !== 'description'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateFeedbackForm(formData);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      // Scroll to first error
      const firstErrorField = document.querySelector(`[data-field="${validationErrors[0].field}"]`);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Vui lòng kiểm tra và điền đầy đủ thông tin');
      return;
    }

    try {
      await onSubmit(formData);
      setSubmitted(true);
      toast.success('Gửi feedback thành công!');
    } catch (error: any) {
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleRetry = () => {
    checkFeedbackEligibility();
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  const getRatingText = (rating: number): string => {
    if (rating === 0) return 'Chưa đánh giá';
    if (rating === 1) return 'Rất không hài lòng';
    if (rating === 2) return 'Không hài lòng';
    if (rating === 3) return 'Bình thường';
    if (rating === 4) return 'Hài lòng';
    if (rating === 5) return 'Rất hài lòng';
    return '';
  };

  const averageRating = (
    formData.process + 
    formData.bloodTest + 
    formData.postDonationCare + 
    formData.comfortable
  ) / 4;

  const isFormValid = () => {
    return formData.process > 0 && 
           formData.bloodTest > 0 && 
           formData.postDonationCare > 0 && 
           formData.comfortable > 0 && 
           formData.description.trim().length >= 10;
  };

  // Loading state while checking eligibility
  if (checkingEligibility) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Clock className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Đang kiểm tra thông tin...
            </h2>
            <p className="text-gray-600">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show existing feedback
  if (existingFeedback) {
    const existingAverage = (
      existingFeedback.process + 
      existingFeedback.bloodTest + 
      existingFeedback.postDonationCare + 
      existingFeedback.comfortable
    ) / 4;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <div className="text-center text-white">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Bạn đã gửi feedback
              </h2>
              <p className="text-blue-100">
                Cảm ơn bạn đã chia sẻ trải nghiệm hiến máu
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Thông tin đăng ký</h3>
                  <p className="text-sm text-blue-700">Mã đăng ký: <span className="font-mono font-medium">{registrationId}</span></p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900">Đánh giá của bạn</h3>
                  <p className="text-sm text-yellow-700">
                    Điểm trung bình: <span className="font-bold">{existingAverage.toFixed(1)}/5</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ratingCategories.map((category) => (
                  <div key={category.key} className="flex items-center justify-between">
                    <span className="text-sm text-yellow-800">{category.label}:</span>
                    <div className="flex items-center gap-2">
                      <RatingStars 
                        rating={existingFeedback[category.key]} 
                        readonly 
                        size="sm" 
                      />
                      <span className="text-sm font-medium text-yellow-900">
                        {existingFeedback[category.key] || 0}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Mô tả chi tiết:</h4>
              <p className="text-gray-700 leading-relaxed">{existingFeedback.description}</p>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-full">
                <Heart className="w-5 h-5" />
                <span className="font-medium">Cảm ơn bạn đã hiến máu cứu người!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cannot submit feedback with retry option
  if (canSubmit === false && !existingFeedback) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6">
            <div className="text-center text-white">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Không thể gửi feedback
              </h2>
              <p className="text-orange-100">
                Bạn chưa đủ điều kiện để gửi feedback cho lần hiến máu này
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">Lưu ý</h3>
                  <p className="text-orange-700">
                    Bạn chỉ có thể gửi feedback sau khi hoàn thành quá trình hiến máu
                  </p>
                </div>
              </div>
            </div>

            {retryCount > 0 && (
              <div className="text-center">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Thử lại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
            <div className="text-center text-white">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Cảm ơn bạn đã gửi feedback!
              </h2>
              <p className="text-green-100">
                Phản hồi của bạn rất quan trọng và sẽ giúp chúng tôi cải thiện chất lượng dịch vụ.
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Thông tin đăng ký</h3>
                  <p className="text-sm text-blue-700">Mã đăng ký: <span className="font-mono font-medium">{registrationId}</span></p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900">Đánh giá của bạn</h3>
                  <p className="text-sm text-yellow-700">
                    Điểm trung bình: <span className="font-bold">{averageRating.toFixed(1)}/5</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-full">
                <Heart className="w-5 h-5" />
                <span className="font-medium">Cảm ơn bạn đã hiến máu cứu người!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main feedback form
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 px-8 py-8">
          <div className="text-center text-white">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Đánh giá trải nghiệm hiến máu
            </h2>
            <p className="text-red-100 text-lg">
              Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Thông tin đăng ký hiến máu</h3>
                  <p className="text-blue-700">
                    Mã đăng ký: <span className="font-mono font-medium bg-blue-100 px-2 py-1 rounded">{registrationId}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {ratingCategories.map((category, index) => (
              <div 
                key={category.key} 
                className="border-b border-gray-100 pb-8 last:border-b-0"
                data-field={category.key}
              >
                <div className="mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-2xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {index + 1}. {category.label}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <RatingStars
                        rating={formData[category.key] as number}
                        onRatingChange={(rating) => handleRatingChange(category.key, rating)}
                        size="lg"
                      />
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {Number(formData[category.key]) > 0 ? `${formData[category.key]}/5` : 'Chưa đánh giá'}
                        </div>
                        <div className="text-gray-500">
                          {getRatingText(formData[category.key] as number)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {getFieldError(category.key) && (
                    <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{getFieldError(category.key)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10" data-field="description">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                6. Mô tả chi tiết cảm nhận
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Chia sẻ thêm về trải nghiệm của bạn, những điều bạn thích hoặc muốn cải thiện
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Nhập mô tả chi tiết về trải nghiệm hiến máu của bạn..."
                className={`
                  w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none
                  transition-all duration-200 bg-white
                  ${getFieldError('description') ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
                `}
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-3">
                <div>
                  {getFieldError('description') && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{getFieldError('description')}</span>
                    </div>
                  )}
                </div>
                <span className={`text-sm ${formData.description.length > 900 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                  {formData.description.length}/1000
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`
                group flex items-center gap-3 px-10 py-4 font-bold text-lg rounded-xl 
                focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50
                transition-all duration-200 shadow-lg transform
                ${loading || !isFormValid()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover:shadow-xl hover:scale-105 active:scale-95'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang gửi feedback...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                  Gửi feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;