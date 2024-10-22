import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: string;
  order_number: string;
  customer_name: string;
  totalAmount: number;
  shipping_address?: string;
  created_at: string;
  deliveryTime: string;
  status: string;
  is_rainy?: boolean;
  items: OrderItem[];
}

const OrderDetail = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order detail");
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order detail:", error);
        setError("Could not fetch order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>; // Consider a spinner here
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!order) {
    return <div>No order found.</div>;
  }

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="flex items-center mb-4">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        กลับ
      </button>
      <h1 className="text-2xl font-bold mb-4">รายละเอียดคำสั่งซื้อ</h1>
      <div className={`bg-white p-4 rounded shadow mb-4 ${order.is_rainy ? "bg-yellow-100" : ""}`}>
        <p><strong>หมายเลขคำสั่งซื้อ:</strong> {order.order_number}</p>
        <p><strong>ชื่อลูกค้า:</strong> {order.customer_name}</p>
        <p><strong>ยอดเงินรวม:</strong> {order.totalAmount} บาท</p>
        <p><strong>ที่อยู่จัดส่ง:</strong> {order.shipping_address || "ไม่มีข้อมูล"}</p>
        <p><strong>สถานะ:</strong> {order.status}</p>
        <p><strong>เวลาที่ลูกค้าเริ่มสั่ง:</strong> {new Date(order.created_at).toLocaleString()}</p>
        <p><strong>เวลาที่ลูกค้าได้รับสินค้า:</strong> {order.deliveryTime || "ยังไม่มีการจัดส่ง"}</p>
        <p><strong>สถานะออเดอร์ฝนตก:</strong> {order.is_rainy ? "ใช่" : "ไม่ใช่"}</p>
      </div>

      <h2 className="text-xl font-bold mb-2">รายการสินค้าในคำสั่งซื้อ</h2>
      {order.items.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ชื่อสินค้า</th>
              <th className="border border-gray-300 p-2">จำนวน</th>
              <th className="border border-gray-300 p-2">ราคา (บาท)</th>
              <th className="border border-gray-300 p-2">รวม (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.product_id}>
                <td className="border border-gray-300 p-2">{item.product_name}</td>
                <td className="border border-gray-300 p-2">{item.quantity}</td>
                <td className="border border-gray-300 p-2">{item.price}</td>
                <td className="border border-gray-300 p-2">{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>ไม่มีรายการสินค้าในคำสั่งซื้อนี้</p>
      )}
    </div>
  );
};

export default OrderDetail;
