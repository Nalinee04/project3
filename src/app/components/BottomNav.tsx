"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaShoppingCart,
  FaHistory,
  FaEllipsisH,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/components/CartContext";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const BottomNav = () => {
  const pathname = usePathname();
  const { getTotalQuantity } = useCart();
  const totalItems = getTotalQuantity();
  const router = useRouter(); // ใช้สำหรับ Redirect
  const [openLogout, setOpenLogout] = useState(false); // state สำหรับควบคุมการเปิด dialog
 // กำหนดว่าหน้าไหนที่ต้องการให้ BottomNav แสดง
 const visiblePaths = ["/home", "/cart", "/history"];

 // useEffect ควรอยู่ก่อน return หรือเงื่อนไขที่มี return
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found, redirecting to login...");
    router.replace("/login"); // ถ้าไม่มี token จะ redirect ไปหน้า Login
  }
}, [router]);

// 🔹 ตรวจสอบเงื่อนไขซ่อน BottomNav หลังจากที่ใช้ Hooks แล้ว
if (!visiblePaths.includes(pathname)) {
  return null;
}


  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token"); // ล้าง Token
    setOpenLogout(false); // ปิด Dialog
    setTimeout(() => {
      console.log("Redirecting to login...");
      router.replace("/login"); // Redirect ไปหน้า Login
    }, 500); // Delay เล็กน้อยเพื่อให้การลบ token สำเร็จ
  };

  // ตอนนี้สามารถเรียกใช้ hooks ได้และไม่ต้องทำ early return ก่อน
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex flex-col items-center space-y-2 z-10">
      <div className="flex justify-between w-full space-x-4 md:space-x-6">
        <Link
          href="/home"
          className={`flex flex-col items-center ${
            pathname === "/home" ? "text-black" : "text-gray-500"
          }`}
        >
          <FaHome size={24} />
          <span className="text-sm">หน้าหลัก</span>
        </Link>
        <Link
          href={totalItems > 0 ? "/confirm" : "/cart-empty"} // เช็คว่ามีสินค้าหรือไม่
          className={`flex flex-col items-center ${
            pathname === (totalItems > 0 ? "/confirm" : "/cart-empty")
              ? "text-black"
              : "text-gray-500"
          }`}
        >
          <FaShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
          <span className="text-sm">ตะกร้า</span>
        </Link>

        <Link
          href="/history"
          className={`flex flex-col items-center ${
            pathname === "/history" ? "text-black" : "text-gray-500"
          }`}
        >
          <FaHistory size={24} />
          <span className="text-sm">ประวัติ</span>
        </Link>
        <Sheet>
          <SheetTrigger className="flex flex-col items-center text-gray-500">
            <FaEllipsisH size={24} />
            <span className="text-sm">เพิ่มเติม</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="sheet-content w-3/4 max-w-sm p-6 rounded-r-2xl shadow-lg"
          >
            <SheetHeader>
              <SheetTitle>ตั้งค่า</SheetTitle>
            </SheetHeader>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/edit"
                  className="flex items-center text-gray-700 space-x-2"
                >
                  <FaUser size={20} />
                  <span>บัญชีของฉัน</span>
                </Link>
              </li>

              <li>
                {/* ใช้ DialogClose แทน DialogCancel */}
                <Dialog open={openLogout} onOpenChange={setOpenLogout}>
                  <DialogTrigger asChild>
                    <button
                      className="flex items-center text-red-500 space-x-2"
                      onClick={() => setOpenLogout(true)} // เปิด dialog
                    >
                      <FaSignOutAlt size={20} />
                      <span>ออกจากระบบ</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="dialog-content max-w-sm mx-auto">
                    <DialogHeader>
                      <DialogTitle>ยืนยันการออกจากระบบ</DialogTitle>
                      <DialogDescription>
                        คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                      <DialogClose
                        onClick={() => setOpenLogout(false)} // ปิด Dialog
                      >
                        ยกเลิก
                      </DialogClose>
                      <DialogClose
                        onClick={handleLogout} // ทำการ logout และ redirect
                      >
                        ออกจากระบบ
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default BottomNav;
