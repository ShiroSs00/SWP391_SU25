import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, AlertCircle, CheckCircle, ArrowLeft, Star, Clock } from 'lucide-react';
import FeedbackForm from '../components/FeedbackForm';
import RatingStars from '../components/RatingStars';
import { useFeedback } from '../hooks/useFeedback';
import type {CreateFeedbackRequest, DonorFeedback} from '../types/feedback.types';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';

const UserFeedbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const registrationId = searchParams.get('registrationId') || '';
  
  const [existingFeedback, setExistingFeedback] = useState<DonorFeedback | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { createFeedback, getFeedbackByRegistration, loading } = useFeedback();

  useEffect(() => {
    const checkExistingFeedback = async () => {
      if (!registrationId) {
        setError('Không tìm thấy mã đăng ký hiến máu');
        setCheckingExisting(false);
        return;
      }

      try {
        const feedback = await getFeedbackByRegistration(registrationId);
        setExistingFeedback(feedback);
      } catch (err) {
        console.error('Error checking existing feedback:', err);
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingFeedback();
  }, [registrationId, getFeedbackByRegistration]);

  const handleSubmitFeedback = async (data: CreateFeedbackRequest) => {
      await createFeedback(registrationId, data);
  };

  if (checkingExisting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang kiểm tra thông tin</h3>
          <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  if (error || !registrationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error || 'Không tìm thấy mã đăng ký hiến máu. Vui lòng kiểm tra lại đường link.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (existingFeedback) {
    const averageRating = (
      existingFeedback.process +
      existingFeedback.bloodTest +
      existingFeedback.postDonationCare +
      existingFeedback.comfortable +
      existingFeedback.overallSatisfaction
    ) / 5;

    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'pending':
          return { text: 'Chờ phản hồi', color: 'yellow', icon: Clock };
        case 'replied':
          return { text: 'Đã phản hồi', color: 'blue', icon: CheckCircle };
        case 'resolved':
          return { text: 'Đã giải quyết', color: 'green', icon: CheckCircle };
        default:
          return { text: 'Không xác định', color: 'gray', icon: AlertCircle };
      }
    };

    const statusInfo = getStatusInfo(existingFeedback.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Hệ thống Hiến máu
                </h1>
                <p className="text-sm text-gray-600">
                  Feedback đã được gửi
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-8">
              <div className="text-center text-white">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Bạn đã gửi feedback
                </h2>
                <p className="text-green-100 text-lg">
                  Cảm ơn bạn đã gửi feedback cho đợt hiến máu này. Mỗi đợt hiến máu chỉ được gửi feedback một lần.
                </p>
              </div>
            </div>
            
            <div className="p-8">
              {/* Registration Info */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">Thông tin đăng ký</h3>
                    <p className="text-sm text-blue-700">Mã đăng ký: <span className="font-mono font-medium">{registrationId}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <StatusIcon className="w-4 h-4" />
                    <span className="font-medium">Trạng thái: {statusInfo.text}</span>
                  </div>
                  <span>•</span>
                  <span>Gửi lúc: {formatDateTime(existingFeedback.createdAt)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(existingFeedback.createdAt)}</span>
                </div>
              </div>

              {/* Rating Summary */}
              <div className="bg-yellow-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-yellow-900">Đánh giá của bạn</h3>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={averageRating} readonly size="sm" />
                      <span className="text-sm text-yellow-700 font-medium">
                        {averageRating.toFixed(1)}/5 điểm
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Quy trình', value: existingFeedback.process, icon: '🩺' },
                    { label: 'Xét nghiệm', value: existingFeedback.bloodTest, icon: '🔬' },
                    { label: 'Chăm sóc', value: existingFeedback.postDonationCare, icon: '💊' },
                    { label: 'Thoải mái', value: existingFeedback.comfortable, icon: '🏥' },
                    { label: 'Tổng thể', value: existingFeedback.overallSatisfaction, icon: '⭐' },
                  ].map((category, index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg mb-1">{category.icon}</div>
                      <div className="text-xs text-yellow-700 mb-1">{category.label}</div>
                      <div className="flex justify-center mb-1">
                        <RatingStars rating={category.value} readonly size="sm" />
                      </div>
                      <div className="text-xs font-medium text-yellow-800">
                        {category.value}/5
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Content */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Nội dung feedback của bạn:</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {existingFeedback.description}
                </p>
              </div>

              {/* Staff Reply */}
              {existingFeedback.staffReply && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-900 mb-2">Phản hồi từ nhân viên</h4>
                      <p className="text-green-800 leading-relaxed whitespace-pre-wrap">
                        {existingFeedback.staffReply}
                      </p>
                      {existingFeedback.updatedAt && (
                        <div className="mt-3 text-xs text-green-600">
                          Phản hồi lúc: {formatDateTime(existingFeedback.updatedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Thank you message */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-full">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Cảm ơn bạn đã hiến máu cứu người!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hệ thống Hiến máu
              </h1>
              <p className="text-sm text-gray-600">
                Đánh giá trải nghiệm hiến máu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Chia sẻ trải nghiệm hiến máu của bạn
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Feedback của bạn rất quan trọng và sẽ giúp chúng tôi cải thiện chất lượng dịch vụ, 
            mang đến trải nghiệm tốt hơn cho những người hiến máu khác.
          </p>
        </div>

        <FeedbackForm
          onSubmit={handleSubmitFeedback}
          loading={loading}
          registrationId={registrationId}
        />

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-600" />
              <span className="text-xl font-bold text-gray-900">
                Cảm ơn bạn đã hiến máu cứu người!
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Mỗi giọt máu của bạn có thể cứu sống 3 người. Hành động cao đẹp của bạn đã mang lại hy vọng cho nhiều gia đình.
            </p>
            <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>1 đơn vị máu = 3 sinh mạng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Hiến máu an toàn & ý nghĩa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedbackPage;