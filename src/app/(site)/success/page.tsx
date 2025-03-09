//app/success
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  orderDate: string;
  status: string;
  items: CartItem[];
  note?: string;
}

const SuccessPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        console.log("🚀 กำลังดึงข้อมูลคำสั่งซื้อ...");

        const response = await axios.get("/api/orders");
        console.log("✅ คำสั่งซื้อที่ได้รับ:", response.data);

        const fetchedOrders = response.data;
        if (!Array.isArray(fetchedOrders) || fetchedOrders.length === 0) {
          console.warn("⚠️ ไม่พบคำสั่งซื้อ! กลับหน้าแรก...");
          return router.push("/");
        }

        const latestOrder = fetchedOrders[0];
        const orderId = latestOrder.order_id;
        if (!orderId) throw new Error("ไม่พบ order_id");

        console.log("📌 กำลังดึงข้อมูลรายการสินค้า...");

        const { data: fetchedOrderItems } = await axios.get(`/api/order_items?order_id=${orderId}`);
        console.log("✅ รายการสินค้าที่ได้รับ:", fetchedOrderItems);

        // ✅ ตรวจสอบว่า `fetchedOrderItems.items` เป็น array
        const itemsArray = Array.isArray(fetchedOrderItems.items) ? fetchedOrderItems.items : [];

        const orderData: Order = {
          orderNumber: latestOrder.order_number,
          customerName: latestOrder.customer_name,
          orderDate: new Date(latestOrder.created_at).toLocaleString(),
          status: latestOrder.status,
          items: Array.isArray(fetchedOrderItems.items) ? fetchedOrderItems.items.map((item: any) => ({
            id: item.item_id,
            name: item.menu_name,
            price: Number(item.price),
            quantity: item.quantity,
            image: item.menu_image,
          })) : [],
          
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
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>กำลังโหลด...</p></div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold mb-4">ไม่พบคำสั่งซื้อที่สำเร็จ</h2>
          <p>กรุณาตรวจสอบสถานะการสั่งซื้อของคุณอีกครั้ง</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <ProgressBar currentStep={order.status === "รอดำเนินการ" ? 1 : order.status === "เตรียมอาหาร" ? 2 : 3} />
      <SweetAlert orderStatus={order.status} onConfirm={() => router.push("/")} />

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold mb-6">คำสั่งซื้อสำเร็จ</h2>
        <p className="text-sm">เลขคำสั่งซื้อ: <span className="font-medium">{order.orderNumber}</span></p>
        <p className="text-sm">ชื่อผู้สั่งซื้อ: <span className="font-medium">{order.customerName}</span></p>
        <p className="text-sm">วันและเวลาสั่งซื้อ: <span className="font-medium">{order.orderDate}</span></p>
        <p className="text-sm">สถานะ: <span className={`font-medium ${order.status === "เสร็จแล้ว" ? "text-green-600" : "text-yellow-600"}`}>{order.status}</span></p>
      </div>
    </div>
  );
};

export default SuccessPage;
