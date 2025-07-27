import React from 'react';
import { X, FileText, Shield, AlertTriangle, CheckCircle, Droplet, Clipboard } from 'lucide-react';

interface AfterDonationData {
  idAfterDonation: string;
  infectiousDiseasesChecked: boolean;
  isBloodUsable: boolean;
  status: string;
  note: string;
  healthCheckId: string;
  bloodId: string;
}

interface AfterDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  afterDonationData: AfterDonationData | null;
  loading?: boolean;
}

const AfterDonationModal: React.FC<AfterDonationModalProps> = ({
  isOpen,
  onClose,
  afterDonationData,
  loading = false
}) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PASSED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FAILED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PASSED':
        return 'Đã qua kiểm tra';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'FAILED':
        return 'Không đạt';
      case 'REJECTED':
        return 'Bị từ chối';
      case 'PENDING':
        return 'Đang chờ xử lý';
      case 'PROCESSING':
        return 'Đang xử lý';
      default:
        return status || 'Không xác định';
    }
  };

  const getBloodUsabilityStatus = (isUsable: boolean) => {
    return isUsable ? {
      text: 'Máu có thể sử dụng',
      color: 'text-green-600',
      bgColor: 'bg-green-100 border-green-200',
      icon: CheckCircle
    } : {
      text: 'Máu không thể sử dụng',
      color: 'text-red-600',
      bgColor: 'bg-red-100 border-red-200',
      icon: AlertTriangle
    };
  };

  const getInfectiousCheckStatus = (checked: boolean) => {
    return checked ? {
      text: 'Đã kiểm tra bệnh truyền nhiễm',
      color: 'text-green-600',
      bgColor: 'bg-green-100 border-green-200',
      icon: Shield
    } : {
      text: 'Chưa kiểm tra bệnh truyền nhiễm',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 border-yellow-200',
      icon: AlertTriangle
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-500" />
            <span>Kết quả theo dõi sau hiến máu</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải kết quả theo dõi...</p>
            </div>
          ) : afterDonationData ? (
            <div className="space-y-6">
              {/* After Donation ID */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Mã theo dõi sau hiến:</span>
                  <span className="text-sm font-mono text-blue-700 bg-white px-2 py-1 rounded border">
                    {afterDonationData.idAfterDonation}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className={`border rounded-lg p-4 ${getStatusColor(afterDonationData.status)}`}>
                <div className="flex items-center space-x-3">
                  <Clipboard className="w-6 h-6" />
                  <div>
                    <h3 className="font-medium">
                      Trạng thái: {getStatusText(afterDonationData.status)}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Blood Usability Status */}
              <div className={`border rounded-lg p-4 ${getBloodUsabilityStatus(afterDonationData.isBloodUsable).bgColor}`}>
                <div className="flex items-center space-x-3">
                  {React.createElement(getBloodUsabilityStatus(afterDonationData.isBloodUsable).icon, {
                    className: `w-6 h-6 ${getBloodUsabilityStatus(afterDonationData.isBloodUsable).color}`
                  })}
                  <div>
                    <h3 className={`font-medium ${getBloodUsabilityStatus(afterDonationData.isBloodUsable).color}`}>
                      {getBloodUsabilityStatus(afterDonationData.isBloodUsable).text}
                    </h3>
                    <p className={`text-sm ${getBloodUsabilityStatus(afterDonationData.isBloodUsable).color} opacity-80`}>
                      {afterDonationData.isBloodUsable 
                        ? 'Máu đạt tiêu chuẩn chất lượng và có thể được sử dụng cho việc truyền máu'
                        : 'Máu không đạt tiêu chuẩn và không thể sử dụng cho việc truyền máu'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Infectious Diseases Check */}
              <div className={`border rounded-lg p-4 ${getInfectiousCheckStatus(afterDonationData.infectiousDiseasesChecked).bgColor}`}>
                <div className="flex items-center space-x-3">
                  {React.createElement(getInfectiousCheckStatus(afterDonationData.infectiousDiseasesChecked).icon, {
                    className: `w-6 h-6 ${getInfectiousCheckStatus(afterDonationData.infectiousDiseasesChecked).color}`
                  })}
                  <div>
                    <h3 className={`font-medium ${getInfectiousCheckStatus(afterDonationData.infectiousDiseasesChecked).color}`}>
                      {getInfectiousCheckStatus(afterDonationData.infectiousDiseasesChecked).text}
                    </h3>
                    <p className={`text-sm ${getInfectiousCheckStatus(afterDonationData.infectiousDiseasesChecked).color} opacity-80`}>
                      {afterDonationData.infectiousDiseasesChecked
                        ? 'Đã thực hiện đầy đủ các xét nghiệm kiểm tra bệnh truyền nhiễm (HIV, Hepatitis B/C, Syphilis)'
                        : 'Chưa hoàn thành việc kiểm tra bệnh truyền nhiễm'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Related IDs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Mã khám sức khỏe:</span>
                    <span className="text-sm font-mono text-gray-800 bg-white px-2 py-1 rounded border">
                      {afterDonationData.healthCheckId}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Mã túi máu:</span>
                    <span className="text-sm font-mono text-red-800 bg-red-50 px-2 py-1 rounded border border-red-200">
                      {afterDonationData.bloodId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {afterDonationData.note && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center space-x-2">
                    <Clipboard className="w-4 h-4" />
                    <span>Ghi chú từ bác sĩ</span>
                  </h4>
                  <p className="text-yellow-700 text-sm">{afterDonationData.note}</p>
                </div>
              )}

              {/* Information Panel */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center space-x-2">
                  <Droplet className="w-4 h-4" />
                  <span>Thông tin về quy trình</span>
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• Sau khi hiến máu, mẫu máu sẽ được kiểm tra các bệnh truyền nhiễm</p>
                  <p>• Kết quả xét nghiệm sẽ được thông báo nếu có bất thường</p>
                  <p>• Máu chỉ được sử dụng khi đã qua tất cả các bước kiểm tra</p>
                  <p>• Thông tin được bảo mật theo quy định của pháp luật</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có dữ liệu theo dõi sau hiến máu</p>
              <p className="text-gray-400 text-sm mt-2">
                Dữ liệu sẽ được cập nhật sau khi hoàn thành các xét nghiệm
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AfterDonationModal;