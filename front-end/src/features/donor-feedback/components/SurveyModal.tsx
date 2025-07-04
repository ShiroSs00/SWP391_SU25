import React, { useState } from 'react';
import { X, Heart, CheckCircle } from 'lucide-react';
import type { SurveyResponse } from '../types/feedback.types';
import RatingStars from './RatingStars';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
  onSubmit: (survey: SurveyResponse) => Promise<void>;
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
    text: 'Bạn đánh giá như thế nào về trải nghiệm hiến máu tổng thể?',
    type: 'rating',
    required: true
  },
  {
    id: 'staff_friendliness',
    text: 'Nhân viên y tế có thân thiện và hỗ trợ tốt không?',
    type: 'rating',
    required: true
  },
  {
    id: 'comfort_level',
    text: 'Bạn cảm thấy thoải mái trong suốt quá trình hiến máu?',
    type: 'choice',
    options: ['Rất thoải mái', 'Thoải mái', 'Bình thường', 'Không thoải mái', 'Rất không thoải mái'],
    required: true
  },
  {
    id: 'waiting_time',
    text: 'Thời gian chờ đợi có hợp lý không?',
    type: 'choice',
    options: ['Rất hợp lý', 'Hợp lý', 'Chấp nhận được', 'Hơi lâu', 'Quá lâu'],
    required: true
  },
  {
    id: 'facility_cleanliness',
    text: 'Bạn đánh giá như thế nào về vệ sinh của cơ sở?',
    type: 'rating',
    required: true
  },
  {
    id: 'return_intention',
    text: 'Bạn có dự định hiến máu lại trong tương lai không?',
    type: 'choice',
    options: ['Chắc chắn sẽ hiến', 'Có thể sẽ hiến', 'Chưa chắc chắn', 'Có thể không', 'Chắc chắn không'],
    required: true
  },
  {
    id: 'additional_comments',
    text: 'Bạn có góp ý gì thêm để chúng tôi cải thiện dịch vụ không?',
    type: 'text',
    required: false
  }
];

export const SurveyModal: React.FC<SurveyModalProps> = ({
  isOpen,
  onClose,
  registrationId,
  onSubmit
}) => {
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleResponseChange = (questionId: string, value: string | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required questions
    const requiredQuestions = surveyQuestions.filter(q => q.required);
    const missingResponses = requiredQuestions.filter(q => !responses[q.id]);

    if (missingResponses.length > 0) {
      alert('Vui lòng trả lời tất cả các câu hỏi bắt buộc');
      setLoading(false);
      return;
    }

    try {
      const surveyData: SurveyResponse = {
        registrationId,
        questions: Object.entries(responses).map(([questionId, answer]) => ({
          questionId,
          answer
        })),
        additionalComments: responses.additional_comments as string || undefined
      };

      await onSubmit(surveyData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Cảm ơn bạn!
          </h3>
          <p className="text-gray-600 mb-6">
            Phản hồi của bạn rất có giá trị đối với chúng tôi và sẽ giúp cải thiện chất lượng dịch vụ hiến máu.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Khảo sát trải nghiệm hiến máu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="px-6 py-4">
            <p className="text-gray-600 mb-6">
              Chúng tôi rất mong nhận được phản hồi của bạn để cải thiện chất lượng dịch vụ hiến máu.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {surveyQuestions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {question.text}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {question.type === 'rating' && (
                    <RatingStars
                      rating={(responses[question.id] as number) || 0}
                      onRatingChange={(rating) => handleResponseChange(question.id, rating)}
                      size="md"
                    />
                  )}

                  {question.type === 'choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={responses[question.id] === option}
                            onChange={() => handleResponseChange(question.id, option)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'text' && (
                    <textarea
                      value={(responses[question.id] as string) || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      rows={3}
                      placeholder="Nhập góp ý của bạn..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi khảo sát'}
          </button>
        </div>
      </div>
    </div>
  );
};