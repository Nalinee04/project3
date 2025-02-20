// app/api/logo/route.tsx
import { NextResponse } from 'next/server';

// สร้างฟังก์ชันที่ส่งข้อมูลโลโก้ไปยัง client
export async function GET() {
  const logoData = {
    url: '/images/logofoodd.png',  // ระบุ path ของโลโก้ที่คุณต้องการให้แสดง
    alt: 'Logo Description',  // คำอธิบายของโลโก้
  };

  // ส่งข้อมูลโลโก้ในรูปแบบ JSON
  return NextResponse.json(logoData);
}
