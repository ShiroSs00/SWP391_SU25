import React, { useState } from 'react';
import { Calendar, MapPin, Droplet, MessageSquare, Star, Clock, RefreshCw, AlertCircle, Phone, Mail, Edit, FileText, Heart } from 'lucide-react';
import type { DonationRecord, DonorFeedback } from '../types/dashboard.type';
import FeedbackForm from '../../donor-feedback/components/FeedbackForm';
import FeedbackModal from './FeedbackModal';
import HealthCheckModal from './HealthCheckModal';
import AfterDonationModal from './AfterDonationModal';
import RatingStars from '../../donor-feedback/components/RatingStars';
import type { CreateFeedbackRequest } from '../../donor-feedback/types/feedback.types';
import { getHealthCheckByRegisterId, getAfterDonationByHealthCheckId } from '../services/dashboard.service';

interface HistoryTableProps {
  records: DonationRecord[];
  type: 'donation' | 'receiving';
  onFeedback: (recordId: string, feedbackData?: CreateFeedbackRequest) => Promise<void>;
  onEditBloodRequest?: (recordId: string) => void;
  onViewHealthCheck?: (recordId: string) => void;
  onViewAfterDonation?: (recordId: string) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({
  records,
  type,
  onFeedback,
  onEditBloodRequest,
  onViewHealthCheck,
  onViewAfterDonation,
  loading = false,
  onRefresh
}) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [healthCheckModalOpen, setHealthCheckModalOpen] = useState(false);
  const [afterDonationModalOpen, setAfterDonationModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DonationRecord | null>(null);

  // State for modal data
  const [healthCheckData, setHealthCheckData] = useState<any>(null);
  const [afterDonationData, setAfterDonationData] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Status mapping cho donation history
  const getDonationStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
      case 'SEPARATED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
      case 'DONATION_PROCESSING':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REGISTERED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDonationStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'Hoàn thành';
      case 'SEPARATED':
        return 'Đã tách máu';
      case 'PROCESSING':
      case 'DONATION_PROCESSING':
        return 'Đang xử lý';
      case 'PENDING':
        return 'Đang chờ';
      case 'REGISTERED':
        return 'Đã đăng ký';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'REJECTED':
        return 'Bị từ chối';
      case 'FAILED':
        return 'Thất bại';
      default:
        return status || 'Không xác định';
    }
  };

  // Status mapping cho blood request
  const getBloodRequestStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBloodRequestStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'Đã duyệt';
      case 'PENDING':
        return 'Đang chờ duyệt';
      case 'REJECTED':
        return 'Bị từ chối';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status || 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    return type === 'donation' ? getDonationStatusColor(status) : getBloodRequestStatusColor(status);
  };

  const getStatusText = (status: string) => {
    return type === 'donation' ? getDonationStatusText(status) : getBloodRequestStatusText(status);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Không có thông tin ngày';
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
    return type === 'receiving' &&
      record.status?.toUpperCase() === 'PENDING' &&
      onEditBloodRequest;
  };

  const canProvideFeedback = (record: DonationRecord) => {
    if (type !== 'donation') return false;
    const allowedStatuses = ['COMPLETED', 'SUCCESS', 'SEPARATED', 'DONATION_PROCESSING'];
    return allowedStatuses.includes(record.status?.toUpperCase() || '');
  };

  const hasHealthCheckData = (record: DonationRecord) => {
    return type === 'donation' && record.healthCheck;
  };

  const hasAfterDonationData = (record: DonationRecord) => {
    return type === 'donation' && record.afterDonationBlood;
  };


  const handleHealthCheckView = async (registerId: string) => {
    console.log('=== HANDLE HEALTH CHECK VIEW DEBUG ===');
    console.log('Received registerId:', registerId);
    console.log('Type:', typeof registerId);
    console.log('Length:', registerId?.length);
    console.log('Is empty?', registerId === '');
    console.log('Is undefined?', registerId === undefined);
    console.log('Is null?', registerId === null);

    if (!registerId || registerId === '' || registerId === 'undefined') {
      alert('Không có registerId hợp lệ để tải dữ liệu');
      return;
    }

    setModalLoading(true);
    setHealthCheckModalOpen(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        setHealthCheckData(null);
        return;
      }

      console.log('About to call API with registerId:', registerId);
      const response = await getHealthCheckByRegisterId(registerId, token);

      if (response.success && response.data) {
        setHealthCheckData(response.data);
      } else {
        setHealthCheckData(null);
        console.error('Failed to fetch health check data:', response.message);
        alert(`Không thể tải dữ liệu: ${response.message}`);
      }
    } catch (error) {
      console.error('Error fetching health check:', error);
      setHealthCheckData(null);
      alert('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setModalLoading(false);
    }
  };

  const handleAfterDonationView = async (registerId: string) => {
    setModalLoading(true);
    setAfterDonationModalOpen(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        setAfterDonationData(null);
        return;
      }

      console.log('Calling getHealthCheckByRegisterId for after donation with:', registerId);
      // First get health check to get healthCheckId
      const healthCheckResponse = await getHealthCheckByRegisterId(registerId, token);

      if (healthCheckResponse.success && healthCheckResponse.data?.healthCheckId) {
        const afterDonationResponse = await getAfterDonationByHealthCheckId(
          healthCheckResponse.data.healthCheckId,
          token
        );

        if (afterDonationResponse.success && afterDonationResponse.data) {
          setAfterDonationData(afterDonationResponse.data);
        } else {
          setAfterDonationData(null);
          console.error('Failed to fetch after donation data:', afterDonationResponse.message);
          alert(`Không thể tải dữ liệu theo dõi sau hiến: ${afterDonationResponse.message}`);
        }
      } else {
        setAfterDonationData(null);
        console.error('Failed to fetch health check data for after donation:', healthCheckResponse.message);
        alert(`Không thể tải dữ liệu khám sức khỏe: ${healthCheckResponse.message}`);
      }
    } catch (error) {
      console.error('Error fetching after donation:', error);
      setAfterDonationData(null);
      alert('Có lỗi xảy ra khi tải dữ liệu theo dõi sau hiến');
    } finally {
      setModalLoading(false);
    }
  };

  const handleFeedbackClick = (record: DonationRecord) => {
    setSelectedRecord(record);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmitSuccess = () => {
    setFeedbackModalOpen(false);
    setSelectedRecord(null);
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
              {/* Header Section */}
              <div className="flex items-center space-x-4 mb-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                  {getStatusText(record.status)}
                </span>

                {/* Record ID */}
                <span className="text-sm text-gray-500">
                  #{type === 'donation' ? record.registerId : record.id}
                </span>

                {/* Emergency badge for blood requests */}
                {type === 'receiving' && record.emergency && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>Khẩn cấp</span>
                  </span>
                )}

                {/* Editable badge */}
                {canEditBloodRequest(record) && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <Edit className="w-3 h-3" />
                    <span>Có thể chỉnh sửa</span>
                  </span>
                )}

                {/* Event name for donations */}
                {type === 'donation' && record.event && (
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    Sự kiện: {record.event}
                  </span>
                )}
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Donor Name */}
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-gray-400 font-medium">👤</span>
                  <span className="text-sm text-gray-700 font-medium">
                    {record.name}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {formatDate(type === 'receiving' ? record.requestDate : record.date)}
                  </span>
                </div>

                {/* Blood Code & Volume */}
                <div className="flex items-center space-x-2">
                  <Droplet className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-700">
                    {record.bloodCode ? `${record.bloodCode} - ` : ''}
                    {record.volume || record.volumeToTake}
                    {type === 'receiving' && record.component ? ` (${record.component})` : ''}
                  </span>
                </div>

                {/* Location for blood requests */}
                {type === 'receiving' && record.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{record.location}</span>
                  </div>
                )}
              </div>

              {/* Blood Request Specific Info */}
              {type === 'receiving' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-3">Thông tin yêu cầu</h4>

                  {/* Requester Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-800">Người yêu cầu:</span>
                      <span className="text-sm text-blue-700">{record.requesterName || record.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-700">
                        {record.requesterPhone || record.contactPhone || 'Không có SĐT'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-700">
                        {record.requesterEmail || record.contactEmail || 'Không có email'}
                      </span>
                    </div>
                    {record.requesterAddress && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-700">{record.requesterAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Processing Info */}
                  {record.processedBy && (
                    <div className="bg-white p-3 rounded border border-blue-200 mb-3">
                      <div className="text-sm">
                        <span className="font-medium text-blue-800">Xử lý bởi:</span>
                        <span className="text-blue-700 ml-2">{record.processedBy}</span>
                        {record.processedDate && (
                          <span className="text-blue-600 ml-2">- {formatDate(record.processedDate)}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {record.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                      <div className="text-sm">
                        <span className="font-medium text-red-800">Lý do từ chối:</span>
                        <p className="text-red-700 mt-1">{record.rejectionReason}</p>
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-600">
                    {record.requestCreationDate && (
                      <div>Ngày tạo: {formatDate(record.requestCreationDate)}</div>
                    )}
                    {record.requestDate && (
                      <div>Ngày mong muốn: {formatDate(record.requestDate)}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Donation Details for Donation History */}
              {type === 'donation' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-900 mb-3">Chi tiết hiến máu</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Registration ID */}
                    {record.registerId && (
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">Mã đăng ký:</span>
                        <span className="text-sm font-mono text-green-700 bg-green-100 px-2 py-1 rounded">
                          {record.registerId}
                        </span>
                      </div>
                    )}

                    {/* Blood Code */}
                    {record.bloodCode && (
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">Mã máu:</span>
                        <span className="text-sm font-mono text-red-700 bg-red-100 px-2 py-1 rounded">
                          {record.bloodCode}
                        </span>
                      </div>
                    )}

                    {/* Health Check ID */}
                    {record.healthCheck && (
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">Mã khám sức khỏe:</span>
                        <span className="text-sm font-mono text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          {record.healthCheck}
                        </span>
                      </div>
                    )}

                    {/* After Donation ID */}
                    {record.afterDonationBlood && (
                      <div className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="text-sm font-medium text-gray-600">Mã theo dõi sau hiến:</span>
                        <span className="text-sm font-mono text-purple-700 bg-purple-100 px-2 py-1 rounded">
                          {record.afterDonationBlood}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Blood Code/Bag ID for Blood Requests */}
              {type === 'receiving' && (record.bloodCode || record.bloodBagId) && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Mã túi máu:</span>
                    <span className="text-sm font-mono text-gray-800 bg-white px-2 py-1 rounded border">
                      {record.bloodCode || record.bloodBagId}
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              {record.donorFeedbackId && renderFeedbackSection(record.donorFeedbackId)}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 ml-4">
              {/* Edit Blood Request */}
              {canEditBloodRequest(record) && (
                <button
                  onClick={() => onEditBloodRequest!(record.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm border border-orange-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              )}

              {/* View Health Check */}
              {hasHealthCheckData(record) && (
                <button
                  onClick={() => handleHealthCheckView(record.registerId!)}
                  className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm border border-green-200"
                >
                  <Heart className="w-4 h-4" />
                  <span>Sức khỏe</span>
                </button>
              )}

              {/* View After Donation */}
              {hasAfterDonationData(record) && (
                <button
                  onClick={() => handleAfterDonationView(record.registerId!)}
                  className="flex items-center space-x-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm border border-purple-200"
                >
                  <FileText className="w-4 h-4" />
                  <span>Sau hiến</span>
                </button>
              )}

              {/* Feedback */}
              {canProvideFeedback(record) && (
                <button
                  onClick={() => handleFeedbackClick(record)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm border border-blue-200"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{record.donorFeedbackId ? 'Sửa phản hồi' : 'Phản hồi'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedRecord(null);
        }}
      >
        {selectedRecord && (
          <FeedbackForm
            registrationId={selectedRecord.registerId!}
            onSubmitSuccess={handleFeedbackSubmitSuccess}
            onSubmit={async (data: CreateFeedbackRequest) => {
              try {
                await onFeedback(selectedRecord.registerId!, data);
                console.log("Feedback submitted successfully", data);
              } catch (error) {
                console.error('Error submitting feedback:', error);
                throw error;
              }
            }}
          />
        )}
      </FeedbackModal>

      {/* Health Check Modal */}
      <HealthCheckModal
        isOpen={healthCheckModalOpen}
        onClose={() => {
          setHealthCheckModalOpen(false);
          setHealthCheckData(null);
        }}
        healthCheckData={healthCheckData}
        loading={modalLoading}
      />

      {/* After Donation Modal */}
      <AfterDonationModal
        isOpen={afterDonationModalOpen}
        onClose={() => {
          setAfterDonationModalOpen(false);
          setAfterDonationData(null);
        }}
        afterDonationData={afterDonationData}
        loading={modalLoading}
      />
    </div>
  );
};

export default HistoryTable;