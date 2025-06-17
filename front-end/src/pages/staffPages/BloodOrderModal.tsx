import React, { useState } from "react";
import { Calendar, Droplet, Hospital, AlertTriangle, Hash, Layers, FileText } from "lucide-react";
import type { BloodOrder } from "../../types/types";

interface Props {
  order: BloodOrder;
  onClose: () => void;
  onSave: (order: BloodOrder) => void;
}

export const BloodOrderModal: React.FC<Props> = ({ order, onClose, onSave }) => {
  const [editedOrder, setEditedOrder] = useState<BloodOrder>(order);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    field: keyof BloodOrder,
    value: string | boolean | number | undefined
  ) => {
    setEditedOrder((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedOrder);
    setIsEditing(false);
  };

  const bloodComponents = [
    { value: "whole_blood", label: "Máu toàn phần" },
    { value: "red_blood_cells", label: "Hồng cầu" },
    { value: "plasma", label: "Huyết tương" },
    { value: "platelets", label: "Tiểu cầu" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết đơn {order.type}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h3 className="text-lg font-medium mb-4">Thông tin người dùng</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Người dùng</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedOrder.user}
                    onChange={(e) => handleChange("user", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-800"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{order.user}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Ngày đăng ký
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedOrder.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-800"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{order.date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin y tế */}
          <div>
            <h3 className="text-lg font-medium mb-4">Thông tin y tế</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Droplet className="inline-block w-4 h-4 mr-1" />
                  Nhóm máu
                </label>
                {isEditing ? (
                  <select
                    value={editedOrder.bloodType}
                    onChange={(e) => handleChange("bloodType", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-800"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{order.bloodType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Layers className="inline-block w-4 h-4 mr-1" />
                  Thành phần máu
                </label>
                {isEditing ? (
                  <select
                    value={editedOrder.component}
                    onChange={(e) => handleChange("component", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-800"
                  >
                    {bloodComponents.map((comp) => (
                      <option key={comp.value} value={comp.value}>
                        {comp.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">
                    {bloodComponents.find(c => c.value === order.component)?.label || '-'}
                  </p>
                )}
              </div>

              {order.type === "Nhận máu" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Hash className="inline-block w-4 h-4 mr-1" />
                      Số lượng (ml)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedOrder.volume || ''}
                        onChange={(e) => handleChange("volume", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-800"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{order.volume || '-'} ml</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Hospital className="inline-block w-4 h-4 mr-1" />
                      Bệnh viện
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedOrder.hospital || ''}
                        onChange={(e) => handleChange("hospital", e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-800"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{order.hospital || '-'}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                        Mức độ khẩn cấp
                      </label>
                      {isEditing ? (
                        <select
                          value={editedOrder.urgency ? "true" : "false"}
                          onChange={(e) => handleChange("urgency", e.target.value === "true")}
                          className="mt-1 rounded-md border border-gray-300 p-2 text-gray-800"
                        >
                          <option value="true">Khẩn cấp</option>
                          <option value="false">Bình thường</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          order.urgency 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.urgency ? 'Khẩn cấp' : 'Bình thường'}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Thông tin trạng thái */}
          <div>
            <h3 className="text-lg font-medium mb-4">Thông tin trạng thái</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <select
                  value={editedOrder.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-800"
                >
                  {["Chờ duyệt", "Đã duyệt", "Từ chối", "Hoàn thành"].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <FileText className="inline-block w-4 h-4 mr-1" />
                  Ghi chú
                </label>
                <textarea
                  value={editedOrder.note || ''}
                  onChange={(e) => handleChange("note", e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-800"
                  placeholder="Thêm ghi chú..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Đóng
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Chỉnh sửa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default BloodOrderModal;