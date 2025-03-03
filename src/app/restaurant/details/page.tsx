"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

interface OrderItem {
  menu_name: string;
  quantity: number;
  price: number;
  menu_image: string;
}

const OrderDetailsPage = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");
  const { data: session } = useSession();
  const router = useRouter();

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [orderStatus, setOrderStatus] = useState("รอการยืนยัน");

  useEffect(() => {
    if (!order_id || !session?.accessToken) return;

    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`/api/order_items?order_id=${order_id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();
        console.log("📡 API Order Data:", data);

        setOrderStatus(data.order_status);
        setOrderItems(data.items);

        if (data.total_amount !== undefined) {
          setTotalAmount(data.total_amount);
        } else {
          const calculatedTotal = data.items.reduce(
            (sum: number, item: OrderItem) => sum + item.quantity * item.price,
            0
          );
          setTotalAmount(calculatedTotal);
        }
      } catch (error) {
        console.error("❌ Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [order_id, session?.accessToken]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!session?.accessToken || !order_id) return;

    const confirmText =
      newStatus === "ยกเลิก"
        ? "⚠️ ต้องการยกเลิกออเดอร์นี้ใช่หรือไม่?"
        : `ยืนยันเปลี่ยนสถานะเป็น \"${newStatus}\"?`;

    const result = await Swal.fire({
      title: "ยืนยันการเปลี่ยนสถานะ",
      text: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ดำเนินการ!",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    setIsUpdating(true);

    try {
      const res = await fetch("/api/update-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ order_id, status: newStatus }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      setOrderStatus(newStatus);
      Swal.fire("สำเร็จ!", "สถานะถูกอัปเดตเรียบร้อยแล้ว", "success");
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปเดตสถานะได้", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">กำลังโหลด...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 🔥 Header สีเหลืองเต็มจอ */}
      <div className="bg-yellow-500 text-white py-4 w-full flex items-center relative">
        {/* ปุ่มย้อนกลับ (อยู่ซ้าย) */}
        <button
          onClick={() => router.back()}
          className="absolute left-4 flex items-center space-x-2 text-white hover:opacity-80"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium"></span>
        </button>
        {/* ตรงกลาง Header */}
        <span className="text-xl font-semibold mx-auto">รายละเอียดคำสั่งซื้อ</span>
      </div>

      {/* 📦 กล่องแสดงคำสั่งซื้อ */}
      <div className="p-4">
        <Card className="shadow-md bg-white rounded-lg border border-gray-200 p-4">
          <CardContent>
            <h1 className="text-xl font-semibold text-gray-800">📦 คำสั่งซื้อ #{order_id}</h1>
            <h2 className="mt-4 text-lg font-semibold text-gray-700">🛒 รายการสินค้า</h2>
            {orderItems.length === 0 ? (
              <p className="text-gray-600">ไม่มีรายการสินค้า</p>
            ) : (
              <ul className="space-y-3 mt-3">
                {orderItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-100 p-3 shadow-sm rounded-md">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.menu_image}
                        alt={item.menu_name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                      <div>
                        <p className="text-md font-medium text-gray-800">{item.menu_name}</p>
                        <p className="text-gray-600 text-sm">จำนวน: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-md font-semibold text-gray-900">
                      {item.quantity} x {item.price} ฿
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* 💰 แสดงยอดรวม */}
            <h2 className="mt-4 text-lg font-semibold text-gray-700">💰 ยอดรวม</h2>
            <p className="text-2xl font-bold text-green-600 mt-1">{totalAmount.toFixed(2)} ฿</p>

            {/* 🔘 ปุ่มเปลี่ยนสถานะ */}
            <div className="flex flex-col space-y-2 mt-4">
              {orderStatus === "รอดำเนินการ" && (
                <button onClick={() => handleUpdateStatus("เตรียมอาหาร")} className="py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600">
                  🍽 เตรียมอาหาร
                </button>
              )}
              {orderStatus === "เตรียมอาหาร" && (
                <button onClick={() => handleUpdateStatus("เสร็จแล้ว")} className="py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">
                  ✅ เสร็จแล้ว
                </button>
              )}
              {(orderStatus === "รอดำเนินการ" || orderStatus === "เตรียมอาหาร") && (
                <button onClick={() => handleUpdateStatus("ยกเลิก")} className="py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600">
                  ❌ ยกเลิกออเดอร์
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
