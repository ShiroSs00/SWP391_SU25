import React, { useState } from 'react';
import { Heart, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import type { SurveyResponse } from '../types/feedback.types';
import { feedbackService } from '../services/feedback.service';
import  RatingStars from '../components/RatingStars';

interface SurveyPageProps {
  registrationId?: string;
}

interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'choice' | 'text';
  options?: string[];
  required: boolean;
}

const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'overall_experience',
    text: 'Bạn đánh giá như thế nào về trải nghiệm hiến máu tổng thể hôm nay?',
    type: 'rating',
    required: true
  },
  {
    id: 'staff_friendliness',
    text: 'Nhân viên y tế có thân thiện và chuyên nghiệp không?',
    type: 'rating',
    required: true
  },
  {
    id: 'registration_process',
    text: 'Quá trình đăng ký hiến máu có thuận tiện không?',
    type: 'choice',
    options: ['Rất thuận tiện', 'Thuận tiện', 'Bình thường', 'Không thuận tiện', 'Rất không thuận tiện'],
    required: true
  },
  {
    id: 'waiting_time',
    text: 'Thời gian chờ đợi từ khi đăng ký đến khi hiến máu?',
    type: 'choice',
    options: ['Dưới 15 phút', '15-30 phút', '30-45 phút', '45-60 phút', 'Trên 60 phút'],
    required: true
  },
  {
    id: 'facility_comfort',
    text: 'Bạn cảm thấy thoải mái với không gian và trang thiết bị?',
    type: 'rating',
    required: true
  },
  {
    id: 'hygiene_safety',
    text: 'Bạn đánh giá như thế nào về vệ sinh và an toàn?',
    type: 'rating',
    required: true
  },
  {
    id: 'information_clarity',
    text: 'Thông tin hướng dẫn trước và sau hiến máu có rõ ràng không?',
    type: 'choice',
    options: ['Rất rõ ràng', 'Rõ ràng', 'Tạm được', 'Không rõ ràng', 'Rất không rõ ràng'],
    required: true
  },
  {
    id: 'post_donation_care',
    text: 'Việc chăm sóc sau hiến máu (nghỉ ngơi, nước uống, bánh kẹo) có phù hợp không?',
    type: 'choice',
    options: ['Rất phù hợp', 'Phù hợp', 'Bình thường', 'Không phù hợp', 'Rất không phù hợp'],
    required: true
  },
  {
    id: 'return_intention',
    text: 'Bạn có dự định hiến máu lại trong tương lai không?',
    type: 'choice',
    options: ['Chắc chắn sẽ hiến', 'Rất có thể', 'Có thể', 'Không chắc', 'Không có ý định'],
    required: true
  },
  {
    id: 'recommendation',
    text: 'Bạn có sẵn sàng giới thiệu bạn bè, người thân tham gia hiến máu không?',
    type: 'choice',
    options: ['Chắc chắn sẽ giới thiệu', 'Có thể sẽ giới thiệu', 'Không chắc chắn', 'Có thể không', 'Chắc chắn không'],
    required: true
  },
  {
    id: 'improvement_suggestions',
    text: 'Bạn có góp ý gì để chúng tôi cải thiện dịch vụ hiến máu không?',
    type: 'text',
    required: false
  },
  {
    id: 'additional_comments',
    text: 'Bạn có muốn chia sẻ thêm gì về trải nghiệm hiến máu hôm nay không?',
    type: 'text',
    required: false
  }
];

export const SurveyPage: React.FC<SurveyPageProps> = ({ 
  registrationId = `survey-${Date.now()}` 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = surveyQuestions[currentStep];
  const isLastStep = currentStep === surveyQuestions.length - 1;
  const isFirstStep = currentStep === 0;

  const handleResponseChange = (questionId: string, value: string | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    return responses[currentQuestion.id] !== undefined && responses[currentQuestion.id] !== '';
  };

  const handleNext = () => {
    if (canProceed() && !isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setLoading(true);
    try {
      const surveyData: SurveyResponse = {
        registrationId,
        questions: Object.entries(responses).map(([questionId, answer]) => ({
          questionId,
          answer
        })),
        additionalComments: responses.additional_comments as string || undefined
      };

      await feedbackService.submitSurvey(surveyData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / surveyQuestions.length) * 100;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cảm ơn bạn rất nhiều!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Cảm ơn bạn đã dành thời gian hoàn thành khảo sát. Phản hồi của bạn rất có giá trị 
            và sẽ giúp chúng tôi cải thiện chất lượng dịch vụ hiến máu để phục vụ bạn và 
            cộng đồng tốt hơn.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Khảo sát trải nghiệm hiến máu
          </h1>
          <p className="text-gray-600">
            Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Câu hỏi {currentStep + 1} / {surveyQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(getProgressPercentage())}% hoàn thành
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentQuestion.text}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'rating' && (
              <div className="flex flex-col items-center space-y-4">
                <RatingStars
                  rating={(responses[currentQuestion.id] as number) || 0}
                  onRatingChange={(rating) => handleResponseChange(currentQuestion.id, rating)}
                  size="lg"
                />
                <div className="text-center">
                  {responses[currentQuestion.id] ? (
                    <p className="text-lg font-medium text-gray-700">
                      {responses[currentQuestion.id] === 1 && 'Rất không hài lòng'}
                      {responses[currentQuestion.id] === 2 && 'Không hài lòng'}
                      {responses[currentQuestion.id] === 3 && 'Bình thường'}
                      {responses[currentQuestion.id] === 4 && 'Hài lòng'}
                      {responses[currentQuestion.id] === 5 && 'Rất hài lòng'}
                    </p>
                  ) : (
                    <p className="text-gray-500">Nhấn vào sao để đánh giá</p>
                  )}
                </div>
              </div>
            )}

            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={responses[currentQuestion.id] === option}
                      onChange={() => handleResponseChange(currentQuestion.id, option)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <div>
                <textarea
                  value={(responses[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                  rows={4}
                  placeholder="Nhập câu trả lời của bạn..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {(responses[currentQuestion.id] as string || '').length}/500 ký tự
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Câu trước
          </button>

          <div className="text-sm text-gray-600">
            {surveyQuestions.filter(q => responses[q.id] !== undefined).length} / {surveyQuestions.length} câu đã trả lời
          </div>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gửi...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Hoàn thành
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Câu tiếp theo
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Tất cả thông tin của bạn sẽ được bảo mật và chỉ được sử dụng để cải thiện dịch vụ
          </p>
        </div>
      </div>
    </div>
  );
};