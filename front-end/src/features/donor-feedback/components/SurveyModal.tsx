import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Survey, SurveyQuestion } from '../types/feedback.types';
import RatingStars from './RatingStars';
import { cn } from '../../../utils/helpers';

interface SurveyModalProps {
  survey: Survey;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (responses: { questionId: string; answer: string | number }[]) => Promise<void>;
}

const SurveyModal: React.FC<SurveyModalProps> = ({
  survey,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [responses, setResponses] = useState<{ [questionId: string]: string | number }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const sortedQuestions = survey.questions.sort((a, b) => a.order - b.order);
  const currentQuestion = sortedQuestions[currentStep];
  const isLastQuestion = currentStep === sortedQuestions.length - 1;

  const handleResponse = (questionId: string, answer: string | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.required) {
      return responses[currentQuestion.id] !== undefined && responses[currentQuestion.id] !== '';
    }
    return true;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }));
      
      await onSubmit(formattedResponses);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: SurveyQuestion) => {
    const currentResponse = responses[question.id];

    switch (question.type) {
      case 'rating':
        return (
          <div className="text-center">
            <RatingStars
              rating={typeof currentResponse === 'number' ? currentResponse : 0}
              onRatingChange={(rating) => handleResponse(question.id, rating)}
              size="lg"
              showLabel
            />
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentResponse === option}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'yes_no':
        return (
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => handleResponse(question.id, 'yes')}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
                currentResponse === 'yes'
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Có
            </button>
            <button
              type="button"
              onClick={() => handleResponse(question.id, 'no')}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
                currentResponse === 'no'
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Không
            </button>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={typeof currentResponse === 'string' ? currentResponse : ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            placeholder="Nhập câu trả lời của bạn..."
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{survey.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{survey.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isCompleted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cảm ơn bạn đã tham gia khảo sát!
              </h3>
              <p className="text-gray-600 mb-6">
                Phản hồi của bạn sẽ giúp chúng tôi cải thiện chất lượng dịch vụ.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Câu hỏi {currentStep + 1} / {sortedQuestions.length}</span>
                  <span>{Math.round(((currentStep + 1) / sortedQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / sortedQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              {currentQuestion && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                    {currentQuestion.question}
                    {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {renderQuestion(currentQuestion)}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                    currentStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  )}
                >
                  Quay lại
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-colors duration-200",
                    !canProceed() || isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  )}
                >
                  {isSubmitting ? 'Đang gửi...' : isLastQuestion ? 'Hoàn thành' : 'Tiếp theo'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;