import React, { useState } from 'react';
import type { BloodType, BloodComponent } from '../../../types/types';

interface BloodInventoryItem {
  id: string;
  bloodType: BloodType;
  component: BloodComponent;
  quantity: number;
  expiryDate: string;
  status: 'available' | 'reserved' | 'expired';
}

const BloodInventory: React.FC = () => {
  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BloodInventoryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = () => {
    setSelectedItem({
      id: Date.now().toString(),
      bloodType: 'A+',
      component: 'whole',
      quantity: 0,
      expiryDate: new Date().toISOString().split('T')[0],
      status: 'available'
    });
    setIsEditing(true);
  };

  const handleEdit = (item: BloodInventoryItem) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      try {
        // TODO: Gọi API xóa
        setInventory(inventory.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'available' | 'reserved' | 'expired') => {
    try {
      // TODO: Gọi API cập nhật status
      setInventory(inventory.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý kho máu</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Thêm mới
        </button>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nhóm máu</th>
              <th className="px-6 py-3 text-left">Thành phần</th>
              <th className="px-6 py-3 text-left">Số lượng</th>
              <th className="px-6 py-3 text-left">Hạn sử dụng</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.bloodType}</td>
                <td className="px-6 py-4">{item.component}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">{item.expiryDate}</td>
                <td className="px-6 py-4">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as 'available' | 'reserved' | 'expired')}
                    className="border rounded px-2 py-1"
                  >
                    <option value="available">Có sẵn</option>
                    <option value="reserved">Đã đặt</option>
                    <option value="expired">Hết hạn</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
      {isEditing && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Thông tin kho máu</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nhóm máu</label>
                <select
                  value={selectedItem.bloodType}
                  onChange={(e) => setSelectedItem({ ...selectedItem, bloodType: e.target.value as BloodType })}
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
                <label className="block text-gray-700 mb-2">Thành phần</label>
                <select
                  value={selectedItem.component}
                  onChange={(e) => setSelectedItem({ ...selectedItem, component: e.target.value as BloodComponent })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="whole">Toàn phần</option>
                  <option value="plasma">Huyết tương</option>
                  <option value="platelets">Tiểu cầu</option>
                  <option value="redCells">Hồng cầu</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  value={selectedItem.quantity}
                  onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Hạn sử dụng</label>
                <input
                  type="date"
                  value={selectedItem.expiryDate}
                  onChange={(e) => setSelectedItem({ ...selectedItem, expiryDate: e.target.value })}
                  className="w-full border rounded px-3 py-2"
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

export default BloodInventory; 