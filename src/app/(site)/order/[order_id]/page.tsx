"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Order {
  order_id: string;
  order_number: string;
  customer_name: string;
  totalAmount: string | number;
  created_at: string;
  status: string;
  shop_name: string;
  items: {
    item_id: string;
    menu_name: string;
    price: number;
    quantity: number;
    menu_image: string;
  }[] | null;
}

const OrderDetailPage = () => {
  const router = useRouter();
  const { order_id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!order_id) return;
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(`/api/orders/${order_id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        setOrder(data);
        console.log("Order Data: ", data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetail();
  }, [order_id]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/his")}
          className="text-gray-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> กลับ
        </button>
        <h2 className="text-xl font-bold">รายละเอียดออเดอร์</h2>
      </div>

      {/* Order Detail */}
      {order ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">ข้อมูลออเดอร์</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">หมายเลขออเดอร์: {order.order_number}</p>
              <p className="text-sm text-gray-600">ร้าน: {order.shop_name}</p>
              <p className="text-sm text-gray-600">ลูกค้า: {order.customer_name}</p>
              <p className="text-sm text-gray-600">
                วันที่: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            {/* รายการเมนู */}
            <div>
              <h4 className="text-md font-semibold text-gray-700">รายการสินค้า</h4>
              {order.items && order.items.length > 0 ? (
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.item_id} className="flex items-center">
                      <Image
                        src={item.menu_image || "/path/to/default-image.jpg"}
                        alt={item.menu_name}
                        width={50}
                        height={50}
                        className="rounded-lg mr-4"
                      />
                      <div>
                        <p className="text-sm text-gray-800">{item.menu_name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x ฿{Number(item.price).toFixed(2)} {/* แปลง item.price เป็นตัวเลข */}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-500">ไม่มีรายการสินค้า</div>
              )}
            </div>

            {/* สรุปยอด */}
            <div className="mt-4">
              <p className="text-lg font-bold text-green-600">
                ยอดรวม: ฿{Number(order.totalAmount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">กำลังโหลดข้อมูล...</div>
      )}
    </div>
  );
};

export default OrderDetailPage;
