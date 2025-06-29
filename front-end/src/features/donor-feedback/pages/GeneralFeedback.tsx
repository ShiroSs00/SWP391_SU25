import React, { useState } from 'react';
import { Heart, Send, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { FeedbackCategory } from '../types/feedback.types';
import { useFeedback } from '../hooks/useFeedback';
import  RatingStars  from '../components/RatingStars';
import type { CreateFeedbackRequest } from '../types/feedback.types';

interface QuestionSection {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    text: string;
    type: 'rating' | 'choice' | 'text';
    options?: string[];
    required?: boolean;
  }[];
}

const questionSections: QuestionSection[] = [
  {
    id: 'overall',
    title: 'Đánh giá tổng thể',
    description: 'Chia sẻ cảm nhận chung về cơ sở hiến máu',
    questions: [
      {
        id: 'overall_rating',
        text: 'Bạn đánh giá như thế nào về cơ sở hiến máu này?',
        type: 'rating',
        required: true
      },
      {
        id: 'recommendation',
        text: 'Bạn có sẵn sàng giới thiệu bạn bè đến hiến máu tại đây không?',
        type: 'choice',
        options: ['Chắc chắn có', 'Có thể', 'Không chắc', 'Có thể không', 'Chắc chắn không'],
        required: true
      }
    ]
  },
  {
    id: 'service',
    title: 'Dịch vụ và nhân viên',
    description: 'Góp ý về chất lượng phục vụ',
    questions: [
      {
        id: 'staff_attitude',
        text: 'Thái độ phục vụ của nhân viên như thế nào?',
        type: 'choice',
        options: ['Rất tốt', 'Tốt', 'Bình thường', 'Cần cải thiện', 'Không hài lòng']
      },
      {
        id: 'staff_professional',
        text: 'Nhân viên có chuyên nghiệp và am hiểu không?',
        type: 'choice',
        options: ['Rất chuyên nghiệp', 'Chuyên nghiệp', 'Bình thường', 'Chưa chuyên nghiệp', 'Không chuyên nghiệp']
      },
      {
        id: 'service_speed',
        text: 'Tốc độ phục vụ có phù hợp không?',
        type: 'choice',
        options: ['Rất nhanh', 'Phù hợp', 'Bình thường', 'Hơi chậm', 'Quá chậm']
      }
    ]
  },
  {
    id: 'facility',
    title: 'Cơ sở vật chất',
    description: 'Đánh giá về không gian và trang thiết bị',
    questions: [
      {
        id: 'cleanliness',
        text: 'Mức độ sạch sẽ của cơ sở?',
        type: 'choice',
        options: ['Rất sạch sẽ', 'Sạch sẽ', 'Bình thường', 'Cần vệ sinh thêm', 'Không sạch sẽ']
      },
      {
        id: 'comfort',
        text: 'Không gian có thoải mái không?',
        type: 'choice',
        options: ['Rất thoải mái', 'Thoải mái', 'Bình thường', 'Hơi chật', 'Không thoải mái']
      },
      {
        id: 'equipment',
        text: 'Trang thiết bị y tế có hiện đại không?',
        type: 'choice',
        options: ['Rất hiện đại', 'Hiện đại', 'Bình thường', 'Cũ kỹ', 'Cần thay mới']
      }
    ]
  },
  {
    id: 'process',
    title: 'Quy trình hiến máu',
    description: 'Chia sẻ về trải nghiệm quy trình',
    questions: [
      {
        id: 'registration_ease',
        text: 'Quy trình đăng ký có dễ dàng không?',
        type: 'choice',
        options: ['Rất dễ', 'Dễ', 'Bình thường', 'Hơi phức tạp', 'Phức tạp']
      },
      {
        id: 'waiting_time',
        text: 'Thời gian chờ đợi có hợp lý không?',
        type: 'choice',
        options: ['Rất hợp lý', 'Hợp lý', 'Chấp nhận được', 'Hơi lâu', 'Quá lâu']
      },
      {
        id: 'information_clarity',
        text: 'Thông tin hướng dẫn có rõ ràng không?',
        type: 'choice',
        options: ['Rất rõ ràng', 'Rõ ràng', 'Bình thường', 'Chưa rõ', 'Không rõ ràng']
      }
    ]
  },
  {
    id: 'suggestions',
    title: 'Góp ý và đề xuất',
    description: 'Chia sẻ ý kiến để cải thiện dịch vụ',
    questions: [
      {
        id: 'improvement_areas',
        text: 'Bạn nghĩ cần cải thiện những gì? (có thể chọn nhiều)',
        type: 'choice',
        options: [
          'Thái độ phục vụ',
          'Tốc độ xử lý',
          'Vệ sinh cơ sở',
          'Trang thiết bị',
          'Quy trình đăng ký',
          'Thông tin hướng dẫn',
          'Không gian chờ',
          'Dịch vụ hỗ trợ',
          'Khác'
        ]
      },
      {
        id: 'additional_services',
        text: 'Bạn mong muốn có thêm dịch vụ nào?',
        type: 'text'
      },
      {
        id: 'detailed_feedback',
        text: 'Góp ý chi tiết khác (nếu có)',
        type: 'text'
      }
    ]
  }
];

export const GeneralFeedback: React.FC = () => {
  const { createFeedback, loading } = useFeedback();
  const [submitted, setSubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overall']));
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    isAnonymous: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const handleContactInfoChange = (field: string, value: any) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required questions
    questionSections.forEach(section => {
      section.questions.forEach(question => {
        if (question.required && !responses[question.id]) {
          newErrors[question.id] = 'Câu hỏi này là bắt buộc';
        }
      });
    });

    // Validate contact info if not anonymous
    if (!contactInfo.isAnonymous) {
      if (!contactInfo.name.trim()) {
        newErrors.name = 'Vui lòng nhập họ tên';
      }
      if (!contactInfo.email.trim()) {
        newErrors.email = 'Vui lòng nhập email';
      } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const generalFeedbackId = `general-${Date.now()}`;
      
      // Combine all responses into a detailed comment
      let detailedComment = 'PHẢN HỒI TỔNG HỢP:\n\n';
      
      questionSections.forEach(section => {
        const sectionResponses = section.questions
          .filter(q => responses[q.id])
          .map(q => `• ${q.text}: ${responses[q.id]}`)
          .join('\n');
        
        if (sectionResponses) {
          detailedComment += `${section.title.toUpperCase()}:\n${sectionResponses}\n\n`;
        }
      });

      const feedbackRequest: CreateFeedbackRequest = {
        registrationId: generalFeedbackId,
        rating: responses.overall_rating || 5,
        comment: detailedComment.trim(),
        category: FeedbackCategory.GENERAL_SUGGESTION,
        isAnonymous: contactInfo.isAnonymous
      };

      await createFeedback(generalFeedbackId, feedbackRequest);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const getCompletionPercentage = () => {
    const totalQuestions = questionSections.reduce((sum, section) => sum + section.questions.length, 0);
    const answeredQuestions = Object.keys(responses).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cảm ơn bạn đã góp ý!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Góp ý của bạn rất có giá trị và sẽ giúp chúng tôi cải thiện chất lượng dịch vụ hiến máu. 
            Chúng tôi sẽ xem xét kỹ lưỡng và áp dụng những đề xuất phù hợp.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setResponses({});
              setContactInfo({ name: '', email: '', phone: '', isAnonymous: false });
              setCurrentSection(0);
              setExpandedSections(new Set(['overall']));
            }}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Gửi góp ý khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Góp ý về cơ sở hiến máu
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chia sẻ trải nghiệm và góp ý của bạn để giúp chúng tôi cải thiện chất lượng dịch vụ hiến máu
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Tiến độ hoàn thành</span>
            <span className="text-sm font-medium text-red-600">{getCompletionPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Sections */}
          {questionSections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6 space-y-6">
                  {section.questions.map((question) => (
                    <div key={question.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {question.text}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {question.type === 'rating' && (
                        <div className="flex flex-col items-start space-y-2">
                          <RatingStars
                            rating={responses[question.id] || 0}
                            onRatingChange={(rating) => handleResponseChange(question.id, rating)}
                            size="lg"
                            showText
                          />
                        </div>
                      )}

                      {question.type === 'choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={responses[question.id] === option}
                                onChange={() => handleResponseChange(question.id, option)}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <span className="ml-3 text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {question.type === 'text' && (
                        <textarea
                          value={responses[question.id] || ''}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          rows={3}
                          placeholder="Nhập góp ý của bạn..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        />
                      )}

                      {errors[question.id] && (
                        <p className="mt-1 text-sm text-red-600">{errors[question.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={contactInfo.isAnonymous}
                  onChange={(e) => handleContactInfoChange('isAnonymous', e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Gửi góp ý ẩn danh</span>
              </label>
            </div>

            {!contactInfo.isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => handleContactInfoChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang gửi góp ý...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Gửi góp ý
                </>
              )}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Mọi góp ý của bạn đều được chúng tôi ghi nhận và xem xét kỹ lưỡng. 
            <br />
            Cảm ơn bạn đã đóng góp vào việc cải thiện dịch vụ hiến máu!
          </p>
        </div>
      </div>
    </div>
  );
};