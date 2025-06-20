import React, { useState } from 'react';
import { ClipboardList, CheckCircle } from 'lucide-react';
import SurveyModal from '../components/SurveyModal';
import { useSurvey } from '../hooks/useFeedback';
import { formatDate } from '../../../utils/helpers';

const SurveyPage: React.FC = () => {
  const { surveys, loading, error, submitSurveyResponse } = useSurvey();
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [completedSurveys, setCompletedSurveys] = useState<Set<string>>(new Set());

  const handleSurveySubmit = async (surveyId: string, responses: any[]) => {
    await submitSurveyResponse(surveyId, responses);
    setCompletedSurveys(prev => new Set([...prev, surveyId]));
    setSelectedSurvey(null);
  };

  const activeSurveys = surveys.filter(survey => 
    survey.isActive && 
    (!survey.expiresAt || new Date(survey.expiresAt) > new Date())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khảo sát...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Khảo sát ý kiến
          </h1>
          <p className="text-gray-600">
            Tham gia khảo sát để giúp chúng tôi cải thiện dịch vụ hiến máu
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Surveys List */}
        <div className="space-y-6">
          {activeSurveys.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có khảo sát nào
              </h3>
              <p className="text-gray-600">
                Hiện tại không có khảo sát nào đang diễn ra. Vui lòng quay lại sau.
              </p>
            </div>
          ) : (
            activeSurveys.map(survey => {
              const isCompleted = completedSurveys.has(survey.id);
              
              return (
                <div key={survey.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ClipboardList className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {survey.title}
                        </h3>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {survey.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>{survey.questions.length} câu hỏi</span>
                        <span>•</span>
                        <span>Ước tính: {Math.ceil(survey.questions.length * 0.5)} phút</span>
                        {survey.expiresAt && (
                          <>
                            <span>•</span>
                            <span>Hết hạn: {formatDate(survey.expiresAt)}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {survey.targetAudience === 'all' ? 'Tất cả' : 
                           survey.targetAudience === 'first_time' ? 'Lần đầu hiến máu' :
                           survey.targetAudience === 'regular' ? 'Người hiến thường xuyên' : 'VIP'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Đã hoàn thành</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedSurvey(survey.id)}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                        >
                          Tham gia
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Survey Modal */}
        {selectedSurvey && (
          <SurveyModal
            survey={surveys.find(s => s.id === selectedSurvey)!}
            isOpen={!!selectedSurvey}
            onClose={() => setSelectedSurvey(null)}
            onSubmit={(responses) => handleSurveySubmit(selectedSurvey, responses)}
          />
        )}
      </div>
    </div>
  );
};

export default SurveyPage;