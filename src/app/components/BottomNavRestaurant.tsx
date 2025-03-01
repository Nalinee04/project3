"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaStore, FaClipboardList, FaUtensils, FaCog } from "react-icons/fa";

const BottomNavRestaurant = () => {
  const pathname = usePathname();

  // แสดงเฉพาะหน้าของร้านค้า
  const visiblePaths = ["/restaurant/dashboard", "/restaurant/orders", "/restaurant/menu", "/restaurant/settings"];
  if (!visiblePaths.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-10">
      <Link href="/restaurant/dashboard" className={`flex flex-col items-center ${pathname === "/restaurant/dashboard" ? "text-black" : "text-gray-500"}`}>
        <FaStore size={24} />
        <span className="text-sm">หน้าหลัก</span>
      </Link>

      <Link href="/restaurant/menu" className={`flex flex-col items-center ${pathname === "/restaurant/menu" ? "text-black" : "text-gray-500"}`}>
        <FaUtensils size={24} />
        <span className="text-sm">เมนู</span>
      </Link>

      <Link href="/restaurant/orders" className={`flex flex-col items-center ${pathname === "/restaurant/orders" ? "text-black" : "text-gray-500"}`}>
        <FaClipboardList size={24} />
        <span className="text-sm">ประวัติ</span>
      </Link>

      
      <Link href="/restaurant/settings" className={`flex flex-col items-center ${pathname === "/restaurant/settings" ? "text-black" : "text-gray-500"}`}>
        <FaCog size={24} />
        <span className="text-sm">ตั้งค่า</span>
      </Link>
    </nav>
  );
};

export default BottomNavRestaurant;
