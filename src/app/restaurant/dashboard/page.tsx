"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Switch from "@/components/ui/switch";
import { formatCurrency } from "@/app/utils/format";
import { useSession } from "next-auth/react";
import Link from "next/link";
import BottomNavRestaurant from "@/app/components/BottomNavRestaurant";


interface Order {
  order_id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string; // ✅ เพิ่มเบอร์โทร
  created_at: string; // ✅ เพิ่มวันที่เวลาที่สั่ง
  status: string;
}

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [dailySales, setDailySales] = useState<number>(0);
  const [monthlySales, setMonthlySales] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);

  // ฟังก์ชันที่เรียก API เพื่อนำข้อมูลคำสั่งซื้อ
  const fetchOrders = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch("/api/orders?status=pending", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

      const data = await res.json();
      console.log("✅ Orders Data:", data); // Debug Log
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  }, [session?.accessToken]);

  // ฟังก์ชันที่เรียก API เพื่อนำข้อมูลยอดขาย
  const fetchSalesData = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch("/api/sale", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

      const data = await res.json();
      console.log("✅ API Response:", data); // Debug ดูค่าที่ API ส่งมา

      setDailySales(Number(data.total_sales) || 0); // ✅ ใช้ total_sales เป็นยอดขายรายวัน
      setMonthlySales(Number(data.monthly_sales) || 0); // ✅ ตรวจสอบว่า API มี total_monthly_sales หรือไม่
    } catch (error) {
      console.error("❌ Error fetching sales data:", error);
    }
  }, [session?.accessToken]);

  // ฟังก์ชันที่เรียก API เพื่ออัปเดตสถานะร้าน (เปิด/ปิด)
  const updateShopStatus = async (status: string) => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch("/api/statusshop", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
      const data = await res.json();
      console.log("✅ Shop Status Updated:", data);
    } catch (error) {
      console.error("❌ Error updating shop status:", error);
    }
  };

  // เมื่อค่า session โหลดเสร็จ, ให้ตรวจสอบว่า session มีค่าหรือไม่
  useEffect(() => {
    if (status === "loading") return; // รอ session โหลดเสร็จ
    if (!session || session.user.role !== "shop") {
      router.push("/login"); // ถ้าไม่มี session หรือไม่ใช่ shop role ให้ redirect ไปหน้า login
      return;
    }

    fetchOrders();
    fetchSalesData();
  }, [session, status]); // ตรวจสอบการเปลี่ยนแปลง session และ status เท่านั้น

  // ฟังก์ชันเพื่อ handle การเปลี่ยนสถานะของ switch
  const handleSwitchChange = () => {
    setIsOpen((prevState) => {
      const newStatus = !prevState ? "open" : "closed";
      updateShopStatus(newStatus); // อัปเดตสถานะร้านตามที่เลือก
      return !prevState; // Toggle ค่า isOpen
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-yellow-500 text-white p-4 rounded-lg shadow-md mb-6">
      <header className="w-full bg-yellow-500 text-white py-4 px-6 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-10">
        <h1 className="text-2xl font-semibold">📊 Dashboard</h1>
        <Switch checked={isOpen} onCheckedChange={() => setIsOpen(!isOpen)}>
          <span className="text-lg">{isOpen ? "เปิดร้าน" : "ปิดร้าน"}</span>
        </Switch>
      </header>
      </div>

      {/* Sales Summary */}
      <Card className="shadow-xl bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <CardContent>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            💰 ยอดขาย
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-600">ยอดขายวันนี้</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(dailySales)}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-600">ยอดขายเดือนนี้</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(monthlySales)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order List */}
      <div className="mt-6 flex-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📜 คำสั่งซื้อที่รอการดำเนินการ
        </h2>
        {orders.length === 0 ? (
          <p className="text-xl text-gray-600">
            ไม่มีคำสั่งซื้อที่รอการดำเนินการ
          </p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <Link
                href={`/restaurant/details?order_id=${order.order_id}`}
                key={order.order_id}
              >
                <li className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition duration-300 cursor-pointer">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {order.order_number} (#{order.order_id})
                    </h3>
                    <span
                      className={`text-sm font-semibold ${
                        order.status === "pending"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">👤 {order.customer_name}</p>
                  <p className="text-gray-600">
                    📅 {new Date(order.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-600">📞 {order.customer_phone}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
      <BottomNavRestaurant /> {/* ✅ ใส่ใน return */}
    </div>
    
  );
};

export default Dashboard;
