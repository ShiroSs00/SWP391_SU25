import React from 'react';
import { X, Heart, Thermometer, Activity, Droplet, Weight, AlertCircle, CheckCircle } from 'lucide-react';

interface HealthCheckData {
  healthCheckId: string;
  weight: number;
  temperature: number;
  bloodPressure: string;
  pulse: number;
  hemoglobin: number;
  volumeToTake: number;
  isFitToDonate: boolean;
  note: string;
}

interface HealthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthCheckData: HealthCheckData | null;
  loading?: boolean;
}

const HealthCheckModal: React.FC<HealthCheckModalProps> = ({
  isOpen,
  onClose,
  healthCheckData,
  loading = false
}) => {
  if (!isOpen) return null;

  const getHealthStatus = (isFitToDonate: boolean) => {
    return isFitToDonate ? {
      text: 'Đủ điều kiện hiến máu',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: CheckCircle
    } : {
      text: 'Không đủ điều kiện hiến máu',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: AlertCircle
    };
  };

  const getVitalStatus = (type: string, value: number | string) => {
    switch (type) {
      case 'temperature':
        const temp = typeof value === 'number' ? value : parseFloat(value as string);
        if (temp >= 36.1 && temp <= 37.2) return 'normal';
        return 'abnormal';
      
      case 'pulse':
        const pulseVal = typeof value === 'number' ? value : parseFloat(value as string);
        if (pulseVal >= 60 && pulseVal <= 100) return 'normal';
        return 'abnormal';
      
      case 'hemoglobin':
        const hbVal = typeof value === 'number' ? value : parseFloat(value as string);
        if (hbVal >= 12.5) return 'normal';
        return 'abnormal';
      
      case 'weight':
        const weightVal = typeof value === 'number' ? value : parseFloat(value as string);
        if (weightVal >= 45) return 'normal';
        return 'abnormal';
      
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'normal' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500" />
            <span>Kết quả khám sức khỏe</span>
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
              <p className="text-gray-500">Đang tải kết quả khám sức khỏe...</p>
            </div>
          ) : healthCheckData ? (
            <div className="space-y-6">
              {/* Health Check ID */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Mã khám sức khỏe:</span>
                  <span className="text-sm font-mono text-blue-700 bg-white px-2 py-1 rounded border">
                    {healthCheckData.healthCheckId}
                  </span>
                </div>
              </div>

              {/* Overall Status */}
              <div className={`${getHealthStatus(healthCheckData.isFitToDonate).bgColor} border rounded-lg p-4`}>
                <div className="flex items-center space-x-3">
                  {React.createElement(getHealthStatus(healthCheckData.isFitToDonate).icon, {
                    className: `w-6 h-6 ${getHealthStatus(healthCheckData.isFitToDonate).color}`
                  })}
                  <div>
                    <h3 className={`font-medium ${getHealthStatus(healthCheckData.isFitToDonate).color}`}>
                      {getHealthStatus(healthCheckData.isFitToDonate).text}
                    </h3>
                    <p className={`text-sm ${getHealthStatus(healthCheckData.isFitToDonate).color} opacity-80`}>
                      Thể tích dự kiến: {healthCheckData.volumeToTake}ml
                    </p>
                  </div>
                </div>
              </div>

              {/* Vital Signs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Weight className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-700">Cân nặng</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(getVitalStatus('weight', healthCheckData.weight))}`}>
                      {getVitalStatus('weight', healthCheckData.weight) === 'normal' ? 'Bình thường' : 'Bất thường'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {healthCheckData.weight} <span className="text-sm font-normal text-gray-500">kg</span>
                  </div>
                </div>

                {/* Temperature */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-700">Nhiệt độ</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(getVitalStatus('temperature', healthCheckData.temperature))}`}>
                      {getVitalStatus('temperature', healthCheckData.temperature) === 'normal' ? 'Bình thường' : 'Bất thường'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {healthCheckData.temperature} <span className="text-sm font-normal text-gray-500">°C</span>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-700">Huyết áp</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {healthCheckData.bloodPressure} <span className="text-sm font-normal text-gray-500">mmHg</span>
                  </div>
                </div>

                {/* Pulse */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-700">Nhịp tim</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(getVitalStatus('pulse', healthCheckData.pulse))}`}>
                      {getVitalStatus('pulse', healthCheckData.pulse) === 'normal' ? 'Bình thường' : 'Bất thường'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {healthCheckData.pulse} <span className="text-sm font-normal text-gray-500">bpm</span>
                  </div>
                </div>

                {/* Hemoglobin */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Droplet className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-700">Hemoglobin</span>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(getVitalStatus('hemoglobin', healthCheckData.hemoglobin))}`}>
                      {getVitalStatus('hemoglobin', healthCheckData.hemoglobin) === 'normal' ? 'Bình thường' : 'Thấp'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {healthCheckData.hemoglobin} <span className="text-sm font-normal text-gray-500">g/dL</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {healthCheckData.note && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Ghi chú từ bác sĩ</h4>
                  <p className="text-yellow-700 text-sm">{healthCheckData.note}</p>
                </div>
              )}

              {/* Reference Values */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Giá trị tham khảo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>• Cân nặng: ≥ 45kg</div>
                  <div>• Nhiệt độ: 36.1 - 37.2°C</div>
                  <div>• Nhịp tim: 60 - 100 bpm</div>
                  <div>• Hemoglobin: ≥ 12.5 g/dL</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có dữ liệu khám sức khỏe</p>
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

export default HealthCheckModal;