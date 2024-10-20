"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  orderNumber: string;
  customerName: string;
  status: string;
  date: string; // Example: "2024-10-08"
  time: string; // Example: "14:30"
  items: { id: string; name: string; price: number; quantity: number; image: string }[]; // Items in the order
  shippingAddress: string; // Added to show shipping address in the modal
}

const OrderHistoryPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const userName = "john_doe"; // ดึงชื่อผู้ใช้จาก context หรือ global state

  useEffect(() => {
    // Fetch order history from localStorage or API
    const storedOrders = JSON.parse(localStorage.getItem(`${userName}_orders`) || "[]");
    setOrders(storedOrders); // Load orders for the specific user
  }, []);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow p-6 rounded w-full max-w-md text-center">
          <h2 className="text-lg font-semibold">No Orders Found</h2>
          <button
            className="bg-black text-white px-4 py-2 rounded mt-4"
            onClick={() => router.push("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-center mb-6">Order History</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="mb-6 border-b border-gray-200 pb-4 flex justify-between items-center cursor-pointer"
            onClick={() => handleOrderClick(order)}
          >
            <div>
              <h3 className="text-md font-semibold">Order #{order.orderNumber}</h3>
              <div className="text-sm text-gray-600">
                <p>Customer: {order.customerName}</p>
                <p>Date: {order.date}</p>
                <p>Time: {order.time}</p>
              </div>
            </div>
            <span className={`text-sm py-1 px-2 rounded-full ml-4 ${
              order.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {order.status}
            </span>
          </div>
        ))}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 max-w-md">
              <h2 className="text-lg font-bold mb-2">Order Details</h2>
              <h3 className="text-md font-semibold">Order #{selectedOrder.orderNumber}</h3>
              <p>Customer: {selectedOrder.customerName}</p>
              <p>Date: {selectedOrder.date}</p>
              <p>Time: {selectedOrder.time}</p>
              <p>Status: {selectedOrder.status}</p>
              <h3 className="text-md font-semibold mt-4">Items:</h3>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-8 w-8 rounded-md"
                    />
                    <span>{item.name} (x{item.quantity})</span>
                  </div>
                  <span>฿{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold mt-2">
                <span>Total:</span>
                <span>฿{selectedOrder.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <h3 className="text-md font-semibold mt-4">Shipping Address:</h3>
              <p>{selectedOrder.shippingAddress}</p>
              <div className="text-center mt-4">
                <button
                  className="bg-black text-white px-4 py-2 rounded"
                  onClick={closeDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            className="bg-black text-white px-4 py-2 rounded mt-6"
            onClick={() => router.push("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
