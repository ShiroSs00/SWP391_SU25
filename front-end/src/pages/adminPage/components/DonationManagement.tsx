import React, { useState } from 'react';
import type { BloodType } from '../../../types/types';

interface Donation {
  id: string;
  donorName: string;
  bloodType: BloodType;
  quantity: number;
  donationDate: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  notes?: string;
}

const DonationManagement: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'completed' | 'cancelled') => {
    try {
      // TODO: Gọi API cập nhật status
      setDonations(donations.map(donation => 
        donation.id === id ? { ...donation, status: newStatus } : donation
      ));
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  const handleEdit = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đợt hiến máu này?')) {
      try {
        // TODO: Gọi API xóa
        setDonations(donations.filter(donation => donation.id !== id));
      } catch (error) {
        console.error('Error deleting donation:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý hiến máu</h2>

      {/* Donations Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Người hiến</th>
              <th className="px-6 py-3 text-left">Nhóm máu</th>
              <th className="px-6 py-3 text-left">Số lượng</th>
              <th className="px-6 py-3 text-left">Ngày hiến</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="border-b">
                <td className="px-6 py-4">{donation.id}</td>
                <td className="px-6 py-4">{donation.donorName}</td>
                <td className="px-6 py-4">{donation.bloodType}</td>
                <td className="px-6 py-4">{donation.quantity}</td>
                <td className="px-6 py-4">{donation.donationDate}</td>
                <td className="px-6 py-4">
                  <select
                    value={donation.status}
                    onChange={(e) => handleStatusChange(donation.id, e.target.value as 'pending' | 'approved' | 'completed' | 'cancelled')}
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
                    onClick={() => handleEdit(donation)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(donation.id)}
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
      {isEditing && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Chi tiết hiến máu</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Người hiến</label>
                <input
                  type="text"
                  value={selectedDonation.donorName}
                  onChange={(e) => setSelectedDonation({ ...selectedDonation, donorName: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nhóm máu</label>
                <select
                  value={selectedDonation.bloodType}
                  onChange={(e) => setSelectedDonation({ ...selectedDonation, bloodType: e.target.value as BloodType })}
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
                  value={selectedDonation.quantity}
                  onChange={(e) => setSelectedDonation({ ...selectedDonation, quantity: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ngày hiến</label>
                <input
                  type="date"
                  value={selectedDonation.donationDate}
                  onChange={(e) => setSelectedDonation({ ...selectedDonation, donationDate: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  value={selectedDonation.notes || ''}
                  onChange={(e) => setSelectedDonation({ ...selectedDonation, notes: e.target.value })}
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

export default DonationManagement; 