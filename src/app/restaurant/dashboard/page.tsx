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
  customer_phone: string;
  created_at: string;
  status: string;
}

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [dailySales, setDailySales] = useState<number>(0);
  const [monthlySales, setMonthlySales] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);

  // ตรวจสอบสิทธิ์การเข้าใช้ dashboard
  useEffect(() => {
    if (status === "loading") return; // รอให้ session โหลดเสร็จก่อน
    if (!session?.user || session.user.role !== "shop") {
      router.push("/login");
    }
  }, [session, status]);

  // ดึงคำสั่งซื้อ
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
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  }, [session?.accessToken]);

  // ดึงยอดขาย
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

      setDailySales(Number(data.total_sales) || 0);
      setMonthlySales(Number(data.monthly_sales) || 0);
    } catch (error) {
      console.error("❌ Error fetching sales data:", error);
    }
  }, [session?.accessToken]);

  // ดึงสถานะร้านค้าเมื่อโหลดหน้า
  const fetchShopStatus = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch("/api/statusshop", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setIsOpen(data.status === "open"); // ตั้งค่าตามสถานะร้าน
    } catch (error) {
      console.error("❌ Error fetching shop status:", error);
    }
  }, [session?.accessToken]);

  // เรียก API เมื่อ session โหลดเสร็จ
  useEffect(() => {
    if (session?.accessToken) {
      fetchOrders();
      fetchSalesData();
      fetchShopStatus();
    }
  }, [session]);

  // อัปเดตสถานะร้านค้าพร้อมดีเลย์ 2 วิ
  const updateShopStatus = async (status: string) => {
    if (!session?.accessToken) return;
    try {
      setTimeout(async () => {
        const res = await fetch("/api/statusshop", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        console.log("✅ Shop Status Updated:", status);
      }, 2000); // ดีเลย์ 2 วินาที
    } catch (error) {
      console.error("❌ Error updating shop status:", error);
    }
  };

  // Handle สวิตช์เปลี่ยนสถานะร้านค้า
  const handleSwitchChange = () => {
    if (!session) return;
    const newStatus = isOpen ? "closed" : "open";
    setIsOpen(!isOpen);
    updateShopStatus(newStatus);
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-gray-50">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 right-0 bg-yellow-500 text-white px-6 py-4 shadow-md flex items-center justify-between">
        <h1 className="text-3xl font-semibold">📊 Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Switch checked={isOpen} onCheckedChange={handleSwitchChange}>
            <span className="text-lg">{isOpen ? "เปิด" : "ปิด"}</span>
          </Switch>
        </div>
      </div>

      {/* Sales Summary */}
      <Card className="shadow-xl bg-white rounded-lg border border-gray-200 p-6 mb-6 mt-20">
        <CardContent>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">💰 ยอดขาย</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-600">ยอดขายวันนี้</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(dailySales)}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-600">ยอดขายเดือนนี้</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(monthlySales)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order List */}
      <div className="mt-6 flex-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📜 คำสั่งซื้อที่รอการดำเนินการ</h2>
        {orders.length === 0 ? (
          <p className="text-xl text-gray-600">ไม่มีคำสั่งซื้อที่รอการดำเนินการ</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <Link href={`/restaurant/details?order_id=${order.order_id}`} key={order.order_id}>
                <li className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition duration-300 cursor-pointer">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">{order.order_number} (#{order.order_id})</h3>
                    <span className={`text-sm font-semibold ${order.status === "pending" ? "text-yellow-500" : "text-green-500"}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">👤 {order.customer_name}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
      <BottomNavRestaurant />
    </div>
  );
};

export default Dashboard;
