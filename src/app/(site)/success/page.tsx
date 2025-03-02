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
        // ดึง token จาก localStorage
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        console.log("🔑 Token ที่ได้จาก localStorage:", token); // ตรวจสอบ token

        // ตรวจสอบว่า token มีค่าหรือไม่
        if (!token) {
          console.warn("❌ Token ไม่พบใน localStorage");
          router.push("/login"); // หากไม่พบ token ให้ส่งไปหน้า login
          return;
        }

        // 📌 ดึงคำสั่งซื้อ
        const response = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` }, // ส่ง token ไปใน header
        });

        const fetchedOrders = response.data;
        console.log("📥 คำสั่งซื้อที่ได้รับจาก API:", fetchedOrders); // ตรวจสอบคำสั่งซื้อที่ได้รับ

        if (fetchedOrders.length > 0) {
          const latestOrder = fetchedOrders[0];
          console.log("📋 คำสั่งซื้อล่าสุด:", latestOrder); // ตรวจสอบคำสั่งซื้อล่าสุด

          if (!latestOrder.order_id) throw new Error("❌ ไม่พบ order_id");

          // 📌 ดึงรายการสินค้าโดยใช้ order_id
          const orderId = latestOrder.order_id;
          const { data: fetchedOrderItems } = await axios.get(`/api/order_items?order_id=${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }, // ส่ง token ไปใน header
          });
          console.log("📦 รายการสินค้าที่ได้รับจาก API:", fetchedOrderItems); // ตรวจสอบรายการสินค้าที่ได้รับ

          const orderData: Order = {
            orderNumber: latestOrder.order_number, // เพิ่มการแสดงเลขคำสั่งซื้อ
            customerName: latestOrder.customer_name,
            orderDate: new Date(latestOrder.created_at).toLocaleString(),
            status: latestOrder.status,
            items: Array.isArray(fetchedOrderItems)
              ? fetchedOrderItems.map((item: any) => ({
                  id: item.item_id,
                  name: item.menu_name,
                  price: Number(item.price),
                  quantity: item.quantity,
                  image: item.menu_image,
                }))
              : [],
            note: latestOrder.note,
          };

          console.log("📋 ข้อมูลคำสั่งซื้อที่เตรียมจะใช้:", orderData); // ตรวจสอบข้อมูลคำสั่งซื้อที่เตรียมจะใช้
          setOrder(orderData);
        } else {
          console.warn("⚠️ ไม่มีคำสั่งซื้อ");
        }
      } catch (error) {
        console.error("❌ ไม่สามารถดึงข้อมูลคำสั่งซื้อ:", error);
      } finally {
        console.log("🛑 การโหลดข้อมูลคำสั่งซื้อเสร็จสิ้น");
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [router]);

  useEffect(() => {
    if (!order && !loading) {
      const timer = setTimeout(() => {
        console.log("⏱️ การย้ายหน้าหลังจาก 3 วินาที...");
        router.push("/"); // แนะนำให้เปลี่ยนไปหน้าอื่น
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [order, loading, router]);

  const handleConfirmOrder = () => {
    console.log("✅ ยืนยันการส่งคำสั่งซื้อแล้ว!");
    router.push("/success"); // หรืออาจเปลี่ยนเส้นทางไปหน้าอื่น
  };

  if (loading) {
    console.log("⏳ กำลังโหลด...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  if (!order) {
    console.log("❌ ไม่พบคำสั่งซื้อที่สำเร็จ");
    return (
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold mb-4">ไม่พบคำสั่งซื้อที่สำเร็จ</h2>
          <p>กรุณาตรวจสอบสถานะการสั่งซื้อของคุณอีกครั้ง</p>
        </div>
      </div>
    );
  }

  const statusSteps: Record<string, number> = {
    'รอดำเนินการ': 1,
    'เตรียมอาหาร': 2,
    'เสร็จแล้ว': 3,
  };

  const currentStep = statusSteps[order.status] || 1;
  console.log("🔍 currentStep:", currentStep, "สถานะ:", order.status);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <ProgressBar currentStep={currentStep} />
      <SweetAlert
        orderStatus={order?.status ?? ""}
        onConfirm={handleConfirmOrder}
      />

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold mb-6">
          คำสั่งซื้อสำเร็จ
        </h2>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">รายละเอียดคำสั่งซื้อ</h3>
          <p className="text-sm">
            เลขคำสั่งซื้อ:{" "}
            <span className="font-medium">{order.orderNumber}</span>
          </p>
          <p className="text-sm">
            ชื่อผู้สั่งซื้อ:{" "}
            <span className="font-medium">{order.customerName}</span>
          </p>
          <p className="text-sm">
            วันและเวลาสั่งซื้อ:{" "}
            <span className="font-medium">{order.orderDate}</span>
          </p>
          <p className="text-sm">
            สถานะ:{" "}
            <span
              className={`font-medium ${
                order.status === "เสร็จแล้ว"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {order.status}
            </span>
          </p>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">รายการสินค้า</h3>
          {order.items.length > 0 ? (
            order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-2 items-center border p-4 mb-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image?.startsWith("http") ? item.image : `http://localhost:3000${item.image || ""}`}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-md h-10 object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      จำนวน: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right font-semibold">฿{item.price}</div>
              </div>
            ))
          ) : (
            <p>ไม่มีรายการสินค้า</p>
          )}
          {order.items.length > 0 && (
            <div className="text-right font-semibold mt-2">
              รวมทั้งหมด: ฿
              {order.items.reduce((total, item) => total + item.price * item.quantity, 0)}
            </div>
          )}
        </div>

        {order.note && (
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">หมายเหตุ</h3>
            <p className="text-sm">{order.note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
