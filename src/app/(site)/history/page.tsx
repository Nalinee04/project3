//app/history
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  order_id: string; // เปลี่ยนเป็น order_id
  order_number: string; // เปลี่ยนเป็น order_number
  customer_name: string; // เปลี่ยนเป็น customer_name
  totalAmount: number; // เพิ่มฟิลด์ totalAmount
  shipping_address?: string; // หากมีข้อมูลนี้ใน API ให้เพิ่ม
  created_at: string; // เปลี่ยนเป็น created_at
  deliveryTime: string; // เพิ่มฟิลด์ deliveryTime
  status: string;
  is_rainy?: boolean; // เปลี่ยนเป็น is_rainy
  items: {
    item_id: string;
    menu_name: string;
    price: number;
    quantity: number;
    menu_image: string;
  }[]; // Items in the order
}

const OrderHistoryPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const userName = "john_doe"; // ดึงชื่อผู้ใช้จาก context หรือ global state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/history");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // กรองเฉพาะออเดอร์ที่มีสถานะ "เสร็จแล้ว"
        const completedOrders = data.filter(
          (order: Order) => order.status === "เสร็จแล้ว"
        );

        setOrders(completedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
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
          <h2 className="text-lg font-semibold">
            ยังไม่มีคำสั่งซื้อที่เสร็จแล้ว
          </h2>
          <button
            className="bg-black text-white px-4 py-2 rounded mt-4"
            onClick={() => router.push("/home")}
          >
            เริ่มสั่งซื้อเลย
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-center mb-6">Order History</h2>

        {orders.map((order) => (
          <div
            key={order.order_id}
            className="mb-6 border-b border-gray-200 pb-4 flex justify-between items-center cursor-pointer"
            onClick={() => handleOrderClick(order)}
          >
            <div>
              <h3 className="text-md font-semibold">
                Order #{order.order_number}
              </h3>
              <div className="text-sm text-gray-600">
                <p>Customer: {order.customer_name}</p>
                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p>
                  Time:{" "}
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <span
              className={`text-sm py-1 px-2 rounded-full ml-4 ${
                order.status === "เสร็จแล้ว"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        ))}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 max-w-md">
              <h2 className="text-lg font-bold mb-2">Order Details</h2>
              <h3 className="text-md font-semibold">
                Order #{selectedOrder.order_number}
              </h3>
              <p>Customer: {selectedOrder.customer_name}</p>
              <p>
                Date: {new Date(selectedOrder.created_at).toLocaleDateString()}
              </p>
              <p>
                Time:{" "}
                {new Date(selectedOrder.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>Status: {selectedOrder.status}</p>
              <h3 className="text-md font-semibold mt-4">Items:</h3>
              {selectedOrder.items.map((item) => (
                <div key={item.item_id} className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.menu_image}
                      alt={item.menu_name}
                      className="h-8 w-8 rounded-md"
                    />
                    <span>
                      {item.menu_name} (x{item.quantity})
                    </span>
                  </div>
                  <span>฿{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold mt-2">
                <span>Total:</span>
                <span>
                  ฿
                  {selectedOrder.items
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <h3 className="text-md font-semibold mt-4">Shipping Address:</h3>
              <p>{selectedOrder.shipping_address}</p>
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
