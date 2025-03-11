//app/menus/[shop_id]
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "../../../components/CartContext";
import { ArrowLeft } from "lucide-react";

interface MenuItem {
  menu_id: number;
  menu_name: string;
  menu_image: string;
  price: number;
  item_name: string; // เพิ่ม item_name (optional)
}

const MenuPage = () => {
  const { shop_id } = useParams();
  const router = useRouter();
  const pathname = usePathname(); // ✅ ตรวจสอบ path ปัจจุบัน
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [shopName, setShopName] = useState<string>("ร้านอาหาร");
  const [shopImage, setShopImage] = useState<string>("/images/photo.png");

  const { getTotalQuantity } = useCart();

  const [shopStatus, setShopStatus] = useState<string>("closed");

  const prevPageRef = useRef<string | null>(null);

  // ✅ ตั้งค่า prevPageRef และ sessionStorage
  useEffect(() => {
    const prevPage = sessionStorage.getItem("prevPage");
    if (prevPage !== "detail") {
      prevPageRef.current = "menu";
    }
    sessionStorage.setItem("prevPage", "menu"); // บันทึกหน้าปัจจุบันเป็น menu
  }, []);

  useEffect(() => {
    if (!shop_id) return;

    const fetchMenu = async () => {
      try {
        const res = await fetch(`/api/menu?shop_id=${shop_id}`);
        const data = await res.json();

        if (res.ok) {
          setShopName(data.shop_name);
          setShopImage(data.shop_image || "/images/photo.png");
          setMenuItems(data.menu);
          setShopStatus(data.shop_status || "closed");
        } else {
          console.error("Error fetching menu:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };

    fetchMenu();
  }, [shop_id]);

  return (
    <div className="relative">
      {/* รูปร้านอาหาร */}
      <div className="relative w-full h-48">
        <Image
          src={shopImage}
          alt={shopName}
          layout="fill"
          objectFit="cover"
          className="rounded-b-lg"
        />

        <button
          className="absolute top-3 left-3 bg-black/50 rounded-full p-2 shadow-lg border border-white/20 
             hover:bg-black/70 transition-all z-50"
          onClick={() => {
            const prevPage = sessionStorage.getItem("prevPage");

            if (prevPage === "detail") {
              sessionStorage.setItem("prevPage", "menu");
              router.replace("/menus"); // กลับไปหน้าเมนู
            } else if (prevPage === "menu") {
              sessionStorage.removeItem("prevPage");
              router.replace("/home"); // กลับไปหน้า Home ทันที
            } else {
              sessionStorage.removeItem("prevPage");
              router.back();
            }
          }}
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>

        {/* ชื่อร้านอาหาร */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold drop-shadow-lg">
          {shopName}
        </div>

        {/* สถานะร้าน (เปิด/ปิด) */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 text-sm font-semibold rounded-full shadow-lg ${
            shopStatus === "open"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {shopStatus === "open" ? "เปิด" : "ปิด"}
        </div>
      </div>

      {/* รายการเมนู */}
      <div className="p-4">
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((menu) => (
              <Card
                key={`${menu.menu_id}-${menu.item_name}`} // ใช้ menu_id + item_name เพื่อให้ key ไม่ซ้ำกัน
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  sessionStorage.setItem("prevPage", "detail"); // ✅ บันทึกหน้าก่อนหน้าเป็น detail
                  router.push(`/detail?menu_id=${menu.menu_id}`);
                }}
              >
                <Image
                  src={
                    menu.menu_image && menu.menu_image !== "NULL"
                      ? menu.menu_image
                      : "/images/photo.png"
                  }
                  alt={menu.menu_name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-20 h-20"
                />

                <CardContent className="ml-4">
                  <h3 className="text-lg text-gray-600 font-normal">
                    {menu.menu_name}
                  </h3>
                  <p className="text-gray-700 font-semibold">{menu.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">ไม่พบเมนูสำหรับร้านนี้</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
