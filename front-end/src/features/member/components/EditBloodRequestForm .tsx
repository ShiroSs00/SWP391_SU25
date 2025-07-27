import React, { useState } from 'react';
import { updateBloodRequest, getReceivingHistory } from '../services/dashboard.service';

// Interface cho form data
interface EditBloodRequestForm {
  volume: number;
  componentId: number;
  bloodCode: string;
  requestDate: string;
}

// Interface cho modal props
interface EditBloodRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  currentData: any; // Dữ liệu hiện tại của blood request
  onSuccess: () => void; // Callback khi cập nhật thành công
}

// Component Modal để chỉnh sửa blood request
const EditBloodRequestModal: React.FC<EditBloodRequestModalProps> = ({
  isOpen,
  onClose,
  recordId,
  currentData,
  onSuccess
}) => {
  const [formData, setFormData] = useState<EditBloodRequestForm>({
    volume: currentData?.volume || 450,
    componentId: currentData?.componentId || 101,
    bloodCode: currentData?.bloodType || 'A',
    requestDate: currentData?.requestDate || new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateBloodRequest(recordId, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật đơn nhận máu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa đơn nhận máu</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thể tích (ml)
            </label>
            <input
              type="number"
              value={formData.volume}
              onChange={(e) => setFormData({...formData, volume: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component ID
            </label>
            <select
              value={formData.componentId}
              onChange={(e) => setFormData({...formData, componentId: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={101}>Toàn phần (101)</option>
              <option value={102}>Hồng cầu (102)</option>
              <option value={103}>Tiểu cầu (103)</option>
              <option value={104}>Plasma (104)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhóm máu
            </label>
            <select
              value={formData.bloodCode}
              onChange={(e) => setFormData({...formData, bloodCode: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="O+">O+</option>
              <option value="A-">A-</option>
              <option value="B-">B-</option>
              <option value="AB-">AB-</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày mong muốn nhận máu
            </label>
            <input
              type="date"
              value={formData.requestDate}
              onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};