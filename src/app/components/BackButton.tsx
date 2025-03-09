//components/back
"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCategory } from "@/app/context/CategoryContext"; // ✅ ใช้ Context

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname(); // ✅ ดึง path ปัจจุบัน
  const { isCategorySelected, setSelectedCategory, setIsCategorySelected } = useCategory();

  const handleBack = () => {
    if (pathname === "/" && isCategorySelected) {
      setSelectedCategory(null);
      setIsCategorySelected(false);
    } else if (window.history.length > 1) {
      router.back(); // 🔄 ถ้ามีประวัติ ให้ย้อนกลับปกติ
    } else {
      router.push("/"); // 🏠 ถ้าไม่มีประวัติ ให้กลับไปหน้า Home
    }
  };
  

  return (
    <button
      className="absolute top-12 left-4 md:top-16 md:left-6 bg-black/50 rounded-full p-3 shadow-lg z-50 
                border border-white/20 hover:bg-black/70 transition-all"
      onClick={handleBack}
    >
      <ArrowLeft className="h-6 w-6 text-white" />
    </button>
  );
};

export default BackButton;
