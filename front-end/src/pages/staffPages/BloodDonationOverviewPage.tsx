import React, { useState } from "react";
import { User, Hospital, ClipboardList, BarChart } from 'lucide-react';
import { BloodOrderTable } from "./BloodOrderTable";
import { BloodOrderModal } from "./BloodOrderModal";
import type { BloodOrder } from "../../types/types";

// Dummy data for demonstration
const mockOrders: BloodOrder[] = [
  {
    id: 1,
    user: "Trần Thị B",
    date: "2024-06-16",
    bloodType: "O+",
    hospital: "Bệnh viện Chợ Rẫy",
    urgency: true,
    status: "Đã duyệt",
    note: "Cần gấp",
    type: "Hiến máu",
  },
  {
    id: 2,
    user: "Nguyễn Văn A",
    date: "2024-06-15",
    bloodType: "A-",
    hospital: "Bệnh viện 115",
    urgency: false,
    status: "Chờ duyệt",
    note: "",
    type: "Nhận máu",
  },
  {
    id: 3,
    user: "Lê Thị C",
    date: "2024-06-14",
    bloodType: "AB+",
    hospital: "Bệnh viện Đại học Y Dược",
    urgency: true,
    status: "Từ chối",
    note: "Không đủ điều kiện",
    type: "Hiến máu",
  },
  {
    id: 4,
    user: "Phạm Văn D",
    date: "2024-06-13",
    bloodType: "B+",
    hospital: "Bệnh viện Truyền máu Huyết học",
    urgency: false,
    status: "Hoàn thành",
    note: "",
    type: "Nhận máu",
  },
];

const BloodDonationOverviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"donation" | "request">("donation");
  const [orders, setOrders] = useState<BloodOrder[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<BloodOrder | null>(null);

  const filteredOrders = orders.filter((order) =>
    activeTab === "donation"
      ? order.type === "Hiến máu"
      : order.type === "Nhận máu"
  );

  const getStatusColor = (status: BloodOrder["status"]) => {
    switch (status) {
      case "Chờ duyệt":
        return "bg-yellow-100 text-yellow-700";
      case "Đã duyệt":
        return "bg-green-100 text-green-700";
      case "Từ chối":
        return "bg-red-100 text-red-700";
      case "Hoàn thành":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = (orderId: number, newStatus: BloodOrder["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleNoteChange = (orderId: number, newNote: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, note: newNote } : order
      )
    );
  };

  const handleUpdateOrder = (updatedOrder: BloodOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    setSelectedOrder(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý đơn hiến máu & nhận máu
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Theo dõi và quản lý các đơn hiến máu và yêu cầu nhận máu
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <BarChart className="w-4 h-4 mr-2" />
            Báo cáo
          </button>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === "donation"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("donation")}
          >
            <User className="inline-block w-4 h-4 mr-2" />
            Đơn hiến máu ({orders.filter((o) => o.type === "Hiến máu").length})
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === "request"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("request")}
          >
            <Hospital className="inline-block w-4 h-4 mr-2" />
            Đơn nhận máu ({orders.filter((o) => o.type === "Nhận máu").length})
          </button>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {["Chờ duyệt", "Đã duyệt", "Từ chối", "Hoàn thành"].map((status) => (
          <div key={status} className="bg-white rounded-lg shadow-sm p-6 transition-transform duration-200 hover:transform hover:scale-105">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${getStatusColor(status)}`}>
                <ClipboardList className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-700">{status}</h3>
                <p className="text-2xl font-bold mt-1 text-gray-800">
                  {filteredOrders.filter((order) => order.status === status).length}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <BloodOrderTable
          orders={filteredOrders}
          activeTab={activeTab}
          onStatusChange={handleStatusChange}
          onNoteChange={handleNoteChange}
          onViewDetail={setSelectedOrder}
        />
      </div>

      {/* Modal */}
      {selectedOrder && (
        <BloodOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSave={handleUpdateOrder}
        />
      )}
    </div>
  );
};

export default BloodDonationOverviewPage; 