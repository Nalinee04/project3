"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

interface Order {
  order_id: string;
  order_number: string;  // เพิ่ม order_number ในแบบจำลองข้อมูล
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

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const today = new Date().toISOString().split("T")[0];
        const todayOrders = data
          .filter((order: Order) => order.created_at.startsWith(today) && order.status !== "เสร็จแล้ว")
          .map((order: Order) => ({
            ...order,
            shop_name: order.shop_name || "ไม่ระบุร้าน",
          }));

        setOrders(todayOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // ฟังก์ชันในการคลิกออเดอร์
  const handleOrderClick = (orderId: string) => {
    // ไปที่หน้า success และส่งข้อมูล orderId ไปด้วย
    router.push(`/success?order_id=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📌 ออเดอร์ล่าสุด</h2>
        <button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center shadow-sm hover:bg-gray-300"
          onClick={() => router.push("/his")} // ✅ แก้ให้กดแล้วไปหน้า history
        >
          <FaClock className="mr-2" /> ประวัติ
        </button>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            ไม่มีออเดอร์ที่รอดดำเนินการ
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              className="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer"
              onClick={() => handleOrderClick(order.order_id)} // ✅ ไปหน้า success
            >
              {/* รูปเมนู */}
              {order.items[0]?.menu_image && (
                <Image
                  src={order.items[0].menu_image}
                  alt={order.items[0].menu_name}
                  width={50}
                  height={50}
                  className="rounded-lg mr-4"
                />
              )}
              <div className="flex-1">
                {/* เลขคำสั่งซื้อในบรรทัดเดียวกัน */}
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  <span className="inline-block">เลขคำสั่งซื้อ: </span>
                  <span className="inline-block font-extrabold text-gray-900">
                    {order.order_number}
                  </span>
                </p>

                {/* ชื่อเมนู */}
                <h3 className="text-md font-medium text-gray-700">
                  {order.items[0]?.menu_name}{" "}
                  {order.items.length > 1 ? "และอื่นๆ" : ""}
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
                    order.status === "รอดำเนินการ"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status === "รอดำเนินการ" ? (
                    <FaClock className="mr-1" />
                  ) : (
                    <FaCheckCircle className="mr-1" />
                  )}
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

export default OrdersPage;
