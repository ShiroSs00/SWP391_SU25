import React, { useState, useEffect } from 'react';
import { User, Calendar, MessageSquare, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import type { Feedback, DonationInfo, CreateFeedbackRequest } from '../types/feedback.types';
import { useFeedback } from '../hooks/useFeedback';
import { FeedbackForm } from './FeedbackForm';
import { FeedbackCard } from './FeedbackCard';

interface PersonalInfoProps {
  donationHistory?: DonationInfo[];
}

// Mock donation history for demo - mỗi record đại diện cho một lần hiến máu với registrationId riêng
const mockDonationHistory: DonationInfo[] = [
  {
    id: 'REG001', // registrationId
    donationDate: '2024-01-15',
    location: 'Bệnh viện Chợ Rẫy',
    bloodType: 'O+',
    status: 'completed'
  },
  {
    id: 'REG002', // registrationId
    donationDate: '2023-12-10',
    location: 'Trung tâm Huyết học TP.HCM',
    bloodType: 'O+',
    status: 'completed'
  },
  {
    id: 'REG003', // registrationId
    donationDate: '2023-11-05',
    location: 'Bệnh viện Đại học Y Dược',
    bloodType: 'O+',
    status: 'completed'
  },
  {
    id: 'REG004', // registrationId
    donationDate: '2023-10-20',
    location: 'Bệnh viện Bình Dân',
    bloodType: 'O+',
    status: 'completed'
  },
  {
    id: 'REG005', // registrationId
    donationDate: '2023-09-15',
    location: 'Trung tâm Y tế Quận 1',
    bloodType: 'O+',
    status: 'pending'
  }
];

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ 
  donationHistory = mockDonationHistory 
}) => {
  const {  loading, error, createFeedback, getFeedbackByRegistration } = useFeedback();
  const [selectedDonation, setSelectedDonation] = useState<DonationInfo | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [donationFeedbacks, setDonationFeedbacks] = useState<Record<string, Feedback>>({});
  const [loadingFeedbacks, setLoadingFeedbacks] = useState<Record<string, boolean>>({});

  // Load existing feedbacks for each donation registration
  useEffect(() => {
    const loadFeedbacks = async () => {
      const feedbackPromises = donationHistory.map(async (donation) => {
        setLoadingFeedbacks(prev => ({ ...prev, [donation.id]: true }));
        try {
          const feedbackResult = await getFeedbackByRegistration(donation.id);
          // If feedbackResult is an array, take the first item; otherwise, use as is
          const feedback = Array.isArray(feedbackResult) ? feedbackResult[0] : feedbackResult;
          return feedback ? { registrationId: donation.id, feedback } : null;
        } catch {
          // Không có feedback cho registration này - đây là trường hợp bình thường
          return null;
        } finally {
          setLoadingFeedbacks(prev => ({ ...prev, [donation.id]: false }));
        }
      });

      const results = await Promise.all(feedbackPromises);
      const feedbackMap: Record<string, Feedback> = {};
      
      results.forEach(result => {
        if (result) {
          feedbackMap[result.registrationId] = result.feedback;
        }
      });

      setDonationFeedbacks(feedbackMap);
    };

    if (donationHistory.length > 0) {
      loadFeedbacks();
    }
  }, [donationHistory, getFeedbackByRegistration]);

  const handleCreateFeedback = (donation: DonationInfo) => {
    setSelectedDonation(donation);
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = async (feedbackData: CreateFeedbackRequest) => {
    if (!selectedDonation) return;

    try {
      const newFeedback = await createFeedback(selectedDonation.id, feedbackData);
      setDonationFeedbacks(prev => ({
        ...prev,
        [selectedDonation.id]: newFeedback
      }));
      setShowFeedbackForm(false);
      setSelectedDonation(null);
    } catch (error) {
      console.error('Error creating feedback:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Khác';
    }
  };

  if (loading && donationHistory.length > 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Lịch sử hiến máu của bạn</h2>
            <p className="text-gray-600">Quản lý phản hồi cho các lần hiến máu theo mã đăng ký (Registration ID)</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Tổng lần hiến máu</p>
                <p className="text-2xl font-bold text-blue-900">{donationHistory.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Đã có phản hồi</p>
                <p className="text-2xl font-bold text-green-900">
                  {Object.keys(donationFeedbacks).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Chưa phản hồi</p>
                <p className="text-2xl font-bold text-orange-900">
                  {donationHistory.length - Object.keys(donationFeedbacks).length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div className="space-y-4">
        {donationHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử hiến máu</h3>
            <p className="text-gray-600">Khi bạn hiến máu, thông tin sẽ được hiển thị ở đây.</p>
          </div>
        ) : (
          donationHistory.map((donation) => {
            const existingFeedback = donationFeedbacks[donation.id];
            const isLoadingFeedback = loadingFeedbacks[donation.id];
            
            return (
              <div key={donation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Hiến máu ngày {formatDate(donation.donationDate)}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Mã đăng ký:</span> {donation.id}</p>
                          <p><span className="font-medium">Địa điểm:</span> {donation.location}</p>
                          <p><span className="font-medium">Nhóm máu:</span> {donation.bloodType}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {getStatusText(donation.status)}
                      </span>

                      {isLoadingFeedback ? (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                          <span className="text-sm">Đang kiểm tra...</span>
                        </div>
                      ) : existingFeedback ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Đã có phản hồi</span>
                        </div>
                      ) : donation.status === 'completed' ? (
                        <button
                          onClick={() => handleCreateFeedback(donation)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Gửi phản hồi
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Chưa thể phản hồi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Show existing feedback */}
                  {existingFeedback && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Phản hồi của bạn:</h4>
                      <FeedbackCard 
                        feedback={existingFeedback} 
                        showActions={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <FeedbackForm
              registrationId={selectedDonation.id}
              onSubmit={handleSubmitFeedback}
              onCancel={() => {
                setShowFeedbackForm(false);
                setSelectedDonation(null);
              }}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};