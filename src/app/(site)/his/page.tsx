"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ใช้ useRouter
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

interface Order {
  order_id: string;
  order_number: string;
  customer_name: string;
  totalAmount: number;
  created_at: string;
  status: string;
  shop_name: string;
  items: {
    item_id: string;
    menu_name: string;
    price: number;
    quantity: number;
    menu_image: string;
  }[];
}

const HistoryPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/history", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        setOrders(data); // เซ็ตออเดอร์ที่เสร็จแล้ว
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // ฟังก์ชันคลิกที่ออเดอร์เพื่อไปที่หน้ารายละเอียด
  const handleOrderClick = (orderId: string) => {
    router.push(`/order/${orderId}`); // ไปที่หน้า [order_id]/page.tsx
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📜 ประวัติการสั่งซื้อ</h2>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            ไม่มีออเดอร์ที่เสร็จแล้ว
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              className="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer"
              onClick={() => handleOrderClick(order.order_id)} // คลิกไปที่หน้ารายละเอียดของออเดอร์
            >
              {/* รูปเมนู */}
              {order.items && order.items[0]?.menu_image && (
                <Image
                  src={order.items[0].menu_image}
                  alt={order.items[0].menu_name}
                  width={50}
                  height={50}
                  className="rounded-lg mr-4"
                />
              )}
              <div className="flex-1">
                <h3 className="text-md font-semibold text-gray-800">
                  {/* ตรวจสอบว่า items มีอย่างน้อย 1 ไอเท็ม */}
                  {order.items?.[0]?.menu_name}{" "}
                  {order.items && order.items.length > 1 ? "และอื่นๆ" : ""}
                </h3>
                <p className="text-sm text-gray-600">
                  ร้าน: {order.shop_name || "ไม่ระบุร้าน"}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  ฿{Number(order.totalAmount).toFixed(2)}
                </p>
                <span
                  className={`text-sm py-1 px-3 rounded-full font-medium inline-flex items-center shadow-sm ${
                    order.status === "เสร็จแล้ว"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <FaCheckCircle className="mr-1" />
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
