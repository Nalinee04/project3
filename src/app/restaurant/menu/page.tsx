"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiArrowLeft, FiPlus, FiEdit } from "react-icons/fi";

interface MenuItem {
  menu_id: number;
  menu_name: string;
  price: number;
  menu_image: string;
  status: number;
}

const MenuManagement = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "shop") {
      router.push("/login");
      return;
    }

    const storedShopId = localStorage.getItem("shop_id");
    const finalShopId = session?.user?.shop_id ?? (storedShopId ? parseInt(storedShopId, 10) : null);
    if (finalShopId) {
      setShopId(finalShopId);
      localStorage.setItem("shop_id", String(finalShopId));
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!shopId) return;

      try {
        const res = await fetch(`/api/menu?shop_id=${shopId}`);
        const data = await res.json();
        setMenuItems(Array.isArray(data.menu) ? data.menu : []);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) fetchMenu();
  }, [shopId]);

  return (
    <div className="p-4 space-y-4 bg-gray-100 min-h-screen pt-20">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 right-0 bg-yellow-500 p-4 flex items-center text-white shadow-lg z-50">
        <button onClick={() => router.back()} className="text-white">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">รายละเอียดคำสั่งซื้อ</h1>
      </div>

      {/* Main Content */}
      {loading ? (
        <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
      ) : menuItems.length > 0 ? (
        <div className="space-y-4">
          {menuItems.map((menuItem) => (
            <div key={menuItem.menu_id} className="flex items-center bg-white shadow-lg rounded-lg p-4">
              <img
                src={menuItem.menu_image || "/placeholder.png"}
                alt={menuItem.menu_name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold text-gray-800">{menuItem.menu_name}</h2>
                <p className="text-gray-600 font-medium">฿{Number(menuItem.price).toFixed(2)}</p>
                <p className={`text-sm font-bold ${menuItem.status === 1 ? "text-green-500" : "text-red-500"}`}>
                  {menuItem.status === 1 ? "🟢 เปิด" : "🔴 ปิด"}
                </p>
              </div>

              <Link href={`/restaurant/menu/${menuItem.menu_id}/edit`}>
                <button className="bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 transition-all">
                  <FiEdit size={20} />
                </button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">ยังไม่มีเมนู</p>
      )}

      {/* Floating Add Button */}
      <Link href="/restaurant/addmenu" className="fixed bottom-6 right-6">
        <button className="bg-yellow-500 text-white rounded-full p-4 shadow-xl hover:bg-yellow-600 transition-all">
          <FiPlus size={24} />
        </button>
      </Link>
    </div>
  );
};

export default MenuManagement;
