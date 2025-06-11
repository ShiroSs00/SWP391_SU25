import React, { useState } from "react";
import { BloodOrderModal } from "./BloodOrderModal";
import { BloodOrderTable } from "./BloodOrderTable";
interface BloodOrder {
  id: number;
  user: string;
  type: "Hiến máu" | "Nhận máu";
  date: string;
  status: string;
  bloodType: string;
  hospital?: string;
  urgency?: boolean;
  note?: string;
}

const mockOrders: BloodOrder[] = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    type: "Hiến máu", 
    date: "2024-06-15",
    status: "Chờ duyệt",
    bloodType: "A+",
    note: "",
  },
  {
    id: 2,
    user: "Trần Thị B",
    type: "Nhận máu",
    date: "2024-06-16",
    status: "Đã duyệt",
    bloodType: "O+",
    hospital: "Bệnh viện Chợ Rẫy",
    urgency: true,
    note: "Cần gấp",
  },
];

const StaffPage = () => {
  const [activeTab, setActiveTab] = useState<"donation" | "request">("donation");
  const [orders, setOrders] = useState<BloodOrder[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<BloodOrder | null>(null);

  const filteredOrders = orders.filter((order) =>
    activeTab === "donation" ? order.type === "Hiến máu" : order.type === "Nhận máu"
  );

  // Hàm xử lý cập nhật toàn bộ thông tin đơn
  const handleUpdateOrder = (updatedOrder: BloodOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setSelectedOrder(null);
  };

  // Hàm xử lý cập nhật trạng thái
  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Hàm xử lý cập nhật ghi chú
  const handleNoteChange = (orderId: number, newNote: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, note: newNote } : order
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-2xl font-bold text-red-600 mb-6">
        Quản lý đơn hiến máu & nhận máu
      </h1>

      {/* Tab buttons */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-sm font-medium mr-4 border-b-2 ${
            activeTab === "donation"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-800 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("donation")}
        >
          Đơn hiến máu ({orders.filter((o) => o.type === "Hiến máu").length})
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium border-b-2 ${
            activeTab === "request"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-800 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("request")}
        >
          Đơn nhận máu ({orders.filter((o) => o.type === "Nhận máu").length})
        </button>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["Chờ duyệt", "Đã duyệt", "Từ chối", "Hoàn thành"].map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600">{status}</h3>
            <p className="text-2xl font-bold mt-1 text-gray-800">
              {filteredOrders.filter((order) => order.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <BloodOrderTable
        orders={filteredOrders}
        activeTab={activeTab}
        onStatusChange={handleStatusChange}
        onNoteChange={handleNoteChange}
        onViewDetail={setSelectedOrder}
      />

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

export default StaffPage;