import { RowDataPacket } from "mysql2";
import { NextResponse } from 'next/server';
import connection from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST() {
  console.log('POST request received');  // ตรวจสอบว่า POST route ถูกเรียกแล้ว

  try {
    const [shops]: [RowDataPacket[], any] = await connection.query("SELECT shop_id, password FROM shops");
    
    console.log('Shops data:', shops); // ตรวจสอบข้อมูลที่ได้จาก query

    for (const shop of shops) {
      console.log(`Processing shop with shop_id: ${shop.shop_id}`);  // ตรวจสอบการวนลูปข้อมูล

      if (!shop.password.startsWith("$2b$")) { // ตรวจสอบว่าถ้ายังไม่ถูกเข้ารหัส
        const hashedPassword = await bcrypt.hash(shop.password, 10);
        console.log(`Hashing password for shop_id: ${shop.shop_id}`);  // ตรวจสอบการแฮชรหัสผ่าน
        await connection.query("UPDATE shops SET password = ? WHERE shop_id = ?", [hashedPassword, shop.shop_id]);
      }
    }

    console.log('Password update completed');  // ตรวจสอบว่าอัปเดตเสร็จแล้ว

    return NextResponse.json({ message: "อัปเดตรหัสผ่านทั้งหมดเรียบร้อย!" });
  } catch (error: any) {
    console.error('Error:', error);  // ตรวจสอบข้อผิดพลาดจากการจับ
    return NextResponse.json({ error: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}
