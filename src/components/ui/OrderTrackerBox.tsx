"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface Order {
  order_id: string;
  order_number: string;
  status: string;
  shop_name: string;
}

const OrderTrackerBox = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // ✅ เช็ค pathname ที่ได้รับมา
  console.log("📌 Current Path:", pathname);

  // ✅ ปรับให้รองรับหน้า "/" ด้วย (กรณีหน้าแรกเป็น "/")
  const allowedPages = ["/", "/home", "/cart-empty", "/history"];
  const isAllowedPage = allowedPages.includes(pathname);

  useEffect(() => {
    if (!isAllowedPage) return;

    const fetchLatestOrder = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data: Order[] = await response.json();
        console.log("📌 Orders Data:", data); // ✅ Debug API Response

        const ongoingOrders = data.filter(
          (order) => order.status !== "เสร็จแล้ว"
        );

        if (ongoingOrders.length > 0) {
          setLatestOrder(ongoingOrders[0]);
        }
      } catch (error) {
        console.error("Error fetching latest order:", error);
      }
    };

    fetchLatestOrder();
  }, [pathname]); // ✅ เปลี่ยนเป็น pathname เพื่อให้ useEffect อัปเดตเสมอ

  if (!latestOrder || !isAllowedPage) return null;

  return (
    <div
      className="fixed bottom-16 left-4 right-4 p-3 bg-white shadow-lg rounded-lg flex justify-between items-center cursor-pointer"
      onClick={() => router.push(`/orders/${latestOrder.order_id}`)}
    >
      <div>
        <p className="text-sm text-gray-600">กำลังดำเนินการ...</p>
        <p className="font-semibold">{latestOrder.shop_name}</p>
      </div>
      <button className="text-blue-600 text-sm">ดูสถานะ</button>
    </div>
  );
};

export default OrderTrackerBox;
