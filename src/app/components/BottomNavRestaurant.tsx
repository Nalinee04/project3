//com/bottomres
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";  
import {
  FaStore,
  FaClipboardList,
  FaUtensils,
  FaCog,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

const BottomNavRestaurant = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const visiblePaths = [
    "/restaurant/dashboard",
    "/restaurant/history",
    "/restaurant/menu",
    "/restaurant/editshop",
  ];

  if (!visiblePaths.includes(pathname)) return null;

  const toggleSettingsSheet = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const closeSettingsSheet = () => {
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // เคลียร์ Token
    router.push("/login"); // Redirect ไปหน้า Login
    closeSettingsSheet(); // ปิดเมนู
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-10">
        <Link
          href="/restaurant/dashboard"
          className={`flex flex-col items-center ${pathname === "/restaurant/dashboard" ? "text-black" : "text-gray-500"}`}
        >
          <FaStore size={24} />
          <span className="text-sm">หน้าหลัก</span>
        </Link>

        <Link
          href="/restaurant/menu"
          className={`flex flex-col items-center ${pathname === "/restaurant/menu" ? "text-black" : "text-gray-500"}`}
        >
          <FaUtensils size={24} />
          <span className="text-sm">เมนู</span>
        </Link>

        <Link
          href="/restaurant/history"
          className={`flex flex-col items-center ${pathname === "/restaurant/history" ? "text-black" : "text-gray-500"}`}
        >
          <FaClipboardList size={24} />
          <span className="text-sm">ประวัติ</span>
        </Link>

        <button
          onClick={toggleSettingsSheet}
          className={`flex flex-col items-center text-gray-500`}
        >
          <FaCog size={24} />
          <span className="text-sm">ตั้งค่า</span>
        </button>
      </nav>

      {/* Settings Sheet */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${isSettingsOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button onClick={closeSettingsSheet} className="absolute top-4 right-4 text-gray-500">
          <FaTimes size={24} />
        </button>

        <div className="p-4">
          <h2 className="text-xl font-semibold">ตั้งค่า</h2>

          {/* ปุ่มการจัดการร้าน */}
          <Link
            href="/restaurant/editshop"
            className="flex items-center space-x-2 py-3 hover:bg-gray-100 rounded-lg"
          >
            <FaStore size={20} />
            <span className="text-lg">การจัดการร้าน</span>
          </Link>

          {/* ปุ่มการจัดการเมนู */}
          <Link
            href="/restaurant/menu"
            className="flex items-center space-x-2 py-3 hover:bg-gray-100 rounded-lg"
          >
            <FaUtensils size={20} />
            <span className="text-lg">การจัดการเมนู</span>
          </Link>

          {/* ปุ่มออกจากระบบ */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 py-3 hover:bg-red-100 rounded-lg w-full text-red-600 mt-4"
          >
            <FaSignOutAlt size={20} />
            <span className="text-lg">ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Overlay คลิกปิดแผง */}
      {isSettingsOpen && (
        <div
          onClick={closeSettingsSheet}
          className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-10"
        ></div>
      )}
    </>
  );
};

export default BottomNavRestaurant;
