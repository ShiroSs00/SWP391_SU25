import React, { useEffect, useState } from "react";

// Giả lập API lấy danh sách đơn hiến máu và nhận máu
const mockDonations = [
  {
    id: 1,
    user: "Nguyen Van A",
    type: "Hiến máu",
    date: "2024-06-01",
    status: "Đã duyệt",
    note: "Hiến máu nhóm O, lần 2",
    bloodType: "O",
    component: "Hồng cầu",
    eventId: 101,
    volume: 350,
  },
  {
    id: 2,
    user: "Tran Thi B",
    type: "Hiến máu",
    date: "2024-06-02",
    status: "Chờ duyệt",
    note: "Hiến máu nhóm A, lần đầu",
    bloodType: "A",
    component: "Máu toàn phần",
    eventId: 102,
    volume: 250,
  },
];
const mockRequests = [
  {
    id: 1,
    user: "Le Van C",
    type: "Nhận máu",
    date: "2024-06-03",
    status: "Đã nhận",
    note: "Cần máu nhóm B, cấp cứu",
    bloodType: "B",
    component: "Huyết tương",
    hospital: "BV Chợ Rẫy",
    quantity: 2,
    urgency: true,
    urgencyReason: "Tai nạn giao thông",
  },
  {
    id: 2,
    user: "Pham Thi D",
    type: "Nhận máu",
    date: "2024-06-04",
    status: "Chờ xử lý",
    note: "Cần máu nhóm AB, phẫu thuật",
    bloodType: "AB",
    component: "Tiểu cầu",
    hospital: "BV Bạch Mai",
    quantity: 1,
    urgency: false,
    urgencyReason: "",
  },
];

interface BloodOrder {
  id: number;
  user: string;
  type: string;
  date: string;
  status: string;
  note?: string;
  bloodType?: string;
  component?: string;
  eventId?: number;
  volume?: number;
  hospital?: string;
  quantity?: number;
  urgency?: boolean;
  urgencyReason?: string;
}

const StaffPage: React.FC = () => {
  const [donations, setDonations] = useState<BloodOrder[]>([]);
  const [requests, setRequests] = useState<BloodOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<BloodOrder | null>(null);
  const [editOrder, setEditOrder] = useState<BloodOrder | null>(null);

  useEffect(() => {
    setDonations(mockDonations);
    setRequests(mockRequests);
  }, []);

  useEffect(() => {
    setEditOrder(selectedOrder ? { ...selectedOrder } : null);
  }, [selectedOrder]);

  const handleSave = () => {
    if (!editOrder) return;
    if (editOrder.type === "Hiến máu") {
      setDonations((prev) =>
        prev.map((d) => (d.id === editOrder.id ? editOrder : d))
      );
    } else {
      setRequests((prev) =>
        prev.map((r) => (r.id === editOrder.id ? editOrder : r))
      );
    }
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Quản lý đơn hiến máu & nhận máu
        </h1>
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-red-500">
            Tất cả đơn hiến máu
          </h2>
          <div className="bg-white rounded shadow p-4">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Người hiến</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="py-2">{d.id}</td>
                    <td>{d.user}</td>
                    <td>{d.date}</td>
                    <td>{d.status}</td>
                    <td>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setSelectedOrder(d)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-red-500">
            Tất cả đơn nhận máu
          </h2>
          <div className="bg-white rounded shadow p-4">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Người nhận</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.id}</td>
                    <td>{r.user}</td>
                    <td>{r.date}</td>
                    <td>{r.status}</td>
                    <td>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setSelectedOrder(r)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal chi tiết & chỉnh sửa */}
      {editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-sm relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-red-600">
              Chỉnh sửa {editOrder.type}
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">ID:</span> {editOrder.id}
              </div>
              <div>
                <span className="font-semibold">
                  {editOrder.type === "Hiến máu" ? "Người hiến" : "Người nhận"}:
                </span>{" "}
                <input
                  className="border rounded px-2 py-1 w-40"
                  value={editOrder.user}
                  onChange={e =>
                    setEditOrder({ ...editOrder, user: e.target.value })
                  }
                />
              </div>
              <div>
                <span className="font-semibold">Ngày:</span>{" "}
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-40"
                  value={editOrder.date}
                  onChange={e =>
                    setEditOrder({ ...editOrder, date: e.target.value })
                  }
                />
              </div>
              <div>
                <span className="font-semibold">Trạng thái:</span>{" "}
                <input
                  className="border rounded px-2 py-1 w-40"
                  value={editOrder.status}
                  onChange={e =>
                    setEditOrder({ ...editOrder, status: e.target.value })
                  }
                />
              </div>
              <div>
                <span className="font-semibold">Ghi chú:</span>{" "}
                <input
                  className="border rounded px-2 py-1 w-40"
                  value={editOrder.note || ""}
                  onChange={e =>
                    setEditOrder({ ...editOrder, note: e.target.value })
                  }
                />
              </div>
              {"bloodType" in editOrder && (
                <div>
                  <span className="font-semibold">Nhóm máu:</span>{" "}
                  <input
                    className="border rounded px-2 py-1 w-40"
                    value={editOrder.bloodType || ""}
                    onChange={e =>
                      setEditOrder({ ...editOrder, bloodType: e.target.value })
                    }
                  />
                </div>
              )}
              {"component" in editOrder && (
                <div>
                  <span className="font-semibold">Thành phần máu:</span>{" "}
                  <input
                    className="border rounded px-2 py-1 w-40"
                    value={editOrder.component || ""}
                    onChange={e =>
                      setEditOrder({ ...editOrder, component: e.target.value })
                    }
                  />
                </div>
              )}
              {"eventId" in editOrder && editOrder.eventId !== undefined && (
                <div>
                  <span className="font-semibold">Mã sự kiện:</span>{" "}
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-40"
                    value={editOrder.eventId}
                    onChange={e =>
                      setEditOrder({
                        ...editOrder,
                        eventId: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
              {"volume" in editOrder && editOrder.volume !== undefined && (
                <div>
                  <span className="font-semibold">Thể tích (ml):</span>{" "}
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-40"
                    value={editOrder.volume}
                    onChange={e =>
                      setEditOrder({
                        ...editOrder,
                        volume: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
              {"hospital" in editOrder && (
                <div>
                  <span className="font-semibold">Bệnh viện:</span>{" "}
                  <input
                    className="border rounded px-2 py-1 w-40"
                    value={editOrder.hospital || ""}
                    onChange={e =>
                      setEditOrder({
                        ...editOrder,
                        hospital: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              {"quantity" in editOrder && editOrder.quantity !== undefined && (
                <div>
                  <span className="font-semibold">Số lượng đơn vị:</span>{" "}
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-40"
                    value={editOrder.quantity}
                    onChange={e =>
                      setEditOrder({
                        ...editOrder,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
              {"urgency" in editOrder && (
                <div>
                  <span className="font-semibold">Khẩn cấp:</span>{" "}
                  <select
                    className="border rounded px-2 py-1 w-40"
                    value={editOrder.urgency ? "true" : "false"}
                    onChange={e =>
                      setEditOrder({
                        ...editOrder,
                        urgency: e.target.value === "true",
                      })
                    }
                  >
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
                </div>
              )}
              {"urgencyReason" in editOrder && (
                <div>
                  <span className="font-semibold">Lý do khẩn cấp:</span>{" "}
                  <input
                    className="border rounded px-2 py-1 w-40"
                    value={editOrder.urgencyReason || ""}
                    onChange={e =>
                      setEditOrder({
                        ...editOrder,
                        urgencyReason: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setSelectedOrder(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;