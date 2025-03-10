import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FiArrowLeft } from "react-icons/fi";
import Swal from "sweetalert2";

interface MenuItem {
  menu_id: number;
  menu_name: string;
  price: number;
  menu_image: string;
  cate_id: number;
  status: string;
}

interface Category {
  cate_id: number;
  cate_name: string;
}

const EditMenu = () => {
  const params = useParams();
  const menuId = Array.isArray(params.menuId)
    ? params.menuId[0]
    : params.menuId;
  const router = useRouter();
  const [menuData, setMenuData] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopStatus, setShopStatus] = useState<string>("closed");

  useEffect(() => {
    if (!menuId) return;

    const fetchData = async () => {
      try {
        const [menuRes, cateRes] = await Promise.all([
          fetch(`/api/menu/${menuId}`),
          fetch("/api/categories"),
        ]);

        if (!menuRes.ok || !cateRes.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ!");

        const menuJson = await menuRes.json();
        const cateJson = await cateRes.json();

        setMenuData(menuJson);
        setCategories(cateJson);
      } catch (error) {
        console.error("🚨 Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menuId]);

  useEffect(() => {
    const eventSource = new EventSource("/api/statusshop?stream=true");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📡 รับสถานะร้านแบบ Real-time:", data.status);
      setShopStatus(data.status);
    };

    eventSource.onerror = () => {
      console.error("🚨 SSE disconnected");
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const handleSave = async () => {
    if (!menuData) return;

    try {
      const res = await fetch(`/api/menu/${menuData.menu_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuData),
      });

      if (!res.ok) {
        throw new Error("บันทึกไม่สำเร็จ!");
      }

      Swal.fire({
        title: "อัปเดตสำเร็จ!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/restaurant/menu");
    } catch (error) {
      console.error("🚨 Error:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองอีกครั้ง",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="w-full fixed top-0 left-0 right-0 bg-yellow-500 p-4 flex items-center text-white shadow-md z-50">
        <button onClick={() => router.back()} className="text-white">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold mx-auto">แก้ไขเมนู</h1>
        <div className="w-6"></div>
      </div>
  
      <div className="mt-20">
        <div className="text-center text-lg font-semibold mb-4">
          ✅ สถานะร้านตอนนี้:{" "}
          <span
            className={shopStatus === "open" ? "text-green-500" : "text-red-500"}
          >
            {shopStatus === "open" ? "เปิด" : "ปิด"}
          </span>
        </div>
  
        {/* 🔥 แจ้งเตือนเมื่อร้านปิด */}
        {shopStatus === "closed" && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">
            🚨 ร้านปิดชั่วคราว ไม่สามารถสั่งอาหารได้
          </div>
        )}
  
        {loading ? (
          <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
        ) : menuData ? (
          <Card className="p-4 bg-white rounded-lg shadow-lg relative">
            {/* 🚫 แสดง Overlay เมื่อร้านปิด */}
            {shopStatus === "closed" && (
              <div className="absolute inset-0 bg-gray-300 opacity-50 flex items-center justify-center rounded-lg">
                <p className="text-lg font-semibold text-gray-700">
                  🚫 ร้านปิดชั่วคราว
                </p>
              </div>
            )}
  
            <img
              src={menuData.menu_image || "/placeholder.png"}
              alt={menuData.menu_name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <CardContent>
              <label className="block text-sm font-medium text-gray-700">
                ชื่อเมนู
              </label>
              <input
                type="text"
                value={menuData.menu_name}
                onChange={(e) =>
                  setMenuData({ ...menuData, menu_name: e.target.value })
                }
                className="w-full p-3 border rounded-lg mb-3 focus:ring-2"
                disabled={shopStatus === "closed"}
              />
  
              <label className="block text-sm font-medium text-gray-700">
                ราคา (บาท)
              </label>
              <input
                type="number"
                value={menuData.price}
                onChange={(e) =>
                  setMenuData({ ...menuData, price: Number(e.target.value) })
                }
                className="w-full p-3 border rounded-lg mb-3 focus:ring-2"
                disabled={shopStatus === "closed"}
              />
  
              <label className="block text-sm font-medium text-gray-700">
                ประเภทอาหาร
              </label>
              <select
                value={menuData.cate_id}
                onChange={(e) =>
                  setMenuData({ ...menuData, cate_id: Number(e.target.value) })
                }
                className="w-full p-3 border rounded-lg mb-3 focus:ring-2"
                disabled={shopStatus === "closed"}
              >
                {categories.map((cat) => (
                  <option key={cat.cate_id} value={cat.cate_id}>
                    {cat.cate_name}
                  </option>
                ))}
              </select>
  
              <label className="block text-sm font-medium text-gray-700">
                สถานะ
              </label>
              <select
                value={menuData.status}
                onChange={(e) =>
                  setMenuData({ ...menuData, status: e.target.value })
                }
                className="w-full p-3 border rounded-lg mb-3 focus:ring-2"
                disabled={shopStatus === "closed"}
              >
                <option value="open">เปิด</option>
                <option value="closed">ปิด</option>
              </select>
  
              <button
                onClick={handleSave}
                className={`w-full py-3 rounded-lg font-semibold text-lg ${
                  shopStatus === "closed"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
                disabled={shopStatus === "closed"}
              >
                บันทึก
              </button>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-red-500">ไม่พบข้อมูลเมนู</p>
        )}
      </div>
    </div>
  );
  
};

export default EditMenu;
