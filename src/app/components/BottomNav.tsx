//compo/bot
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
import Swal from "sweetalert2"; // Import sweetalert2
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet"; // เพิ่มการใช้ SheetClose สำหรับการปิด Sheet

const BottomNav = () => {
  const pathname = usePathname();
  const { getTotalQuantity } = useCart();
  const totalItems = getTotalQuantity();
  const router = useRouter(); // ใช้สำหรับ Redirect
  const [openSheet, setOpenSheet] = useState(false); // state สำหรับการเปิด Sheet

  // กำหนดว่าหน้าไหนที่ต้องการให้ BottomNav แสดง
  const visiblePaths = ["/home", "/cart", "/order","/success","/his"];

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
    console.log("handleLogout triggered");

    // เพิ่ม log เพื่อดูว่า Swal.fire ถูกเรียกหรือไม่
    Swal.fire({
      title: "ยืนยันการออกจากระบบ",
      text: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Logging out...");
        localStorage.removeItem("token"); // ล้าง Token

        // ปิด Sheet ก่อนการเปลี่ยนหน้า
        setOpenSheet(false); // ปิด Sheet

        // ใช้ router.push เพื่อเปลี่ยนหน้าไปที่หน้า Login
        setTimeout(() => {
          console.log("Redirecting to login...");
          router.push("/login"); // ใช้ router.push เพื่อเปลี่ยนหน้าอย่างราบรื่น
        }, 500); // Delay เล็กน้อยเพื่อให้การลบ token สำเร็จ
      }
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex flex-col items-center space-y-2 z-10">
      <div className="flex justify-between w-full space-x-4 md:space-x-6">
        <Link
          href="/home"
          className={`flex flex-col items-center ${pathname === "/home" ? "text-black" : "text-gray-500"}`}
        >
          <FaHome size={24} />
          <span className="text-sm">หน้าหลัก</span>
        </Link>
        <Link
          href={totalItems > 0 ? "/confirm" : "/cart-empty"} // เช็คว่ามีสินค้าหรือไม่
          className={`flex flex-col items-center ${pathname === (totalItems > 0 ? "/confirm" : "/cart-empty") ? "text-black" : "text-gray-500"}`}
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
          href="/order"
          className={`flex flex-col items-center ${pathname === "/order" ? "text-black" : "text-gray-500"}`}
        >
          <FaHistory size={24} />
          <span className="text-sm">รายการ</span>
        </Link>
        <Sheet open={openSheet} onOpenChange={setOpenSheet}> {/* ทำให้ Sheet สามารถเปิดและปิดได้ */}
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
                <Link href="/edit" className="flex items-center text-gray-700 space-x-2">
                  <FaUser size={20} />
                  <span>บัญชีของฉัน</span>
                </Link>
              </li>
              <li>
                <button
                  className="flex items-center text-red-500 space-x-2"
                  onClick={handleLogout} // เรียกใช้การยืนยันการออกจากระบบ
                >
                  <FaSignOutAlt size={20} />
                  <span>ออกจากระบบ</span>
                </button>
              </li>
            </ul>
            <SheetClose> {/* ใช้เพื่อปิด Sheet */}</SheetClose>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default BottomNav;
