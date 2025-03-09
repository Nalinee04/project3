
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Navigating to login...");
      router.push("/login"); // 👉 เปลี่ยนไปหน้าล็อกอินหลังจาก 2.5 วินาที
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  console.log("Rendering SplashScreen...");
  console.log("Rendering Image with src: /logofood.webp");

  return (
    <div className="flex items-center justify-center h-screen bg-[#ffc400]"> {/* ตั้งให้เต็มหน้าจอและใช้สีเดียวกับ header */}
      <motion.div
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="rounded-full p-2 bg-white drop-shadow-xl" // ขอบมนและเงา
      >
        <Image
          src="/logofood.webp"  // ไฟล์ภาพที่อยู่ในโฟลเดอร์ public
          alt="App Logo"
          width={120}
          height={120}
          priority={false}
          className="rounded-full"  // ขอบมน
        />
      </motion.div>
    </div>
  );
};

export default SplashScreen;
