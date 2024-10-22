"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ui/ProgressBar";
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
  shippingAddress: string;
}

const SuccessPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderData = async () => {
    const token = localStorage.getItem('token'); // ตรวจสอบ Token

    if (!token) {
      console.error('No token found'); // ตรวจสอบว่ามี Token หรือไม่
      setLoading(false); // เปลี่ยนสถานะ loading เป็น false
      return;
    }

    try {
      const response = await axios.get("/api/orders", {
        headers: {
          'Authorization': `Bearer ${token}`, // ส่ง Token ใน Header
        },
      });
      const fetchedOrders = response.data;

      // ตรวจสอบคำสั่งซื้อสุดท้าย
      if (fetchedOrders.length > 0) {
        const latestOrder = fetchedOrders[fetchedOrders.length - 1];
        console.log("Latest Order:", latestOrder); // ตรวจสอบคำสั่งซื้อล่าสุด

        
        const res_item = await axios.get(`/api/order_items?id=${latestOrder.order_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // ส่ง Token ใน Header
          },
        });
        const fetchedOrderItem = res_item.data;

        console.log("Order Item", fetchedOrderItem)

        console.log("Fetched Order Data:", fetchedOrders); // ดูข้อมูลทั้งหมด

        console.log("latestOrder.items", latestOrder)

        // แปลงข้อมูลจาก API ให้ตรงกับ Interface ที่คุณใช้
        const orderData: Order = {
          orderNumber: latestOrder.order_number,
          customerName: latestOrder.customer_name,
          orderDate: new Date(latestOrder.created_at).toLocaleString(),
          status: latestOrder.status,
          items: Array.isArray(fetchedOrderItem) ? fetchedOrderItem.map((item: { item_id: any; product_name: any; price: string; quantity: any; image_url: any; }) => ({
            id: item.item_id,
            name: item.product_name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            image: item.image_url,
          })) : [],
          shippingAddress: latestOrder.shipping_address,
        };

        setOrder(orderData);
      } else {
        console.log("No orders found."); // ไม่มีคำสั่งซื้อ
      }
    } catch (error) {
      console.error("ไม่สามารถดึงข้อมูลคำสั่งซื้อ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData(); // ดึงข้อมูลคำสั่งซื้อครั้งเดียวเมื่อคอมโพเนนต์โหลด
  
    // ลบ setInterval และดึงข้อมูลคำสั่งซื้อซ้ำทุก ๆ 5 วินาทีออก
  }, []); // ใช้ [] เพื่อให้ดึงข้อมูลเพียงครั้งเดียวเมื่อโหลดคอมโพเนนต์

  useEffect(() => {
    if (!order && !loading) {
      const timer = setTimeout(() => {
        router.push("/"); // เปลี่ยนเส้นทางหลังจาก 3 วินาที
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [order, loading, router]);

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
          <h2 className="text-lg font-semibold mb-4">ไม่พบคำสั่งซื้อที่สำเร็จ</h2>
          <p>กรุณาตรวจสอบสถานะการสั่งซื้อของคุณอีกครั้ง</p>
        </div>
      </div>
    );
  }

  // กำหนดขั้นตอนของโปรเกรสบาร์ตามสถานะของคำสั่งซื้อ
  let currentStep = 1;
  
  switch (order.status) {
    case "Pending":
      currentStep = 1;
      break;
    case "Prepare":
      currentStep = 2;
      break;
    case "Shipping":
      currentStep = 3;
      break;
    case "Completed":
      currentStep = 4;
      break;
    default:
      currentStep = 1; // กำหนดค่าเริ่มต้นในกรณีสถานะไม่ตรงเงื่อนไข
  }

  console.log("Current Step:", currentStep); // ตรวจสอบค่า currentStep

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <ProgressBar currentStep={currentStep - 1} />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold mb-6">คำสั่งซื้อสำเร็จ</h2>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">รายละเอียดคำสั่งซื้อ</h3>
          <p className="text-sm">เลขคำสั่งซื้อ: <span className="font-medium">{order.orderNumber}</span></p>
          <p className="text-sm">ชื่อผู้สั่งซื้อ: <span className="font-medium">{order.customerName}</span></p>
          <p className="text-sm">วันและเวลาสั่งซื้อ: <span className="font-medium">{order.orderDate}</span></p>
          <p className="text-sm">สถานะ: <span className={`font-medium ${order.status === "จัดส่งแล้ว" ? "text-green-600" : "text-yellow-600"}`}>{order.status}</span></p>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">รายการสินค้า</h3>
          {Array.isArray(order.items) && order.items.length > 0 ? (
            order.items.map((item: CartItem) => (
              <div key={item.id} className="grid grid-cols-2 justify-between items-center border p-4 mb-2 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:3000${item.image}`} // ใช้ Absolute URL
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-md h-10 object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">จำนวน: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right font-semibold">฿{item.price}</div>
              </div>
            ))
          ) : (
            <p>ไม่มีรายการสินค้า</p>
          )}
          {/* แสดงยอดรวม */}
          {order.items && (
            <div className="text-right font-semibold mt-2">
              รวมทั้งหมด: ฿
              {order.items.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)}
            </div>
          )}
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">ที่อยู่จัดส่ง</h3>
          <p className="text-sm">{order.shippingAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
