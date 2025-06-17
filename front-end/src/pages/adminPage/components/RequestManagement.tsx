import React, { useState } from 'react';
import type { BloodType } from '../../../types/types';

interface BloodRequest {
  id: string;
  requesterName: string;
  bloodType: BloodType;
  quantity: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  hospital: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
}

const RequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'completed' | 'cancelled') => {
    try {
      // TODO: Gọi API cập nhật status
      setRequests(requests.map(request => 
        request.id === id ? { ...request, status: newStatus } : request
      ));
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleEdit = (request: BloodRequest) => {
    setSelectedRequest(request);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      try {
        // TODO: Gọi API xóa
        setRequests(requests.filter(request => request.id !== id));
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý yêu cầu máu</h2>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Người yêu cầu</th>
              <th className="px-6 py-3 text-left">Nhóm máu</th>
              <th className="px-6 py-3 text-left">Số lượng</th>
              <th className="px-6 py-3 text-left">Bệnh viện</th>
              <th className="px-6 py-3 text-left">Mức độ khẩn cấp</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b">
                <td className="px-6 py-4">{request.id}</td>
                <td className="px-6 py-4">{request.requesterName}</td>
                <td className="px-6 py-4">{request.bloodType}</td>
                <td className="px-6 py-4">{request.quantity}</td>
                <td className="px-6 py-4">{request.hospital}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.urgency === 'high' ? 'Cao' :
                     request.urgency === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusChange(request.id, e.target.value as 'pending' | 'approved' | 'completed' | 'cancelled')}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(request)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Chi tiết yêu cầu</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Người yêu cầu</label>
                <input
                  type="text"
                  value={selectedRequest.requesterName}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, requesterName: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nhóm máu</label>
                <select
                  value={selectedRequest.bloodType}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, bloodType: e.target.value as BloodType })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  value={selectedRequest.quantity}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, quantity: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Bệnh viện</label>
                <input
                  type="text"
                  value={selectedRequest.hospital}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, hospital: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mức độ khẩn cấp</label>
                <select
                  value={selectedRequest.urgency}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, urgency: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Lý do</label>
                <textarea
                  value={selectedRequest.reason}
                  onChange={(e) => setSelectedRequest({ ...selectedRequest, reason: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestManagement; 