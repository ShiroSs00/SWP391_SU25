import React from 'react';
import { formatDate } from '../../utils/formatDate';
import type { BloodOrder } from '../../types/types';

interface BloodOrderTableProps {
  orders: BloodOrder[];
  activeTab: 'donation' | 'request';
  onStatusChange: (orderId: number, status: string) => void;
  onNoteChange: (orderId: number, note: string) => void;
  onViewDetail: (order: BloodOrder) => void;
}


export const BloodOrderTable: React.FC<BloodOrderTableProps> = ({
  orders,
  activeTab,
  onStatusChange,
  onNoteChange,
  onViewDetail
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-16 px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Người dùng</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ngày</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nhóm máu</th>
            {activeTab === 'request' && (
              <>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bệnh viện</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Khẩn cấp</th>
              </>
            )}
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ghi chú</th>
            <th className="w-24 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map(order => (
            <tr key={order.id}>
              <td className="px-4 py-3 text-sm">{order.id}</td>
              <td className="px-4 py-3">{order.user}</td>
              <td className="px-4 py-3">{formatDate(order.date)}</td>
              <td className="px-4 py-3">{order.bloodType}</td>
              {activeTab === 'request' && (
                <>
                  <td className="px-4 py-3">{order.hospital || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.urgency 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.urgency ? 'Khẩn cấp' : 'Bình thường'}
                    </span>
                  </td>
                </>
              )}
              <td className="px-4 py-3">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="text-sm border rounded p-1"
                >
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Đã duyệt">Đã duyệt</option>
                  <option value="Từ chối">Từ chối</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={order.note || ''}
                  onChange={(e) => onNoteChange(order.id, e.target.value)}
                  className="text-sm border rounded p-1 w-full"
                  placeholder="Thêm ghi chú..."
                />
              </td>
              <td className="px-4 py-3 text-right">
                <button 
                  onClick={() => onViewDetail(order)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};