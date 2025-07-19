import React, { useState } from 'react';
import { Calendar, MapPin, Droplet, MessageSquare, Star, Clock, RefreshCw, AlertCircle, Phone, Mail, Edit } from 'lucide-react';
import type { DonationRecord, DonorFeedback } from '../types/dashboard.type';
import FeedbackForm from '../../donor-feedback/components/FeedbackForm';
import FeedbackModal from './FeedbackModal';
import RatingStars from '../../donor-feedback/components/RatingStars';
import type { CreateFeedbackRequest } from '../../donor-feedback/types/feedback.types';

// Định nghĩa giao diện FeedbackFormProps
interface FeedbackFormProps {
  registrationId: string;
  initialData?: DonorFeedback | undefined;
  onSubmitSuccess: () => void;
}

interface HistoryTableProps {
  records: DonationRecord[];
  type: 'donation' | 'receiving';
  onFeedback: (recordId: string, feedbackData?: DonorFeedback) => void;
  onEditBloodRequest?: (recordId: string) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({
  records,
  type,
  onFeedback,
  onEditBloodRequest,
  loading = false,
  onRefresh
}) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DonationRecord | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED':
      case 'SEPARATED':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PASSED':
        return 'Hoàn thành';
      case 'SEPARATED':
        return 'Đã tách máu';
      case 'Pending':
        return 'Đang chờ';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Rejected':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const canEditBloodRequest = (record: DonationRecord) => {
    return type === 'receiving' && record.status === 'PENDING' && onEditBloodRequest;
  };

  const handleFeedbackClick = (record: DonationRecord) => {
    setSelectedRecord(record);
    setFeedbackModalOpen(true);
    onFeedback(record.registrationId || record.id, record.donorFeedbackId);
  };

  const handleFeedbackSubmitSuccess = () => {
    setFeedbackModalOpen(false);
    onRefresh?.();
  };

  const renderFeedbackSection = (feedback: DonorFeedback) => {
    const averageRating = (
      feedback.process +
      feedback.bloodTest +
      feedback.postDonationCare +
      feedback.comfortable
    ) / 4;

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 mt-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-yellow-900">Đánh giá của bạn</h4>
              <div className="flex items-center gap-2">
                <span className="font-medium">{averageRating.toFixed(1)}/5</span>
                <RatingStars rating={Math.round(averageRating)} readonly size="sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Quy trình:</span>
                <RatingStars rating={feedback.process} readonly size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Xét nghiệm:</span>
                <RatingStars rating={feedback.bloodTest} readonly size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Chăm sóc sau:</span>
                <RatingStars rating={feedback.postDonationCare} readonly size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Thoải mái:</span>
                <RatingStars rating={feedback.comfortable} readonly size="sm" />
              </div>
            </div>
            {feedback.description && (
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-700">{feedback.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-500">Đang tải lịch sử...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          {type === 'donation' ? 'Chưa có lịch sử hiến máu' : 'Chưa có lịch sử yêu cầu máu'}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          {type === 'donation'
            ? 'Hãy tham gia các sự kiện hiến máu để tạo lịch sử'
            : 'Lịch sử yêu cầu máu sẽ được cập nhật khi có'
          }
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Làm mới
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {onRefresh && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới</span>
          </button>
        </div>
      )}

      {records.map((record) => (
        <div
          key={record.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                  {getStatusText(record.status)}
                </span>
                <span className="text-sm text-gray-500">#{record.registrationId || record.id}</span>
                {type === 'receiving' && record.emergency && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>Khẩn cấp</span>
                  </span>
                )}
                {canEditBloodRequest(record) && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <Edit className="w-3 h-3" />
                    <span>Có thể chỉnh sửa</span>
                  </span>
                )}
                {record.event && (
                  <span className="text-sm text-blue-600">Sự kiện: {record.event}</span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {record.date ? formatDate(record.date) : 'Không có thông tin ngày'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{record.location || 'Không có thông tin địa điểm'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplet className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-700">
                    {type === 'receiving' && record.bloodType ? `${record.bloodType} - ` : ''}
                    {record.volumeToTake || record.volume}ml
                    {type === 'receiving' && record.component ? ` (${record.component})` : ''}
                  </span>
                </div>
              </div>
              {type === 'receiving' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-800">
                        {record.requesterPhone || 'Không có SĐT'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-800">
                        {record.requesterEmail || 'Không có email'}
                      </span>
                    </div>
                  </div>
                  {record.requestCreationDate && (
                    <div className="mt-2 text-xs text-blue-600">
                      Ngày tạo yêu cầu: {formatDate(record.requestCreationDate)}
                    </div>
                  )}
                  {record.processedBy && (
                    <div className="mt-2 text-xs text-blue-600">
                      Xử lý bởi: {record.processedBy}
                      {record.processedDate && ` - ${formatDate(record.processedDate)}`}
                    </div>
                  )}
                  {record.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      Lý do từ chối: {record.rejectionReason}
                    </div>
                  )}
                  {record.requestDate && (
                    <div className="mt-2 text-xs text-blue-600">
                      Ngày mong muốn nhận máu: {formatDate(record.requestDate)}
                    </div>
                  )}
                </div>
              )}
              {(record.bloodCode || record.bloodBagId) && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs text-gray-500">
                    {type === 'receiving' ? 'Mã túi máu:' : 'Mã máu:'}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {record.bloodCode || record.bloodBagId}
                  </span>
                </div>
              )}
              {record.healthCheck && type === 'donation' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Kiểm tra sức khỏe:</p>
                      <p className="text-sm text-green-700">{record.healthCheck}</p>
                    </div>
                  </div>
                </div>
              )}
              {record.afterDonationBlood && type === 'donation' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Sau hiến máu:</p>
                      <p className="text-sm text-blue-700">{record.afterDonationBlood}</p>
                    </div>
                  </div>
                </div>
              )}
              {record.donorFeedbackId && renderFeedbackSection(record.donorFeedbackId)}
            </div>
            <div className="flex flex-col space-y-2">
              {canEditBloodRequest(record) && (
                <button
                  onClick={() => onEditBloodRequest!(record.registrationId || record.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm border border-orange-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              )}
              {(record.status === 'DONATION_PROCESSING' || record.status === 'SEPARATED') && (
                <button
                  onClick={() => handleFeedbackClick(record)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{record.donorFeedbackId ? 'Sửa phản hồi' : 'Phản hồi'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
<FeedbackModal
  isOpen={feedbackModalOpen}
  onClose={() => setFeedbackModalOpen(false)}
>
  {selectedRecord && (
    <FeedbackForm
      registrationId={selectedRecord.registrationId || selectedRecord.id}
      initialData={selectedRecord.donorFeedbackId}
      onSubmitSuccess={handleFeedbackSubmitSuccess}
      onSubmit={async (data: CreateFeedbackRequest) => {
        // Gọi API submit feedback
        try {
          await onFeedback(selectedRecord.registrationId || selectedRecord.id);
          handleFeedbackSubmitSuccess();
        } catch (error) {
          console.error('Error submitting feedback:', error);
          throw error; // Re-throw để FeedbackForm xử lý
        }
      }}
    />
  )}
</FeedbackModal>
    </div>
  );
};

export default HistoryTable;