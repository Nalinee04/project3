"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BillDetail from "../components/BillDetail";

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
  waitingTime: string;
}

const BillDetailPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const orderParam = query.get("order");

    if (orderParam) {
      try {
        const orderData = JSON.parse(decodeURIComponent(orderParam));
        setOrder(orderData);
      } catch (error) {
        console.error("Error parsing order data:", error);
        setError("มีข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ");
        setOrder(null);
      }
    } else {
      setError("ไม่พบคำสั่งซื้อหรือข้อมูลไม่ถูกต้อง");
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <BillDetail order={order} />
    </div>
  );
};

export default BillDetailPage;
