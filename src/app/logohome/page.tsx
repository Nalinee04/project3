// app/logohome/page.tsx

'use client';  // บอกว่าเป็น Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ใช้ useRouter จาก next/navigation
import Image from "next/image"; // ใช้สำหรับแสดงภาพ

export default function LogoPage() {
  const [logoData, setLogoData] = useState<{ url: string; alt: string } | null>(null);
  const [loading, setLoading] = useState(true); // ใช้จัดการสถานะการโหลด
  const router = useRouter(); // ใช้สำหรับเปลี่ยนหน้า

  // ดึงข้อมูลโลโก้จาก API
  useEffect(() => {
    async function fetchLogo() {
      const response = await fetch('/api/logo');  // ดึงข้อมูลโลโก้จาก API
      const data = await response.json();
      setLogoData(data);  // ตั้งค่าข้อมูลโลโก้
    }

    fetchLogo();
  }, []);

  // ตั้งเวลาให้เปลี่ยนหน้าไปที่หน้า login หลังจาก 3 วินาที
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // หยุดการโหลด
      router.push("/login"); // เปลี่ยนไปหน้าเข้าสู่ระบบ
    }, 3000); // 3 วินาที

    return () => clearTimeout(timer); // เคลียร์ timer เมื่อหน้าเพจกำลังจะถูกย้าย
  }, [router]);

  if (loading || !logoData) return <div>Loading...</div>; // ถ้ากำลังโหลดหรือไม่มีข้อมูลโลโก้

  return (
    <div className="splash-screen">
      <Image
        src={logoData.url}  // ใช้ URL โลโก้ที่ได้จาก API
        alt={logoData.alt}   // ใช้คำอธิบายโลโก้จาก API
        width={120}
        height={120}
        className="logo-spin"  // เพิ่มคลาสสำหรับแอนิเมชันหมุนโลโก้
      />
      <div className="loader"></div> {/* แอนิเมชันหมุน */}
    </div>
  );
}
