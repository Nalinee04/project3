"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BottomNavRestaurant from "@/app/components/BottomNavRestaurant";

interface Order {
  order_id: number;
  order_number: string;
  customer_name: string;
  created_at: string;
  status: string;
}

const OrderHistory = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [ordersInProgress, setOrdersInProgress] = useState<Order[]>([]);  // เตรียมอาหาร
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);  // เสร็จแล้ว
  const [cancelledOrders, setCancelledOrders] = useState<Order[]>([]);  // ยกเลิก
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);
      const [inProgressRes, completedRes, cancelledRes] = await Promise.all([
        fetch("/api/prepare", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }),
        fetch("/api/history", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }),
        fetch("/api/cancel", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }),
      ]);

      if (!inProgressRes.ok || !completedRes.ok || !cancelledRes.ok) {
        throw new Error("Error fetching orders");
      }

      const [inProgressData, completedData, cancelledData] = await Promise.all([
        inProgressRes.json(),
        completedRes.json(),
        cancelledRes.json(),
      ]);

      setOrdersInProgress(inProgressData);
      setCompletedOrders(completedData);
      setCancelledOrders(cancelledData);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "shop") {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [session, status]);

  const renderOrderList = (orders: Order[], statusText: string, statusColor: string) => (
    <>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">{statusText}</h3>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีออเดอร์ในสถานะนี้</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <Link href={`/restaurant/details?order_id=${order.order_id}`} key={order.order_id}>
              <li className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition duration-300 cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    #{order.order_number}
                  </h3>
                  <span className={`text-sm font-semibold ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
                <p className="text-gray-600">👤 {order.customer_name}</p>
                <p className="text-gray-500">📅 {new Date(order.created_at).toLocaleString()}</p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-10">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 right-0 bg-yellow-500 p-4 flex items-center justify-between text-white shadow-md z-10">
        <button onClick={() => router.back()} className="text-white">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">📜 ประวัติออเดอร์</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="mt-16 px-4"> {/* ลดระยะห่างจากขอบบน */}
        {loading ? (
          <p className="text-center text-gray-500">กำลังโหลด...</p>
        ) : (
          <>
            {renderOrderList(ordersInProgress, "เตรียมอาหาร", "text-yellow-500")}
            <hr className="my-4 border-t border-gray-200" />
            {renderOrderList(completedOrders, "เสร็จแล้ว", "text-green-500")}
            <hr className="my-4 border-t border-gray-200" />
            {renderOrderList(cancelledOrders, "ยกเลิก", "text-red-500")}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavRestaurant />
    </div>
  );
};

export default OrderHistory;
