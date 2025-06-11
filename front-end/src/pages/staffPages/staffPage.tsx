import React, { useEffect, useState } from "react";
import BloodOrderEditForm from "../../forms/BloodOrderForm";
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
  const [activeTab, setActiveTab] = useState<"donations" | "requests">("donations");

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

        {/* Tab navigation */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "donations"
                ? "bg-red-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("donations")}
          >
            Đơn hiến máu
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "requests"
                ? "bg-red-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Đơn nhận máu
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow-md">
          {activeTab === "donations" ? (
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Người hiến</th>
                    <th className="pb-3">Ngày</th>
                    <th className="pb-3">Trạng thái</th>
                    <th className="pb-3">Nhóm máu</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} className="border-b">
                      <td className="py-3">{donation.id}</td>
                      <td>{donation.user}</td>
                      <td>{donation.date}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          donation.status === "Đã duyệt"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td>{donation.bloodType}</td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(donation)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Người nhận</th>
                    <th className="pb-3">Ngày</th>
                    <th className="pb-3">Trạng thái</th>
                    <th className="pb-3">Bệnh viện</th>
                    <th className="pb-3">Khẩn cấp</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b">
                      <td className="py-3">{request.id}</td>
                      <td>{request.user}</td>
                      <td>{request.date}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          request.status === "Đã nhận"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td>{request.hospital}</td>
                      <td>
                        {request.urgency ? (
                          <span className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-800">
                            Khẩn cấp
                          </span>
                        ) : (
                          "Không"
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(request)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for editing */}
      {editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết {editOrder.type}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <BloodOrderEditForm
              order={editOrder}
              onChange={setEditOrder}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;