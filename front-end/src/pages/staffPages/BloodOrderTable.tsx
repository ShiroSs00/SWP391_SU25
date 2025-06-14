import React from 'react';
import { formatDate } from '../../utils/formatDate';
import type { BloodOrder } from '../../types/types';
import { AlertCircle, CheckCircle, XCircle, ClipboardCheck } from 'lucide-react';

interface BloodOrderTableProps {
  orders: BloodOrder[];
  activeTab: 'donation' | 'request';
  onStatusChange: (orderId: number, status: BloodOrder["status"]) => void;
  onNoteChange: (orderId: number, note: string) => void;
  onViewDetail: (order: BloodOrder) => void;
}

const getStatusIcon = (status: BloodOrder["status"]) => {
  switch (status) {
    case "Chờ duyệt":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "Đã duyệt":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "Từ chối":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "Hoàn thành":
      return <ClipboardCheck className="w-5 h-5 text-blue-500" />;
    default:
      return null;
  }
};

export const BloodOrderTable: React.FC<BloodOrderTableProps> = ({
  orders,
  activeTab,
  onStatusChange,
  onNoteChange,
  onViewDetail
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Người dùng
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Ngày
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Nhóm máu
            </th>
            {activeTab === 'request' && (
              <>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Bệnh viện
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Khẩn cấp
                </th>
              </>
            )}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Ghi chú
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                #{order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-800">{order.user}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {order.date ? formatDate(order.date) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  {order.bloodType}
                </span>
              </td>
              {activeTab === 'request' && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.hospital || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.urgency 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.urgency ? 'Khẩn cấp' : 'Bình thường'}
                    </span>
                  </td>
                </>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value as BloodOrder["status"])}
                    className="ml-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-800"
                  >
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Từ chối">Từ chối</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={order.note || ''}
                  onChange={(e) => onNoteChange(order.id, e.target.value)}
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 w-full text-gray-800"
                  placeholder="Thêm ghi chú..."
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onViewDetail(order)}
                  className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
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