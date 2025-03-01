"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

interface MenuItem {
  menu_id?: number;
  menu_name?: string;
  price?: number;
  category?: string;
  status: number;
  menu_image?: string;
  shop_id?: string;
  options?: {
    group_id: number;
    group_name: string;
    is_required: number;
    max_select: number;
    options: {
      item_id: number;
      item_name: string;
      add_price: number;
    }[]; 
  }[]; 
}

const EditMenu = () => {
  const router = useRouter();
  const { shop_id, menu_id } = useParams();
  const { data: session, status } = useSession();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch menu item from API
  const fetchMenuItem = async () => {
    console.log("Fetching menu item...");
    if (!session?.accessToken || !menu_id || !session.user.shop_id) {
      console.log("Missing session data or menu_id, returning early");
      return;
    }
    try {
      console.log("Making API call to fetch menu item...");
      const res = await fetch(`/api/menu/detail?menu_id=${menu_id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      console.log("API response status:", res.status);
      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

      const data: MenuItem = await res.json();
      console.log("Fetched data:", data);

      if (String(data.shop_id) !== String(session.user.shop_id)) {
        toast.error("คุณไม่มีสิทธิ์แก้ไขเมนูนี้!");
        router.push("/restaurant/menu");
        return;
      }

      setMenuItem(data);
    } catch (error) {
      console.error("❌ Error fetching menu item:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดเมนู!");
      router.push("/restaurant/menu");
    } finally {
      setLoading(false);
    }
  };

  // Update menu item
  const updateMenuItem = async () => {
    if (!session?.accessToken || !menuItem || !menu_id || !shop_id) return;

    console.log("Updating menu item:", menuItem);

    try {
      const res = await fetch(`/api/menus/${shop_id}/${menu_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menu_name: menuItem.menu_name || "",
          price: menuItem.price || 0,
          cate_id: menuItem.category || "",
          status: menuItem.status,
          menu_image: menuItem.menu_image || "",
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

      console.log("Menu item updated successfully");
      toast.success("อัปเดตเมนูเรียบร้อย!");
      router.push("/restaurant/menu");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอัปเดตเมนู!");
      console.error(error);
    }
  };

  // Toggle menu item status
  const updateMenuStatus = async () => {
    if (!session?.accessToken || !menu_id || !shop_id) return;

    console.log("Toggling menu status for menu_id:", menu_id);

    try {
      const res = await fetch(`/api/menus/${shop_id}/${menu_id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: menuItem?.status === 1 ? 0 : 1,
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);

      console.log("Menu status updated successfully");
      toast.success("อัปเดตสถานะเมนูเรียบร้อย!");
      setMenuItem({ ...menuItem, status: menuItem?.status === 1 ? 0 : 1 });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอัปเดตสถานะเมนู!");
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("Checking session status:", status);
    console.log("Session data:", session);  // ตรวจสอบ session
    console.log("menu_id from URL:", menu_id);  // ตรวจสอบ menu_id

    if (status === "loading") return;
    if (!session || session.user.role !== "shop") {
      console.log("Redirecting to login page, invalid session or user role");
      router.push("/login");
    } else if (!menu_id) {
      console.log("menu_id is missing, redirecting...");
      router.push("/restaurant/menu");  // ถ้า menu_id ไม่มี ให้กลับไปหน้าเมนู
    } else {
      console.log("Session valid, fetching menu item");
      fetchMenuItem();
    }
}, [session, status, menu_id]);


  // Loading state
  if (loading) return <p className="text-center text-gray-600">กำลังโหลด...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">📝 แก้ไขเมนู</h1>

      {menuItem && (
        <Card className="shadow-lg p-6 bg-white">
          <CardContent>
            <Input
              value={menuItem.menu_name || ""}
              onChange={(e) => {
                console.log("Updating menu_name:", e.target.value);
                setMenuItem({ ...menuItem, menu_name: e.target.value });
              }}
              placeholder="ชื่อเมนู"
              className="w-full mb-4"
            />
            <Input
              value={menuItem.price || 0}
              onChange={(e) => {
                console.log("Updating price:", e.target.value);
                setMenuItem({ ...menuItem, price: +e.target.value });
              }}
              placeholder="ราคา"
              type="number"
              className="w-full mb-4"
            />
            <Input
              value={menuItem.category || ""}
              onChange={(e) => {
                console.log("Updating category:", e.target.value);
                setMenuItem({ ...menuItem, category: e.target.value });
              }}
              placeholder="ประเภทเมนู"
              className="w-full mb-4"
            />
            <Input
              value={menuItem.menu_image || ""}
              onChange={(e) => {
                console.log("Updating menu_image:", e.target.value);
                setMenuItem({ ...menuItem, menu_image: e.target.value });
              }}
              placeholder="URL รูปภาพ"
              className="w-full mb-4"
            />

            <div className="mb-4 flex items-center">
              <span className="mr-4">สถานะเมนู:</span>
              <Button
                onClick={updateMenuStatus}
                className={`w-24 h-8 rounded-md ${menuItem.status ? "bg-green-500" : "bg-red-500"} text-white`}
              >
                {menuItem.status === 1 ? "เปิด" : "ปิด"}
              </Button>
            </div>

            <Button onClick={updateMenuItem} className="w-full bg-yellow-500 text-white">
              อัปเดตเมนู
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditMenu;
