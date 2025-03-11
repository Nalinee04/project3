"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // ถ้าใช้ push หรือ back จะใช้ useRouter
import { useSearchParams } from "next/navigation";  // ใช้สำหรับดึง query parameters
import Image from "next/image";
import ProgressBar from "@/components/ui/ProgressBar";
import SweetAlert from "@/components/ui/sweetAlert";
import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  orderNumber: string;
  customerName: string;
  shopName: string;
  orderDate: string;
  status: string;
  items: CartItem[];
  note?: string;
}

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams?.get('order_id');  // ดึง order_id จาก URL query params
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (order_id) {
      const fetchOrderData = async () => {
        try {
          console.log("🚀 กำลังดึงข้อมูลคำสั่งซื้อ...");

          const response = await axios.get(`/api/orders/${order_id}`);
          console.log("✅ คำสั่งซื้อที่ได้รับ:", response.data);

          const latestOrder = response.data;
          const orderData: Order = {
            orderNumber: latestOrder.order_number,
            customerName: latestOrder.customer_name,
            shopName: latestOrder.shop_name,  // ดึงชื่อร้าน
            orderDate: new Date(latestOrder.created_at).toLocaleString(),
            status: latestOrder.status,
            items: latestOrder.items.map((item: any) => ({
              id: item.item_id,
              name: item.menu_name,
              price: Number(item.price),
              quantity: item.quantity,
              image: item.menu_image,
            })),
            note: latestOrder.note,
          };

          setOrder(orderData);
        } catch (error: any) {
          console.error("❌ ไม่สามารถดึงข้อมูลคำสั่งซื้อ:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrderData();
    }
  }, [order_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold mb-4">
            ไม่พบคำสั่งซื้อที่สำเร็จ
          </h2>
          <p>กรุณาตรวจสอบสถานะการสั่งซื้อของคุณอีกครั้ง</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <ProgressBar
        currentStep={
          order.status === "รอดำเนินการ"
            ? 1
            : order.status === "เตรียมอาหาร"
            ? 2
            : 3
        }
      />
      <SweetAlert
        orderStatus={order.status}
        onConfirm={() => router.push("/")}
      />

      {/* การ์ดเดียวรวมข้อมูลคำสั่งซื้อและรายการสินค้า */}
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          🎉 คำสั่งซื้อสำเร็จ!
        </h2>

        {/* ข้อมูลคำสั่งซื้อ */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700">
            ชื่อร้าน:{" "}
            <span className="font-semibold text-gray-900">{order.shopName}</span>
          </p>
          <p className="text-sm text-gray-700">
            เลขคำสั่งซื้อ:{" "}
            <span className="font-semibold text-gray-900">{order.orderNumber}</span>
          </p>
          <p className="text-sm text-gray-700">
            ชื่อผู้สั่งซื้อ:{" "}
            <span className="font-semibold text-gray-900">{order.customerName}</span>
          </p>
          <p className="text-sm text-gray-700">
            วันและเวลาสั่งซื้อ:{" "}
            <span className="font-semibold text-gray-900">{order.orderDate}</span>
          </p>
          <p className="text-sm text-gray-700">
            สถานะ:
            <span
              className={`font-semibold ml-2 px-2 py-1 rounded ${
                order.status === "เสร็จแล้ว"
                  ? "bg-green-200 text-green-700"
                  : "bg-yellow-200 text-yellow-700"
              }`}
            >
              {order.status}
            </span>
          </p>
        </div>

        {/* รายการสินค้า */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🛍 รายการสินค้า
        </h3>
        {order.items.length > 0 ? (
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <Image
                  src={item.image || "/images/default.jpg"}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-md border"
                />
                <div className="ml-4 flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    จำนวน: {item.quantity} | ราคา: {item.price} บาท
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">ไม่มีสินค้าในคำสั่งซื้อนี้</p>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
