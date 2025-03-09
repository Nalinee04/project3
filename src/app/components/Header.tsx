//header
"use client";

import { usePathname } from "next/navigation";
import { CircleUser } from "lucide-react";
import Image from "next/image";
import Cart from "./Cart";

const Header = () => {
  const pathname = usePathname();

 // 🔹 รายชื่อหน้าที่ไม่ต้องแสดง Header
 const hiddenHeaderRoutes = ["/cart-empty", "/login", "/restaurant/dashboard","/restaurant/menu","/restaurant/addmenu","/roleres","/help","/helpres","/restaurant/editshop"];

 // ✅ ซ่อน Header ถ้า pathname อยู่ใน hiddenHeaderRoutes หรือเป็น "/restaurant/details"
 if (hiddenHeaderRoutes.includes(pathname) || pathname.startsWith("/restaurant/details")) {
   return null;
 }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-yellow-500 px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo.webp"
          alt="โลโก้ร้าน"
          width={40}
          height={40}
          className="rounded-full"
          priority
        />
        <span className="text-xl font-semibold text-black">SRU FOOD</span>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Cart />
        <CircleUser className="h-5 w-5 cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
