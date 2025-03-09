//res/order
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

interface Order {
  order_id: number;
  order_number: string;
  customer_name: string;
  status: string;
  created_at: string;
}

const Orders = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลคำสั่งซื้อ
  const fetchOrders = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch("/api/orders?status=รอดำเนินการ", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

      const data: Order[] = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setLoading(false);
    }
  }, [session?.accessToken]);

  // ฟังก์ชันจัดการสถานะคำสั่งซื้อ
  const handleOrderAction = async (orderId: number, action: string) => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

      // รีเฟรชคำสั่งซื้อหลังจากการดำเนินการ
      fetchOrders();
      toast.success(`คำสั่งซื้อ ${action} สำเร็จ!`);
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาดในการ ${action} คำสั่งซื้อ`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "shop") {
      router.push("/login");
    } else {
      fetchOrders();
    }
  }, [session, status, fetchOrders]);

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">📦 คำสั่งซื้อ</h1>

      {/* คำสั่งซื้อ */}
      <Card className="shadow-lg p-6 bg-white">
        <CardContent>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">รายการคำสั่งซื้อ</h2>
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left">Order Number</th>
                  <th className="px-6 py-3 text-left">Customer Name</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Created At</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} className="border-b">
                    <td className="px-6 py-3">{order.order_number}</td>
                    <td className="px-6 py-3">{order.customer_name}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full ${order.status === "รอดำเนินการ"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{order.created_at}</td>
                    <td className="px-6 py-3">
                      {order.status === "รอดำเนินการ" && (
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleOrderAction(order.order_id, "confirm")}
                            className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                          >
                            รับออเดอร์
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleOrderAction(order.order_id, "cancel")}
                            className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          >
                            ยกเลิก
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
