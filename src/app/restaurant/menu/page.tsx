"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiArrowLeft, FiPlus } from "react-icons/fi"; // ไอคอนบวกจาก react-icons

interface MenuItem {
  menu_id: number;
  shop_id: number;
  menu_name: string;
  price: number;
  cate_id: number;
  status: number;
  created_at: string;
  menu_image: string;
}

const MenuManagement = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "loading") {
      const storedShopId = localStorage.getItem("shop_id");
      const sessionShopId = session?.user?.shop_id ?? null;

      if (sessionShopId) {
        setShopId(sessionShopId);
        localStorage.setItem("shop_id", String(sessionShopId));
      } else if (storedShopId) {
        setShopId(parseInt(storedShopId, 10));
      }
    }
  }, [session, status]);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!shopId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/menu?shop_id=${shopId}`);
        const data = await res.json();

        if (data && Array.isArray(data.menu) && data.menu.length > 0) {
          setMenuItems(data.menu);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) fetchMenu();
  }, [shopId]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "shop") {
      router.push("/login");
    }
  }, [session, status, router]);

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      {/* Header with yellow background and back button */}
      <div className="bg-yellow-500 p-4 flex items-center justify-between text-white rounded-lg">
        <button
          onClick={() => router.back()} // ปุ่มย้อนกลับ
          className="text-white"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">🍽️ จัดการเมนู</h1>
        <div></div> {/* ตำแหน่งว่างๆ เพื่อปรับระยะห่าง */}
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">🍽️ จัดการเมนู</h1>

      {loading ? (
        <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
      ) : menuItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((menuItem) => (
            <Link key={menuItem.menu_id} href={`/restaurant/menu/${menuItem.menu_id}`}>
              <Card className="shadow-sm hover:shadow-lg transition-all p-4 bg-white rounded-lg overflow-hidden hover:bg-yellow-50 cursor-pointer h-full">
                <img
                  src={menuItem.menu_image || "/placeholder.png"}
                  alt={menuItem.menu_name}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
                <CardContent className="flex flex-col justify-between h-full">
                  <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">{menuItem.menu_name}</h2>
                  <p className="text-sm font-medium text-green-600 mt-2">{menuItem.price} บาท</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">ยังไม่มีเมนู</p>
      )}

      {/* เพิ่มปุ่มวงกลมที่มีไอคอนบวก */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => router.push("/restaurant/addmenu")}
          className="bg-yellow-500 text-white rounded-full p-4 shadow-lg hover:bg-yellow-600 transition-all"
        >
          <FiPlus size={24} />
        </button>
      </div>
    </div>
  );
};

export default MenuManagement;
